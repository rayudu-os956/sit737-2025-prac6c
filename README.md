# SIT737 - Task 6P: Kubernetes Deployment of Node.js Calculator Microservice

This repository contains all necessary files to deploy a containerized Node.js calculator microservice to a Kubernetes cluster using Docker Desktop, along with access through the Kubernetes Dashboard.

## 📦 Application Overview

This microservice performs basic and advanced arithmetic operations using RESTful endpoints, and logs all operations using `winston`.

### Features:
- RESTful API for operations: `add`, `subtract`, `multiply`, `divide`, `sqrt`, `modulo`, `exponentiate`
- Logging using `winston` to console and file
- Health check endpoint: `/operations`
- Dockerized and deployed on Kubernetes
- Kubernetes Dashboard access enabled

---

## 🛠️ Prerequisites

- Docker Desktop (Kubernetes enabled)
- Node.js
- Git
- kubectl (comes with Docker Desktop)

---

## 🚀 Setup Instructions

### 1. Clone the repository

git clone https://github.com/username/sit737-2025-prac6p.git
cd sit737-2025-prac6p

### 2. Build and Push Docker Image
docker build -t <your-dockerhub-username>/calculator-microservice:latest .
docker push <your-dockerhub-username>/calculator-microservice:latest
### 3. Create Kubernetes Files

apiVersion: apps/v1
kind: Deployment
metadata:
  name: calculator-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: calculator
  template:
    metadata:
      labels:
        app: calculator
    spec:
      containers:
      - name: calculator
        image: <your-dockerhub-username>/calculator-microservice:latest
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /operations
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 30
service.yaml:
apiVersion: v1
kind: Service
metadata:
  name: calculator-service
spec:
  type: NodePort
  selector:
    app: calculator
  ports:
    - port: 8080
      targetPort: 8080
      nodePort: 30080
5. 4: Access the Dashboard:
kubectl proxy
kubectl port-forward -n kubernetes-dashboard service/kubernetes-dashboard 8443:443
