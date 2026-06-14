
# API Docs - Salão Leila

This guide provides instructions on how to build and run the API Documentation using Docker. The API docs are built using OpenAPI specifications and Swagger UI.

## Build Instructions

```bash
docker build -t docs-leila .

```

## Run Instructions

After successfully building the Docker image, you can run the API docs container.

Run the Docker container:

```bash
docker run -p 8082:80 -d docs-leila

```

This maps port 8082 on your local machine to port 80 in the Docker container (running in detached mode to keep your terminal free).

Open your web browser and navigate to [http://localhost:8082](http://localhost:8082) to access the Swagger UI for the API.

```

```