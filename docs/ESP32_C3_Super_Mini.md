# ESP32-C3 Super Mini Wiring Guide

I use an **ESP32-C3 Super Mini** on my Neato Botvac D5 and the default hardware UART pins (GPIO 6 and 7) caused a hardware conflict with the internal flash/JTAG pins, freezing the serial communication.
First I've connected pins 7 and 6 but even if ESP32 was connecting to the wifi and I could see the robot's web control page, no commands were given to the robot and no status was read from the robot.
To fix this, I've re routed the serial connections to the native hardware UART matrix on pins 20 and 21.
Instead of pin 7 I've used pin 21 and instead of pin 6 I've used pin 20.
In the screenshot below you can see, under the robot's name, the uptime and the ports used for TX and RX.
<img width="2231" height="336" alt="WebGUI_Showing_Ports_20_21" src="https://github.com/user-attachments/assets/da71703f-daeb-495a-bbd7-ec20156f6de6" />


### ESPHome Configuration Substitution
Modify your YAML substitutions to match the new hardware pins:
```yaml
substitutions:
  uart_tx: 21
  uart_rx: 20
```
### Wiring Diagram
Here is how the wires map out visually to the Super Mini:

| Neato Motherboard Debug Port left to right | ESP32-C3 Super Mini Pin |
| :--- | :--- |
| Pin 1 (RX) | **GPIO 21 (TX)** |
| Pin 2 (5V) | **3.3V / VCC** |
| Pin 3 (TX) | **GPIO 20 (RX)** |
| Pin 4 (GND) | **GND** |

Here i present  a different positioning of the ESP32_C3 Super Mini.

The ESP32-C3 Super Mini is placed in the hole from the bin handle, in a 2x8 socket, making it easy removable without having to dismantle the robot. You can even flash it on the location with a (soft) usb c cable without having to remove it since the uart ports of the robot are connected to pins 20 and 21 and not to 6 and 7 that are used to flash the ESP32. Also the placing of the ESP in the bin handle hole keeps it out from the LIDAR'w way so will not interfere with the robot's mapping and navigation.
<img width="2252" height="4000" alt="Final_Look" src="https://github.com/user-attachments/assets/cb387c78-5196-44e9-9f9d-c6346190ab5b" />
To realize this I used a 2x8 sockets (in the image is a 2x6 sockets)
<img width="4000" height="2252" alt="Socket" src="https://github.com/user-attachments/assets/26eeb68e-6ab7-4ead-b722-e45d0a41bfe1" />
In the hole from the bin handle I cut two paralel rectangular holes using a drill.The plastic is soft and the cutting of the holes is quite easy.
<img width="4000" height="2252" alt="Socket_access_via_top" src="https://github.com/user-attachments/assets/2de21744-1744-47c6-8f94-8210056514c7" />
On the back of the robot's top I've fixed the pcb with a screw, made the wiring and then isolated it with duct tape.
<img width="4000" height="2252" alt="Socket_Wiring_with_Pin20_21" src="https://github.com/user-attachments/assets/d32f1402-16d1-4914-a52b-3a7ad6914b98" />
<img width="2252" height="4000" alt="Socket_Isolated" src="https://github.com/user-attachments/assets/17b0eb5e-d3cc-4ba8-b784-dccd15b8d9cc" />
I broke by mistake the upper plastic part of the UART so I had to solder the wires and isolate them best possible, that was ok at the end and it fitted perfectly.
<img width="4000" height="2252" alt="Uart_Port_connectivity" src="https://github.com/user-attachments/assets/57f7464a-06db-418b-8b0b-aa30de93a6d2" />
Cabling wise I used cables of four different colours so it can be easily seen what cable connects to which port: green goes to port 21, Red to 3.3v, Grey to port 20 and Black to GND on the ESP32-C3-Mini.







