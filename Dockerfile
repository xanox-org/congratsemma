# Use nginx to serve the static HTML/CSS/JS files
FROM nginx:alpine

# Copy the application files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Copy nginx configuration (optional, using default)
# The default nginx configuration will serve index.html automatically

# Expose port 80
EXPOSE 80

# nginx runs automatically, no need for CMD