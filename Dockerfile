FROM node:20

WORKDIR /usr/src/app

# Copy backend dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend source
COPY backend/ ./

EXPOSE 5001

CMD ["npm", "start"]
