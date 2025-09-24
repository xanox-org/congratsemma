# congratsemma

IBM i 5250 Green Screen Simulator with Emma's Bachelor of Science Congratulations

## Features

This application simulates an authentic IBM i 5250 green screen terminal to deliver a special congratulations message for Emma's Bachelor of Science diploma achievement.

- Authentic green screen styling with glowing effects
- Login screen (use username: EOU)
- Main menu with traditional IBM i options
- WRKSPLF command functionality
- Special congratulations message display

## Running the Application

### Local Development
1. Open `index.html` in a web browser
2. Or serve with a local HTTP server:
   ```bash
   python3 -m http.server 8000
   ```

### Docker
Build and run the Docker container:
```bash
# Build the image
docker build -t congratsemma .

# Run the container
docker run -p 8080:80 congratsemma
```

Then visit `http://localhost:8080` in your browser.

### GitHub Container Registry
The application is automatically built and pushed to GitHub Container Registry:
```bash
docker run -p 8080:80 ghcr.io/xanox-org/congratsemma:latest
```

### Automated Deployment
The application includes automated deployment to your Docker host via GitHub Actions. The deployment workflow:

1. **Automatic Deployment**: Triggered on pushes to main/master branch
2. **Manual Deployment**: Can be triggered via GitHub Actions workflow dispatch
3. **Container Management**: Automatically stops, updates, and restarts the container
4. **Health Checks**: Verifies successful deployment
5. **Docker Compose Support**: Automatically detects and uses docker-compose if available

#### Required Organization Secrets
Configure these secrets in your GitHub organization for automated deployment:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `SSH_HOST` | IP address or hostname of your Docker host | `192.168.1.100` |
| `SSH_USER` | SSH username for Docker host | `ubuntu` |
| `SSH_PRIVATE_KEY` | Private SSH key for Docker host authentication | `-----BEGIN OPENSSH PRIVATE KEY-----` |
| `DOCKER_PORT` | SSH port (optional, defaults to 22) | `22` |
| `DOCKER_APP_PORT` | Port to expose the app on (optional, defaults to 8080) | `8080` |

#### Docker Host Setup
Use the included setup script to prepare your Docker host:

```bash
# Download and run setup script on your Docker host
wget https://raw.githubusercontent.com/xanox-org/congratsemma/main/setup-docker-host.sh
chmod +x setup-docker-host.sh
./setup-docker-host.sh
```

This script will:
- Verify Docker installation
- Configure user permissions
- Set up Docker Compose (if available)
- Provide configuration values for GitHub secrets

#### Manual Deployment
You can trigger manual deployments from the GitHub Actions tab:
- Choose specific image tag to deploy
- Force recreate container option
- Real-time deployment logs and status

#### Docker Compose Deployment
For advanced deployments, use the included `docker-compose.yml`:

```bash
# Set environment variables
export APP_PORT=8080

# Deploy with docker-compose
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### Deployment Features
- **Zero-downtime deployment**: Container is replaced with minimal interruption
- **Automatic rollback**: Failed deployments are logged and reported
- **Health monitoring**: Built-in health checks ensure container is running properly
- **Image cleanup**: Old Docker images are automatically removed to save space
- **Flexible port configuration**: Configurable port mapping via secrets

## User Flow
1. Login with username 'EOU' (any password)
2. Type 'WRKSPLF' or select option '3'
3. Press '5' to display the congratulations message