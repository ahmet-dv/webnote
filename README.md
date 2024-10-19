
# Notepad Web Application

A lightweight notepad web server built with Node.js, allowing users to create, view, edit, delete, and rename notes via a web interface. The application can be easily deployed using Docker and Docker Compose. This project is ideal for users who need a simple and persistent note-taking application that can be run in a local network or across multiple machines.

The notepad is useful for collaborative note-taking, personal reminders, or managing quick notes across multiple devices without needing a third-party service. By using this application, users can maintain their own self-hosted notepad with full control over data storage and network configuration.

## Features

- Add, view, edit, rename, and delete text-based notes.
- Responsive user interface with buttons aligned for easy navigation.
- Pages automatically open in new browser tabs.
- Dockerized for easy deployment and portability.
- Supports HTTP, HTTPS, or both modes via environment variables.
- SSL certificates can be mounted via Docker volumes.
- Configurable for local networks or specific IP addresses using Docker Compose.

## Table of Contents

- [Notepad Web Application](#notepad-web-application)
- [Features](#features)
- [What Is It For?](#what-is-it-for)
- [Docker Setup](#docker-setup)
  - [Build the Docker Container Using Docker Compose](#build-the-docker-container-using-docker-compose)
  - [Use Pre-Built Image from GitHub Container Registry](#use-pre-built-image-from-github-container-registry)
  - [Network Configuration](#network-configuration)
  - [Certificate Setup](#certificate-setup)
    - [Self-Generated Certificates](#self-generated-certificates)
  - [Accessing the Application](#accessing-the-application)
  - [Docker Compose Commands](#docker-compose-commands)
- [License](#license)

## What Is It For?

The Notepad Web Application is a simple, self-hosted note-taking service that can be deployed in a local network. This is particularly useful in environments where you want a shared notepad accessible over a local network, such as:

- Personal use in your home network.
- Collaborative work in a small office.
- Temporary note storage for shared devices without relying on cloud-based services.
- A lightweight solution for quick note management with the flexibility of Docker.

## Docker Setup

### Build the Docker Container Using Docker Compose

1. Clone this repository:

    ```bash
    git clone https://github.com/dockdv/webnote.git
    cd webnote
    ```

2. Build the Docker container using Docker Compose:

    ```bash
    docker compose build
    ```

3. Start the application using Docker Compose:

    ```bash
    docker compose up
    ```

### Use Pre-Built Image from GitHub Container Registry

If you want to skip building the image locally and use the pre-built image hosted on GitHub Container Registry, follow these steps:

1. **Update `compose.yml`**:

   Instead of building the Docker image locally, you can pull the image directly from **GitHub Container Registry**. Modify your `docker-compose.yml` file to use the pre-built image like this:

   ```yaml
   services:
     webnote:
       image: ghcr.io/dockdv/webnote:latest  # Use pre-built image from GitHub Container Registry
       container_name: webnote
       environment:
         - MODE=http    # Choose between 'http', 'https', or 'both'
         - HTTP_PORT=80
         - HTTPS_PORT=443
         - SSL_KEY_PATH=/path/to/ssl.key
         - SSL_CERT_PATH=/path/to/ssl.cert
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./data:/app/data
         - ./certs:/certs:ro
       networks:
         xlan:
           ipv4_address: 192.168.1.10  # Update with your preferred IP address

   networks:
     xlan:
       external: true
   ```

2. **Pull the Pre-Built Image**:

   You can directly pull the image from GitHub Container Registry by running:

   ```bash
   docker compose pull
   ```

   This will download the latest pre-built image from the registry.

3. **Start the Application**:

   After pulling the image, start the application with:

   ```bash
   docker compose up
   ```

   The application will now run using the pre-built image from GitHub Container Registry without needing to build it locally.

### Certificate Setup

To enable **HTTPS** for your Notepad Web Application, you will need to configure SSL certificates. Follow the steps below to set up SSL for secure connections:

1. **Obtain SSL Certificates**:

   You can obtain SSL certificates using services like Let's Encrypt or by purchasing certificates from a Certificate Authority (CA). Once you have the necessary certificates, you should have two files:
   - **SSL Key File** (e.g., `ssl.key`)
   - **SSL Certificate File** (e.g., `ssl.cert`)

2. **Mount SSL Certificates**:

   The Docker Compose file should be updated to mount the SSL certificates into the Docker container. Modify the `compose.yml` file as shown below to include volumes that point to your certificate paths:

   ```yaml
   services:
     webnote:
       environment:
         - MODE=https    # Enable HTTPS mode
         - HTTPS_PORT=443
         - SSL_KEY_PATH=/certs/ssl.key
         - SSL_CERT_PATH=/certs/ssl.cert
       ports:
         - "443:443"
       volumes:
         - ./certs:/certs:ro   # Mount the SSL certificates into the container
   ```

   Ensure that the `./certs` directory contains your `ssl.key` and `ssl.cert` files. These files will be mounted into the `/certs` directory within the container.

3. **Start the Container with HTTPS**:

   Once the certificates are properly mounted and the Docker Compose configuration is updated, start the container:

   ```bash
   docker compose up
   ```

   Your application will now be accessible over HTTPS at the IP address you configured (e.g., `https://192.168.1.10`).

### Self-Generated Certificates

If you prefer to generate self-signed certificates for testing or internal use, follow the steps below:

1. **Generate Self-Signed Certificates**:

   Use the following `openssl` command to generate self-signed certificates:

   ```bash
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout certs/ssl.key -out certs/ssl.cert
   ```

   This command creates a private key (`ssl.key`) and a self-signed certificate (`ssl.cert`) valid for 365 days. You will be prompted to enter information such as your country, state, and organization.

2. **Mount Self-Signed Certificates**:

   After generating the self-signed certificates, place them in the `certs` directory and update your `docker-compose.yml` file to mount the certificates as shown earlier.

3. **Start the Application with Self-Signed Certificates**:

   Start the Docker container with self-signed certificates using the following command:

   ```bash
   docker compose up
   ```

   Your application will now be accessible over HTTPS. Note that browsers will display a warning when using self-signed certificates, as they are not trusted by default.

### Accessing the Application

After building and running the Docker container, the application will be available at the IP address specified in the `compose.yml` file. By default, it is set to:

- **HTTP**: `http://192.168.1.10`
- **HTTPS**: `https://192.168.1.10`

You can access the application by entering this IP address in your web browser. If you need to change the IP address, update the `compose.yml` file and restart the container.

### Docker Compose Commands

- **To Build the Application**:

    ```bash
    docker compose build
    ```

- **To Run the Application**:

    ```bash
    docker compose up
    ```

## Docker Hub Link

The pre-built Docker image is also available on [Docker Hub](https://hub.docker.com/r/dockdv/webnote).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
