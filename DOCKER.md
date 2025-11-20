# Docker Deployment Guide

This guide explains how to deploy the Yabadoo application using Docker.

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+ (optional, for docker-compose)

## Quick Start

### Using Docker Compose (Recommended)

1. **Build and start the application:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f yabadoo
   ```

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Using Docker CLI

1. **Build the Docker image:**
   ```bash
   docker build -t yabadoo:latest .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name yabadoo-app \
     -p 3000:3000 \
     -e NODE_ENV=production \
     yabadoo:latest
   ```

3. **View logs:**
   ```bash
   docker logs -f yabadoo-app
   ```

4. **Stop and remove the container:**
   ```bash
   docker stop yabadoo-app
   docker rm yabadoo-app
   ```

## Access the Application

Once the container is running, open your browser and navigate to:
```
http://localhost:3000
```

## Configuration

### Environment Variables

You can customize the deployment by setting environment variables:

- `NODE_ENV`: Set to `production` (default in docker-compose.yml)
- `PORT`: Internal port (default: 3000)
- `NEXT_TELEMETRY_DISABLED`: Disable Next.js telemetry (set to 1)

**Example with custom port mapping:**
```bash
docker run -d \
  --name yabadoo-app \
  -p 8080:3000 \
  -e NODE_ENV=production \
  yabadoo:latest
```

Then access the app at `http://localhost:8080`

### Volume Mounts (Optional)

If you need to persist data or override files, you can use volume mounts:

```bash
docker run -d \
  --name yabadoo-app \
  -p 3000:3000 \
  -v /path/to/your/public:/app/public \
  yabadoo:latest
```

## Production Deployment

### Using Docker Swarm

1. **Initialize Swarm (if not already):**
   ```bash
   docker swarm init
   ```

2. **Deploy the stack:**
   ```bash
   docker stack deploy -c docker-compose.yml yabadoo
   ```

3. **Check service status:**
   ```bash
   docker stack services yabadoo
   ```

### Using Kubernetes

Example deployment manifest:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: yabadoo
spec:
  replicas: 3
  selector:
    matchLabels:
      app: yabadoo
  template:
    metadata:
      labels:
        app: yabadoo
    spec:
      containers:
      - name: yabadoo
        image: yabadoo:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
---
apiVersion: v1
kind: Service
metadata:
  name: yabadoo
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: yabadoo
```

## Dockerfile Details

The Dockerfile uses a **multi-stage build** approach for optimal image size and security:

1. **Stage 1 (deps)**: Installs dependencies using pnpm
2. **Stage 2 (builder)**: Builds the Next.js application with standalone output
3. **Stage 3 (runner)**: Creates minimal runtime image with only production files

### Image Size Optimization

- Uses Alpine Linux base image (~5MB)
- Multi-stage build removes build dependencies
- Standalone output includes only required files
- Runs as non-root user (nextjs)

## Health Check

The docker-compose.yml includes a health check that:
- Tests the application every 30 seconds
- Waits 40 seconds before starting checks
- Retries 3 times before marking as unhealthy
- Times out after 10 seconds

## Troubleshooting

### Container won't start
Check logs:
```bash
docker logs yabadoo-app
```

### Port already in use
Change the port mapping:
```bash
docker run -p 8080:3000 yabadoo:latest
```

### Build fails
Ensure you're in the project root directory and have a stable internet connection for downloading dependencies.

### Application not accessible
Verify the container is running:
```bash
docker ps
```

Check if the port is exposed:
```bash
docker port yabadoo-app
```

## Security Best Practices

✅ Runs as non-root user (nextjs:nodejs)
✅ Minimal attack surface with Alpine Linux
✅ No development dependencies in production image
✅ Environment variables for sensitive configuration
✅ Health checks for reliability

## Updating the Application

1. **Pull latest changes:**
   ```bash
   git pull
   ```

2. **Rebuild the image:**
   ```bash
   docker-compose build
   ```

3. **Restart with new image:**
   ```bash
   docker-compose up -d
   ```

## Monitoring

### View resource usage:
```bash
docker stats yabadoo-app
```

### Inspect container details:
```bash
docker inspect yabadoo-app
```

## Support

For issues and questions, please open an issue on GitHub.
