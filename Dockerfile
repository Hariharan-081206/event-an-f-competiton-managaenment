# Use official Node.js image from Docker Hub
FROM node:18

# Copy only dependency files first (this enables Docker caching)
COPY package*.json ./

# Install all Node.js dependencies
RUN npm install

# Copy the rest of your project files
COPY . .

# Expose the port your app uses (change 3000 if needed)
EXPOSE 3000

# Start the Node.js app
CMD ["node", "server.js"]
