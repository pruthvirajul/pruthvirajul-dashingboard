# Dashingboard - Docker Setup

## Overview
This project is containerized using Docker and Docker Compose. The setup includes:
- **Backend**: Node.js Express API (Port 3048)
- **Login Page**: Static server (Port 8152)
- **Sign Up Page**: Static server (Port 8153)
- **Forgot Password Page**: Static server (Port 8151)
- **Dashboard Page**: Static server (Port 8150)
- **Database**: PostgreSQL (Port 5432)

## Prerequisites
- Docker ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## Getting Started

### 1. Build and Start All Services
```bash
docker-compose up --build
```

This will:
- Create and start the PostgreSQL database
- Build and start the backend server
- Build and start all frontend pages
- Initialize the database with tables from `init.sql`

### 2. Access the Application
- **Login Page**: http://localhost:8152
- **Sign Up Page**: http://localhost:8153
- **Forgot Password Page**: http://localhost:8151
- **Dashboard Page**: http://localhost:8150
- **Backend API**: http://localhost:3048

### 3. Stop All Services
```bash
docker-compose down
```

### 4. Stop and Remove Volumes (Clean Database)
```bash
docker-compose down -v
```

## Environment Variables

The backend uses the following environment variables (defined in `docker-compose.yml`):
```
NODE_ENV=production
PORT=3048
JWT_SECRET=your_very_secure_jwt_secret_key_here_change_me
DB_USER=postgres
DB_HOST=postgres
DB_DATABASE=login
DB_PASSWORD=admin123
DB_PORT=5432
```

### To Change Environment Variables:
Edit the `docker-compose.yml` file under the `backend` service's `environment` section.

## Database

The PostgreSQL database is automatically initialized with tables defined in `init.sql`.

### Access PostgreSQL from Host:
```bash
psql -h localhost -U postgres -d login
```
(Password: `admin123`)

### Access PostgreSQL from Inside Container:
```bash
docker exec -it dashingboard-postgres psql -U postgres -d login
```

## Common Commands

### View logs from all services:
```bash
docker-compose logs -f
```

### View logs from specific service:
```bash
docker-compose logs -f backend
```

### Rebuild services:
```bash
docker-compose build --no-cache
```

### Run a single service:
```bash
docker-compose up backend
```

### Execute command in running container:
```bash
docker exec -it dashingboard-backend npm test
```

## File Structure
```
pruthvirajul-dashingboard/
├── Backend/
│   ├── server.js
│   ├── package.json
│   ├── server.env
│   └── Dockerfile
├── Dashboard/
│   └── index.html
├── Forgot_password/
│   └── index.html
├── Login/
│   └── index.html
├── Sign/
│   └── index.html
├── init.sql
├── docker-compose.yml
├── Dockerfile.login
├── Dockerfile.signup
├── Dockerfile.forgot
├── Dockerfile.dashboard
└── .dockerignore
```

## Troubleshooting

### Port Already in Use
If a port is already in use, either:
1. Stop the process using that port
2. Change the port mapping in `docker-compose.yml` (e.g., `8152:8152` to `8154:8152`)

### Database Connection Failed
1. Ensure PostgreSQL service is healthy: `docker-compose ps`
2. Check logs: `docker-compose logs postgres`
3. Verify the database has started (wait a few seconds)

### CORS Errors
Update the allowed origins in [Backend/server.js](Backend/server.js) if accessing from different URLs.

### Rebuild and Restart
```bash
docker-compose down
docker-compose up --build
```

## Production Deployment

Before deploying to production:
1. Change `JWT_SECRET` to a strong, unique value
2. Set `NODE_ENV=production`
3. Update `secure: true` in server.js cookies for HTTPS
4. Use a reverse proxy (nginx) or cloud load balancer
5. Set up proper environment configuration management

## Security Notes
- Change default database passwords in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Implement proper authentication and authorization
- Keep Docker images updated
