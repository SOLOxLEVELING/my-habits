# Dockerfile

# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Bundle app source
COPY . .

# Your app binds to port 5001, but Fly.io expects 8080 by default.
# We expose the internal port your app runs on. Fly.io handles the rest.
EXPOSE 5001

# Define the command to run your app
CMD [ "npm", "start" ]