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


## **API Endpoints**

### 1. **Record Temperature Data**
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
- **Method:** `GET`
- **Description:** Get Temperature Data.
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
- **Method:** `GET`
- **Description:** Recording Humidity Data. Replace `<real-value>` with real-values.
- - **Response Example:**  
     ```send
     "Humidity: 30 written."
     ```

### 4. **Get Humidity Records**
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
- **Method:** `GET`
- **Description:** Either turn the LED on or off remotely. Replace `<status>` with either `on` or `off`.
- **Response Example:**  
     ```send
     LED status on
     ```

### 6. **Get led status**
- **Method:** `GET`
- **Description:** Either turn the LED on or off remotely. Replace `<status>` with either `on` or `off`.
- **Response Example:**  
     ```json
     {
         "status": "on"
     }
     ```
     
### 7. **Upload image**
- **Method:** `POST` 
- **Description:** API for uploading images and automatically renaming files using a `uid`. **Automatically deletes old files with the same UID** before uploading a new one. Supported formats: JPEG, PNG, GIF, WEBP.
## Request Details  
### **Headers**  
| Key | Value | Required |  
|-----|-------|----------|  
| `Content-Type` | `multipart/form-data` | Yes |  

### **Body (Form Data)**  
| Field | Type | Description | Required |  
|-------|------|-------------|----------|  
| `image` | File | Image file to upload | Yes |  
| `uid` | String | Unique ID for renaming and managing the file | Yes |  

### **Constraints**  
- File must be sent via the `image` field
  
## Response Examples  
### **Success (200 OK)**  
```plaintext  
File uploaded successfully: https://storage.googleapis.com/your-bucket-name/uid123.jpg  
```

### 8. **Upload frequency text file**
- **Method:** `POST` 
- **Description:** Uploads a text file to append its content to the existing `frequency.txt`, file. The uploaded file is automatically renamed to  `frequency.txt` upon processing.
- **Supported format:** `.txt` only.
## Request Details  
### **Headers**  
| Key | Value | Required |  
|-----|-------|----------|  
| `Content-Type` | `multipart/form-data` | Yes |  

### **Body (Form Data)**  
| Field | Type | Description | Required |  
|-------|------|-------------|----------|  
| `text` | File | text file to upload | Yes |  

### **Constraints**  
- File must be sent via the `text` field
  
## Response Examples  
### **Success (200 OK)**  
```plaintext  
File uploaded successfully: https://storage.cloud.google.com/your-bucket-name/frequency.txt.  
```

### 9. **Get image**
- **Method:** `GET` 
- **Description:** Retrieve the uploaded image by replacing <:uid> with the actual UID used during the upload. The file is returned in its original format—JPEG, PNG, GIF, or WEBP—depending on the format you uploaded.
- **Response Example:**  
     ```
     Success (200): Returns the image file.
     ```

### 10. **Get logs Records**
- **Method:** `GET`
- **Description:** Get logs Records.
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


