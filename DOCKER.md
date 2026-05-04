# Running the MCP Server with Docker

This document provides instructions on how to build and run the Model Context Protocol (MCP) server using Docker.

## Building the Image

You can build the Docker image in two ways: from a local clone of the repository or directly from GitHub.

### Building from a Local Clone

First, build the Docker image from the root of the project:

```sh
docker build -t cloudinary-account-provisioning-mcp .
```

### Building from GitHub

You can also build the image directly from the GitHub repository without cloning it first.

```sh
docker build -t cloudinary-account-provisioning-mcp https://github.com/cloudinary/account-provisioning-mcp.git
```

## Running the Container

The MCP server requires Cloudinary Account credentials to run. You can provide these credentials in one of three ways. When running the `docker run` command, you will also map a local port (e.g., `2718`) to the container's port `2718`.

**Note:** Replace `<your_account_id>`, `<your_provisioning_api_key>`, and `<your_provisioning_api_secret>` with your actual Cloudinary Account API credentials.

### Option 1: Using Individual Environment Variables

This is the recommended method.

```sh
docker run -d -p 2718:2718 \
  -e CLOUDINARY_ACCOUNT_ID="<your_account_id>" \
  -e CLOUDINARY_PROVISIONING_API_KEY="<your_provisioning_api_key>" \
  -e CLOUDINARY_PROVISIONING_API_SECRET="<your_provisioning_api_secret>" \
  cloudinary-account-provisioning-mcp start --transport sse
```

**Note:** If you have these variables already set in your shell environment, you can pass them directly to the container without specifying the values:

```sh
docker run -d -p 2718:2718 \
  -e CLOUDINARY_ACCOUNT_ID \
  -e CLOUDINARY_PROVISIONING_API_KEY \
  -e CLOUDINARY_PROVISIONING_API_SECRET \
  cloudinary-account-provisioning-mcp start --transport sse
```

### Option 2: Using Command-Line Arguments

You can also provide the credentials as arguments to the `start` command.

```sh
docker run -d -p 2718:2718 \
  cloudinary-account-provisioning-mcp start --transport sse \
  --account-id "<your_account_id>" \
  --provisioning-api-key "<your_provisioning_api_key>" \
  --provisioning-api-secret "<your_provisioning_api_secret>"
```

### Option 3: Using `CLOUDINARY_ACCOUNT_URL` Environment Variable

This method combines all credentials into a single URL.

```sh
docker run -d -p 2718:2718 \
  -e CLOUDINARY_ACCOUNT_URL="account://<your_provisioning_api_key>:<your_provisioning_api_secret>@<your_account_id>" \
  cloudinary-account-provisioning-mcp start --transport sse
```

**Note:** If you have the `CLOUDINARY_ACCOUNT_URL` variable already set in your shell environment, you can pass it directly:

```sh
docker run -d -p 2718:2718 -e CLOUDINARY_ACCOUNT_URL cloudinary-account-provisioning-mcp start --transport sse
```

## Connecting to the Server

Once the container is running with the SSE transport enabled (as shown in the commands above), the MCP server is available at the following endpoint:

`http://localhost:2718/sse`

If you are running Docker on a different host, replace `localhost` with the appropriate hostname or IP address.

## Stopping the Container

You can find the container ID by running `docker ps` and then stop it using `docker stop`.

To stop the container started from the `cloudinary-account-provisioning-mcp` image:
```sh
docker stop $(docker ps -a -q --filter "ancestor=cloudinary-account-provisioning-mcp")
```

## Viewing Logs

You can view the logs from your running container to monitor its output or troubleshoot issues.

First, find the ID of your container:
```sh
docker ps
```
This will list all running containers, including their IDs.

### Static Logs

To see all logs that have been generated so far, use the `docker logs` command with the container ID.

```sh
docker logs <your_container_id>
```

### Live Logs

To see logs in real time, add the `--follow` (or `-f`) flag.

```sh
docker logs --follow <your_container_id>
```

Press `Ctrl+C` to stop following the logs.

## Debugging

You can enable more detailed logging for troubleshooting in two ways.

### Using the `--log-level` Flag

Set the `--log-level` flag to `debug` when starting the container.

```sh
docker run -d -p 2718:2718 \
  -e CLOUDINARY_ACCOUNT_URL \
  cloudinary-account-provisioning-mcp start --transport sse --log-level debug
```

### Using the `CLOUDINARY_DEBUG` Environment Variable

You can also enable a debug logger by setting the `CLOUDINARY_DEBUG` environment variable to `true`.

```sh
docker run -d -p 2718:2718 \
  -e CLOUDINARY_ACCOUNT_URL \
  -e CLOUDINARY_DEBUG=true \
  cloudinary-account-provisioning-mcp start --transport sse
```
