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

### 1. **Record Temperature Data**
- **Endpoint:** `/embed-temperature?temperature=<real-value>`
- **Method:** `GET`
- **Description:** Recording Temperature Data. Replace `<real-value>` with real-value.
- **URL Example:**  
     ```bash
     curl http://8.215.20.85/api/v1/embed-temperature?temperature=25
     ```
   - **Response Example:**  
     ```json
     "Temperature: 25"
     ```

### 2. **Get Temperature Records**
- **Endpoint:** `/get-tem`
- **Method:** `GET`
- **Description:** Get Temperature Data.
- **URL Example:**  
     ```bash
     curl http://8.215.20.85/api/v1/get-tem
     ```
   - **Response Example:**  
     ```json
     [
      {
        "time": "2025-01-17T17:02:52.91667373Z",
        "temperature": 20
      },
      {
        "time": "2025-01-17T17:52:25.060350625Z",
        "temperature": 20
      }
     ]
     ```

### 3. **Record Humidity Data**
- **Endpoint:** `/embed-humidity?humidity=<real-value>`
- **Method:** `GET`
- **Description:** Recording Humidity Data. Replace `<real-value>` with real-values.
- **URL Example:**  
     ```bash
     curl http://8.215.20.85/api/v1/embed-humidity?humidity=30
     ```
   - **Response Example:**  
     ```json
     "Humidity: 30 written."
     ```

### 4. **Get Humidity Records**
- **Endpoint:** `/get-tem`
- **Method:** `GET`
- **Description:** Get Humidity Data.
- **URL Example:**  
     ```bash
     curl http://8.215.20.85/api/v1/get-hum
     ```
   - **Response Example:**  
     ```json
     [
      {
        "time": "2025-01-17T17:02:02.595786514Z",
        "humidity": 20
      },
      {
        "time": "2025-01-17T17:58:29.728341766Z",
        "humidity": 30
      }
     ]
     ```

### 5. **Get logs Records**
- **Endpoint:** `/logs`
- **Method:** `GET`
- **Description:** Get logs Records.
- **URL Example:**  
     ```bash
     curl http://8.215.20.85/api/v1/logs
     ```
   - **Response Example:**  
     ```json
      [
        "{\"level\":\"info\",\"message\":\"Listening at http://127.0.0.1:5001\"}",
        "{\"level\":\"info\",\"message\":\"Temperature 34 written to InfluxDB\"}",
        "{\"level\":\"info\",\"message\":\"Temperature 3a written to InfluxDB\"}",
        "{\"level\":\"error\",\"message\":\"Missing temperature parameter\"}",
        ""
      ]
     ```

---



