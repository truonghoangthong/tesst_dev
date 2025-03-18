from machine import UART, Pin
import time

uart = UART(0, baudrate=115200, tx=Pin(0), rx=Pin(1))
print("Pi Pico W is waiting for data from Flipper Zero via UART...")

buffer = ""
last_receive_time = time.ticks_ms()

while True:
    if uart.any():
        char = uart.read(1).decode('utf-8', 'ignore')
        buffer += char
        last_receive_time = time.ticks_ms()
    else:
        if buffer and (time.ticks_diff(time.ticks_ms(), last_receive_time) > 100):
            print("Data received:", buffer)
            buffer = ""
    time.sleep(0.01)  