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
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api 