# Raspberry Pi Pico W Applications

This document describes three applications using the Raspberry Pi Pico W: controlling an LED, measuring humidity and temperature, and controlling a relay. All data collected by these applications will be sent to a server via Wi-Fi.

## 1. LED Control

### Description
The LED control application allows you to turn an LED on and off using the Raspberry Pi Pico W. The main idea is turning ON/OFF the light from a remote location.

### Implementation
- **Hardware**: Connect an LED to one of the GPIO pins of the Pico W, with an appropriate resistor in series.
- **Software**: Use MicroPython to control the GPIO pin, turning the LED on and off based on user input or predefined conditions.

### Data Transmission
The state of the LED (on/off) will be sent to a server via Wi-Fi. This can be used to log the LED status or trigger other actions on the server.

## 2. Humidity and Temperature Measurement

### Description
The humidity and temperature application measures the environmental humidity and temperature using a sensor connected to the Raspberry Pi Pico W. This data can be used for monitoring and controlling environmental conditions.

### Implementation
- **Hardware**: Connect a DHT11 sensor to the Pico W.
- **Software**: Use a MicroPython library to read data from the sensor and process it.

### Data Transmission
The measured humidity and temperature data will be sent to a server via Wi-Fi. This data can be logged, analyzed, or used to trigger alerts or actions based on predefined thresholds.

## 3. Relay Control

### Description
The relay control application allows you to control a relay using the Raspberry Pi Pico W. This can be used to switch higher power devices on and off, such as lights, fans, or other appliances.

### Implementation
- **Hardware**: Connect a relay module to one of the GPIO pins of the Pico W.
- **Software**: Use MicroPython to control the GPIO pin, switching the relay on and off based on user input or predefined conditions.

### Data Transmission
The state of the relay (on/off) will be sent to a server via Wi-Fi. This can be used to log the relay status or trigger other actions on the server.

## Wi-Fi Connectivity

### Description
All applications will use the Wi-Fi capabilities of the Raspberry Pi Pico W to connect to a server and transmit data.

### Implementation
- **Hardware**: Ensure the Pico W is within range of a Wi-Fi network.
- **Software**: Use MicroPython's network library to connect to the Wi-Fi network and send data to the server using request protocols.
