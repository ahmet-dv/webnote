# Use a lightweight Node.js base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy only package.json since you don't want package-lock.json
COPY ./source/package.json ./

# Install dependencies without package-lock.json, omitting dev dependencies
RUN npm install --omit=dev --prefer-offline --no-audit --no-fund

# Copy the rest of the application
COPY ./source .

# Expose ports for HTTP and HTTPS
EXPOSE 80
EXPOSE 443

# Set NODE_ENV to production for optimized application behavior
ENV NODE_ENV=production

# Start the server with HTTP or HTTPS based on environment
CMD ["node", "index.js"]
