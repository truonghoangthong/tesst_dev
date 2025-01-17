# API Documentation: Recording and Fetching Humidity, Temperature, and Frequency

---
## Overview
This API provides endpoints for recording and retrieving environmental data, including humidity, temperature, and frequency, from IoT devices.

## System Architecture Overview
- **Backend:** Node.js v23.6.0
- **Database:** InfluxDB
- **Web Server:** Nginx
- **Operating System:** Ubuntu 24.04 LTS (VPS)
- **Cloud Service:** Alibaba  

---
## Error Handling

### HTTP Status Codes:
Standard HTTP status codes are used to indicate success or failure.

- **200 OK**:  
  Successful request.

- **400 Bad Request**:  
  Invalid request parameters or missing required fields.
  - **Common Causes**:
    - Missing required parameters.
    - Invalid query parameters.

- **401 Unauthorized**:  
  Invalid or missing API key.
  - **Common Causes**:
    - Missing or incorrect API token.
    - Expired authentication token.

- **403 Forbidden**:  
  Insufficient permissions.
  - **Common Causes**:
    - Insufficient permissions to perform the requested action.
    - API token lacks necessary permissions.

- **500 Internal Server Error**:  
  An error occurred on the server-side.
  - **Common Causes**:
    - Errors in database connections (like InfluxDB).
    - Issues in query execution or timeout.
---

## API Overview
## **Base URL**
http://8.215.20.85/api/v1

## **API Endpoints**

### 1. **Record Humidity and Temperature Data**
- **Endpoint:** `/embed?temperature=<real-value>&humidity=<real-value>`
- **Method:** `GET`
- **Description:** Recording Humidity and Temperature Data at the same time. Replace `<real-value>` with real-values.
- **URL Example:**  
     ```bash
     curl http://8.215.20.85/api/v1/embed?temperature=22.5&humidity=60
     ```
   - **Response Example:**  
     ```json
     "Temperature: 22.5, Humidity: 60 written."
     ```

### 2. **Get Humidity and Temperature Records**
- **Endpoint:** `/get-tem-hum`
- **Method:** `GET`
- **Description:** Get Humidity and Temperature Data.
- **URL Example:**  
     ```bash
     curl http://8.215.20.85/api/v1/get-tem-hum
     ```
   - **Response Example:**  
     ```json
     [
      {
        "time": "2025-01-15T20:02:36.397535844Z",
        "humidity": 60,
        "temperature": 25
      },
      {
        "time": "2025-01-15T20:23:04.662264018Z",
        "humidity": 670,
        "temperature": 25
      },
      {
        "time": "2025-01-15T20:31:39.989340945Z",
        "humidity": 68,
        "temperature": 25
      },
      {
        "time": "2025-01-16T21:48:48.485698797Z",
        "humidity": 60,
        "temperature": 22.5
      }
     ]
     ```

### 3. **Record Key Frequency**
- **Endpoint:** `/key?frequency=<real-value>`
- **Method:** `GET`
- **Description:** Recording frequency Data. Replace `<real-value>` with real-values.
- **URL Example:**  
     ```bash
     curl http://8.215.20.85/api/v1/key?frequency=54
     ```
   - **Response Example:**  
     ```json
     "Frequency: 54 written."
     ```

### 4. **Get Frequency Records**
- **Endpoint:** `/get-frequency`
- **Method:** `GET`
- **Description:** Recording frequency Data.
- **URL Example:**  
     ```bash
     curl http://8.215.20.85/api/v1/get-frequency
     ```
   - **Response Example:**  
     ```json
     {
        "result": "_result",
        "table": 0,
        "_start": "2024-12-17T22:47:04.23286677Z",
        "_stop": "2025-01-16T22:47:04.23286677Z",
        "_time": "2025-01-16T22:46:57.861345208Z",
        "_value": 54,
        "_field": "frequency",
        "_measurement": "qparams",
        "app": "query-param-app"
     }
     ```

---



