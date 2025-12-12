FROM nginx:alpine

# Install envsubst for environment variable substitution
RUN apk add --no-cache gettext

# Copy built files
COPY build/client /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Set default environment variable
ENV VITE_API_BASE_URL=http://localhost:5173

EXPOSE 8386

# nginx will automatically process templates in /etc/nginx/templates/
# and substitute environment variables before starting
CMD ["nginx", "-g", "daemon off;"]
