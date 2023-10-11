# Technical Report: JWT Authentication with MySQL and Node.js in a Docker Container

## Table of Contents:
1. [Introduction](#introduction)
2. [JWT Authentication](#jwt-authentication)
    - [Overview](#overview)
    - [Implementation](#implementation)
3. [Database Configuration](#database-configuration)
    - [MySQL Database](#mysql-database)
    - [Schema](#schema)
4. [Video Storage and Display](#video-storage-and-display)
    - [Multer for Video Upload](#multer-for-video-upload)
    - [Displaying User-Specific Videos](#displaying-user-specific-videos)
5. [Docker Containerization](#docker-containerization)
    - [Dockerfile](#dockerfile)
    - [Building and Running the Container with Docker Compose](#building-and-running-the-container-with-docker-compose)
6. [Conclusion](#conclusion)

## Introduction
This technical report elaborates on the development and implementation of a Node.js application that leverages JWT (JSON Web Token) authentication. It interacts with a MySQL database for user management, employs Multer for video uploads, and is containerized using Docker to ensure scalable and effortless deployment.

## JWT Authentication

### Overview
JWT is a compact, URL-safe mode of representing claims to be exchanged between two entities. In our application, JWT caters to user authentication, offering a stateless and secure method to authenticate users and access secured resources.

### Implementation
- **User Registration and Login**: Users register and log in using their respective email addresses and passwords.
- **Validation Against MySQL Database**: The user credentials are verified against a MySQL database that houses user details like names, emails, and hashed passwords.
- **Token Generation and Validation**: On successful login, a JWT token, crafted using a secret key, is generated and dispatched to the client. Subsequent requests employ this token to authenticate the user's identity.
- **Token Storage**: For security, tokens are stored in cookies.

## Database Configuration

### MySQL Database
We've employed a MySQL database for user management, which houses pivotal data such as names, email addresses, and hashed passwords. The application's connection to this database is orchestrated by the mysql Node.js module.

### Schema
Our database schema integrates tables for users and videos. Each video corresponds to a user, as evidenced by the user's ID recorded alongside the video information.

## Video Storage and Display

### Multer for Video Upload
Multer facilitates video uploads, streamlining storage on the server by establishing the destination directory and generating distinct filenames for every video. The path of storage and filename is linked with the uploading user.

### Displaying User-Specific Videos
To present videos specific to a user, the user's ID, extracted from the JWT token, is employed. This ID retrieves videos associated with the said user, ensuring that a user can view only videos they've uploaded.

## Docker Containerization

### Dockerfile
A Dockerfile, constructed to containerize the Node.js application, augments its portability and ease of deployment. Key steps in the Dockerfile encompass:
- **Base Image**: Adoption of the official Node.js runtime as the foundational image.
- **Working Directory**: Determination of a working directory within the container.
- **Copy Application Files**: Transference of the application's source code, the package.json, and package-lock.json files to the container.
- **Port Exposure**: For external accessibility, the application port can optionally be exposed in the Dockerfile.
- **Command Definition**: The command to initiate the Node.js application is defined within the Dockerfile.

### Building and Running the Container with Docker Compose
For building the Docker image, navigate to the directory housing the Dockerfile and Docker Compose YAML and execute:
```bash
docker-compose up --build
```

