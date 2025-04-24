# Use the OpenShift Node.js base image
FROM image-registry.openshift-image-registry.svc:5000/openshift/nodejs:latest

# Set working directory to a location where the non-root user has permissions
WORKDIR /opt/app-root/src

# Copy package files
COPY package*.json ./

# Install dependencies as the non-root user (relying on default permissions)
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port (if your app uses one)
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]