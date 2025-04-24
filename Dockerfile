# Use the OpenShift Node.js base image (will be overridden by BuildConfig if necessary)
FROM image-registry.openshift-image-registry.svc:5000/openshift/nodejs:latest

# Set working directory to a location where the non-root user has permissions
WORKDIR /opt/app-root/src

# Copy package files
COPY package*.json ./

# Fix permissions for the non-root user (optional, depending on image)
RUN chmod -R 755 /opt/app-root/src

# Install dependencies as the non-root user
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port (if your app uses one)
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]