[Superguitartab.com](../../README.md) >
[Developer documentation](../README.md) >
System overview

# System overview

This document provides a high-level overview of how the SuperGuitarTab system operates, including the core technologies used, the role of each component, and how they interact to deliver the application.  
This serves as a reference for developers, maintainers, and contributors who need to understand the structure and operation of the system.

---

# Technologies Used

SuperGuitarTab is built using a modern, containerized full-stack architecture.  
Below is an overview of the primary technologies and why they are used:

| Layer | Technology | Purpose                                                                                                  |
|-------|------------|----------------------------------------------------------------------------------------------------------|
| **Frontend** | React | UI rendering, user interaction                                                                           |
| **Static Hosting / Reverse Proxy** | Nginx | Serves React build, reverse-proxies API requests, caches static assets and performs gzip file compression. |
| **Backend API** | FastAPI | Core API, business logic, file access                                                      |
| **ORM / Database Layer** | SQLAlchemy | Defines models and handles DB interactions                                                               |
| **Database** | PostgreSQL | Persistent structured data storage                                                                       |
| **Storage** | DigitalOcean Spaces | PDF/tab file storage (S3 compatible)                                                                     |
| **Containerization** | Docker & Docker Compose | Packaging and running all services                                                                       |
| **Infrastructure Platform** | DigitalOcean | Hosting, networking, storage, registry                                                                   |
| **CI/CD** | GitHub Actions | Automated builds, testing, deployments                                                                   |
| **Container Registry** | DigitalOcean Container Registry | Stores Docker images for deployment                                                                      |
| **VPC** | DigitalOcean VPC | Secure private networking between services                                                               |

---

# Technology Breakdown


## Nginx (Reverse Proxy)
Nginx sits at the entry point of the Droplet and handles all incoming traffic.

### Responsibilities
- Routes `/api/*` paths to the FastAPI container  
- Routes `/*` paths to React container
- Handles gzipping, caching headers, and performance tuning  
- Integrates with SSL (Let’s Encrypt or DO certificates)

Nginx ensures clean separation between frontend and backend layers.

We have two different Nginx configuration:
- Development
- Production

Development handles only port 80

Production handles SSL termination and is open on port 443 and 80. Port 80 redirects to port 443.

---


## React (Frontend)
React is used to build the browser-based user interface for superguitartab.com.

The React app is compiled into static files (`/build`) and served directly through Nginx.

---

## Nginx (Frontend web server)

### Responsibilities
- Serves the **React static build**

---


## FastAPI (Backend)
FastAPI is the core application server responsible for:

- Exposing REST API endpoints  
- Managing tabs metadata
- Communicating with PostgreSQL through SQLAlchemy  
- Generating or retrieving download URLs for Spaces-stored files  

It runs inside a Docker container using **Uvicorn** for async performance.

---

## SQLAlchemy (ORM)
SQLAlchemy provides Pythonic access to the PostgreSQL database.

### Used For:
- Declaring models (e.g., `Tab`)  
- Schema migrations (using Alembic)  
- Querying, updating, and deleting records  
- Enforcing data types and constraints  

---

## PostgreSQL (Database)
PostgreSQL stores the application's relational data, including:

- Guitar tab metadata  
- Song details  
- File keys and references  
- Download counts  
- Future users/auth tables  

The database runs as a containerized service inside the Droplet.

---

## DigitalOcean Spaces (Object Storage)
Spaces is used for file storage:
- Guitar tab PDFs

---

## Docker & Docker Compose (Containerization)
All services: frontend, backend, database, reverse-proxy —run inside Docker containers.

---

## DigitalOcean Infrastructure
SuperGuitarTab is hosted on DigitalOcean using:

### **Droplet**
Runs all Dockerized services.

### **VPC**
Provides private networking and improved security.

### **Firewall**
Limits inbound traffic to HTTP/HTTPS and your SSH IP.

### **Spaces**
Stores tab files.

### **Container Registry (DOCR)**
Stores images built by CI/CD.

---

## GitHub Actions (CI/CD)
GitHub Actions automates:

- Running tests  
- Building Docker images  
- Pushing images to Registry  
- Deploying to the Droplet (e.g., via SSH + Docker Compose pulls)

---

## Architecture Diagram

![superguitartab.com High Level Architecture](../architecture/high-level-architecture-diagram.png)
