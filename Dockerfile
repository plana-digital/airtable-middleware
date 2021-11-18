FROM node:16

WORKDIR /var/www/

# Install the application's dependencies into the node_modules's directory.
COPY ./app/package.json ./
COPY ./app/package-lock.json ./
RUN npm install

# Copy application
COPY ./app/ ./

# Default exposed port
EXPOSE 8080

# Set healthcheck for container and exit if not
HEALTHCHECK --timeout=5s \
	CMD curl --silent --fail http://localhost:${PORT}/.well-known/healthcheck.json || exit 1

# Copy and run entrypoint
COPY ./entrypoint.sh /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]
