import urequests
from machine import Pin
import time
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

def control_relay():
    RELAY_PIN = 28 
    relay = Pin(RELAY_PIN, Pin.OUT)
    url = "http://8.215.20.85/api/v1/get-relay-status"
    
    try:
        response = urequests.get(url)
        data = response.json()
        response.close()
        
        if "status" in data:
            if data["status"] == "on":
                relay.on()
                print("RELAY ON")
            else:
                relay.off()
                print("RELAY OFF")
        else:
            print("Not found")

    except Exception :
        print("Rerun the program.")

def run_relay():
    while True:
        control_relay()
        time.sleep(1)
        
if __name__ == "__main__":
    connect_wifi()
    run_relay()