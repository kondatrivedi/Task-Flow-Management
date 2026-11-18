
# Use Node.js 22 as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy the remaining backend source code
COPY . .

# Application listens on port 5000
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
