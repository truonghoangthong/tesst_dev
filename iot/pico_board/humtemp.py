import urequests
from machine import Pin
import time
import dht
import network 

def connect_wifi() -> str:
    SSID = "DN.Matthias"
    PASSWORD = "idontknow"

    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)

    if not wlan.isconnected():
        return f"Need to connect to WiFi"
    else:
        return f"Connected to WiFi {SSID}"
    
def send_temperature(endpoint: str, temp: float) -> None:
    url = f"{BASE_URL}{endpoint}?temperature={temp}"
    try:
        response = urequests.get(url)
        response.close()
    except Exception as e:
        print("Error sending temperature:", e)

def send_humidity(endpoint: str, humidity: float) -> None:
    url = f"{BASE_URL}{endpoint}?humidity={humidity}"
    try:
        response = urequests.get(url)
        response.close()
    except Exception as e:
        print("Error sending humidity:", e)

def run_ht() -> None:
    print("Program starting.")
    global BASE_URL
    BASE_URL = "http://8.215.20.85/api/v1"
    TEMP_ENDPOINT = "/embed-temperature"
    HUM_ENDPOINT = "/embed-humidity"
    SENSOR = dht.DHT11(Pin(0)) 
    LED = Pin("LED", Pin.OUT)
    
    while True:
        try:
            SENSOR.measure()
            temp = SENSOR.temperature()  # Get temperature from sensor
            humidity = SENSOR.humidity()  # Get humidity from sensor

            print(f"Temperature: {temp} degC")
            print(f"Humidity: {humidity} %")

            LED.on()
            send_temperature(TEMP_ENDPOINT, temp)
            send_humidity(HUM_ENDPOINT, humidity)
            LED.off()

            time.sleep(10)  # Wait for 10 seconds before next reading

        except Exception as e:
            print("Error in main loop:", e)

#Run the program
if __name__ == "__main__":
    connect_wifi()
    run_ht()