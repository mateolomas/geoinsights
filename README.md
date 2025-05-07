# GeoInsights

A full-stack web application for geographic data visualization and analysis. This project demonstrates modern web development practices and geographic data handling capabilities.

## Features

- Interactive map visualization
- Geographic data analysis
- Real-time data updates
- User authentication
- Data import/export capabilities
- Custom geographic queries

## Tech Stack

### Frontend
- React with TypeScript
- Mapbox GL JS for map visualization
- Material-UI for modern UI components
- Redux for state management

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL with PostGIS
- JWT authentication

### Development
- Docker for containerization
- ESLint and Prettier for code quality
- Jest for testing
- GitHub Actions for CI/CD

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL with PostGIS extension

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/geoinsights.git
cd geoinsights
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

4. Start the development environment:
```bash
docker-compose up -d
```

5. Run the development servers:
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Project Structure

```
geoinsights/
├── frontend/           # React frontend application
├── backend/           # Node.js backend application
├── docker/           # Docker configuration files
└── docs/            # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 