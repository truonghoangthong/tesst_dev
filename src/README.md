# API Documentation: Recording and Fetching Humidity, Temperature, and Frequency

---
## Overview
This API provides endpoints for recording and retrieving environmental data, including humidity, and temperature. Turn on and turn off the led remotely.

## System Architecture Overview
- **Backend:** Node.js v23.6.0
- **Database:** InfluxDB
- **Web Server:** Nginx
- **Operating System:** Ubuntu 24.04 LTS (VPS)
- **Cloud Service:** Alibaba ESC
-  **Image storage:** Google cloud storage

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
     ```send
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
        "temperature": 25
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
     ```send
     "Humidity: 30 written."
     ```

### 4. **Get Humidity Records**
- **Endpoint:** `/get-hum`
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

### 5. **Update led status**
- **Endpoint:** `update-led-status?status=<status>`
- **Method:** `GET`
- **Description:** Either turn the LED on or off remotely. Replace `<status>` with either `on` or `off`.
- **URL Example:**  
     ```bash
          curl http://8.215.20.85/api/v1/update-led-status?status=on
     ```
   - **Response Example:**  
     ```send
     LED status on
     ```

### 6. **Get led status**
- **Endpoint:** `get-led-status`
- **Method:** `GET`
- **Description:** Either turn the LED on or off remotely. Replace `<status>` with either `on` or `off`.
- **URL Example:**  
     ```bash
          curl http://8.215.20.85/api/v1/get-led-status
     ```
   - **Response Example:**  
     ```json
     {
         "status": "on"
     }
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

---



