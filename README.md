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

## User Flow
1. Login with username 'EOU' (any password)
2. Type 'WRKSPLF' or select option '3'
3. Press '5' to display the congratulations message