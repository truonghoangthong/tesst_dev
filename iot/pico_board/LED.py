import urequests
import machine
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
    
def run_led():
    def get_led_status():
        url = "http://8.215.20.85/api/v1/get-led-status"
        
        try:
            response = urequests.get(url)
            data = response.json()
            response.close()
            
            if "status" in data:
                if data["status"] == "on":
                    led.value(1)
                    return True
                else:
                    led.value(0)  
                    return False
            else:
                print("No status data received.")

        except Exception:
            print("First time connection, no data received.")
            time.sleep(5)
    
    get_led_status()
    # LED Pin
    LED_PIN = 17 
    led = machine.Pin(LED_PIN, machine.Pin.OUT)
    
    # Main function
    previous_status = None
    full_time = time.time()
    action = False # Not set yet, this is for debugging purpose or to check the full time
                   # Change to True to see full time with condition
    
    if get_led_status():
        print(f"First LED status: ON")
    else:
        print(f"First LED status: OFF")
    
    while True:
        current_time = time.time()
        current_status = get_led_status()
        
        if previous_status is None:
            previous_status = current_status
            previous_time = current_time

        if current_status != previous_status:
            duration = current_time - previous_time
            if previous_status:
                print(f"Turned on for {duration:.1f} sec")
            else:
                print(f"Turned off for {duration:.1f} sec")

            # Update the previous status and status change time
            previous_status = current_status
            previous_time = current_time
            current_time = previous_time
            
            if current_status:
                print("LED status: ON")
            else:
                print("LED status: OFF")    

        else: 
            current_time = time.time()

        if action:
            print("Full time is: ", full_time)
            break

if __name__ == "__main__":
    print(connect_wifi())
    run_led()