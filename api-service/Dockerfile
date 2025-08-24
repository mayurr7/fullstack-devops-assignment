FROM node:20

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Install debug tools (optional, for checking connectivity inside container)
RUN apt-get update && apt-get install -y netcat-openbsd curl && rm -rf /var/lib/apt/lists/*

# Expose API port
EXPOSE 5000

# Start the server
CMD ["node", "src/server.js"]
