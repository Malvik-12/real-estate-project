# Use Node.js LTS
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all backend code
COPY . .

# Expose backend port
EXPOSE 5001

# Start the backend
CMD ["npm", "run", "dev"]