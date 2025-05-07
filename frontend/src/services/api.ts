import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  // Allow redirects
  maxRedirects: 5,
  validateStatus: function (status) {
    return status >= 200 && status < 400; // Accept 2xx and 3xx status codes
  },
})

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const response = await api.post('/auth/refresh')
        const { access_token } = response.data

        // Update token in localStorage and headers
        localStorage.setItem('token', access_token)
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, clear token and redirect to login
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
        window.location.href = `/login?redirect=${window.location.pathname}`
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api