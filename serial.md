

## Serial interface
There seams to be two different serial interfaces on the robot. One you can connect via the usb port where the dustbin resides, and blocks. The other one with jumper wires or soldering. Here you can connect via a TTY adapter. 


### On different robots

**NOTE: I only have a D3, if you can verify this data separatly, please tell me**

#### D3/D4
I suspect that the D4 looks the same as the D3, because from some research the only difference was their battery and maybe filter.

![pcb-top-annotated](/pics/d3/pcb-top-annotated.png)
![pcb-top](/pics/d3/pcb-top.jpg)
![pcb-bottom](/pics/d3/pcb-bottom.jpg)

#### D5/D6
Inside looks practically identical to D3. It has the extra sidebrush motor that is missing in the D3. [source](https://www.youtube.com/watch?v=OqgD7zuyLuA) 

![d5](./pics/other-robots/d5.png)
#### D7
Looks once again practically identical to the D3. It has the extra sidebrush motor and the status leds are from a separate board. [source](https://www.youtube.com/watch?v=i-CzfMNqBFw)

![d7](./pics/other-robots/d7.png)

### Pinout for D3
But I am very very certain it is the same for D3/D4/D5/D6/D7.

The pinout looks like this:
![pinout on d3](./pics/d3/pinout.png)
![pinout connected](./pics/d3/pinout-connected.png)

my setup
![my setup](./pics/d3/pinout-tty-setup.jpg)

#### D70/D75/D80/D85
These use a compleatly different pcb and they have the serial debug strips on the left side of the chassi. 

d80
![d80](./pics/other-robots/d80.png)
d85
![d85](./pics/other-robots/d85.png)

[source d80](https://www.youtube.com/watch?v=oIHImYWqOh4)
[source d85](https://www.youtube.com/watch?v=DixC1pDCsh8)

I suspect the D70 and D75 look the same.

The pinout for these should be like this:
![pinout for d70/d75/d80/85](./pics/other-robots/pinout.d70-d75-d80-d85.png)

[source](https://github.com/jeroenterheerdt/neato-serial/issues/3#issuecomment-510543522)

### Connecting
Connecting to a USB TTY Adapter you only need to connect ground and RX to the robot TX to the output, to be able to send commands, you connect the TX to the robot RX. 

Connecting to the serial interface with screen:
`screen /dev/ttyUSB0 115200`

Shows some logs of the robot starting up, including a boot menu if the robot was fully shut down and you press enter twice.

The serial interface on the `3.2.0` version: (the `4.5.3` version I will add later)
```
ARCHES Board (04.0x90c973a5)
Press enter twice within the next 2 seconds for boot menu
Enter Key Detected!
Enter Key Detected!
**Commands:

Press 'M' to load IFS from main image flash partition
Press 'F' to load IFS from factory image flash partition
Press 'X' for serial download, using XModem-1k
Press '1' for XModem-1k download at 1Mb/s
Press '3' for XModem-1k download at 3Mb/s
Press 'S' to scan existing memory without download
-- Compressed Image Mode ('c' to toggle)--
initialize_sdmmc finished. sdmmc.sdmmc_pbase=481D8000



Booting Main Image
```

If it just was sleeping or not fullt shut down.
```
ARCHES Board (04.0x90c973a5)

Not factory boot...
initialize_sdmmc finished. sdmmc.sdmmc_pbase=481D8000



Booting Main Image
```

Then it starts up, you can now enter commands! The commands listed by the `Help` command are as follows:
```
Help - Without any argument, this prints a list of all possible cmds.
With a command name, it prints the help for that particular command
Clean - Starts a cleaning by simulating press of start button.
ClearFiles - Erases Black Box, and other Logs
DiagTest - Executes different test modes. Once set, press Start button to engage. (Test modes are mutually exclusive.)
GenerateRobotLinkCode - Generate and send robot linking code to server.
GetConfiguredWifiNetworks - Get the list of configured wifi networks.
GetRobotLinkCode - Get the robot linking code
CancelRobotLink - Cancel link request.
SetNTPTime - Set system time using the NTP servers (WIFI must be up for this to work)
GetAccel - Get the Accelerometer readings.
GetAnalogSensors - Get the A2D readings for the analog sensors.
GetButtons - Get the state of the UI Buttons.
GetCalInfo - Prints out the cal info from the System Control Block.
GetCharger - Get the diagnostic data for the charging system.
GetDigitalSensors - Get the state of the digital sensors.
GetErr - Get Error Message.
GetLDSScan - Get scan packet from LDS.
GetMotors - Get the diagnostic data for the motors.
GetSensor - Gets the sensors status ON/OFF (Wall Follower and Ultra Sound Only)
GetTime - Get Current Scheduler Time.
GetVersion - Get the version information for the system software and hardware.
GetWarranty - Get the warranty data.
GetWifiInfo - Get a list of available wifi networks.
GetWifiStatus - Get the current status of the wifi.
GetUserSettings - Get the user settings.
GetUsage - Get usage settings
PlaySound - Play the specified sound in the robot.
SetBatteryTest - Sets California Energy Commission 10-CFR-430 Battery Charging System Test mode.
SetButton - Simulates a button press.
SetFuelGauge - Set Fuel Gauge Level.
SetIEC - Sets the IEC Cleaning Test parameters
SetLCD - Sets the LCD to the specified display. (TestMode Only)
SetLED - Sets the specified LED to on,off,blink, or dim. (TestMode Only)
SetLDSRotation - Sets LDS rotation on or off. Can only be run in TestMode.
SetMotor - Sets the specified motor to run in a direction at a requested speed. (TestMode Only)
SetSystemMode - Set the operation mode of the robot. (TestMode Only)
SetTime - Sets the current day, hour, and minute for the scheduler clock.
SetUserSettings - Sets user settings
SetUsage - Sets usage settings
SetWifi - SetWifi variables
TestMode - Sets TestMode on or off. Some commands can only be run in TestMode.
Upload - Uploads new program to the robot.
```

Now the commandline is not case-sensetive and it also checks if the string you written is part of a command or parameter for a command. If it is an only match it will "autocompleage" the command for you, if multiple matches then it will list what it could be. Thanks to this functionality I have discovered some commands that is not documented in the `Help` command:
```
GetActiveServices
GetLoggingType
GetState
```

Commands that was in the old programming manual but I don't know how to use:
```
GetSysLog
```

#### Differences I found in 3.2.0 and 4.5.3

3.2.0 has more options for `SetSystemMode`:
```
SetSystemMode - Set the operation mode of the robot. (TestMode Only)
    Shutdown - Shut down the robot. (mutually exclusive of other options)
    Hibernate - Start hibernate operation.(mutually exclusive of other options)
    Standby - Start standby operation. (mutually exclusive of other options)
    PowerCycle - Power cycles the entire system. (mutually exclusive of other options)
```

#### Logs when doing a factory reset:
```
ARCHES Board (04.0x90c973a5)
Press enter twice within the next 2 seconds for boot menu

Dustbin open , Right Side Bumper and Right Front Bumper closed....
Booting Factory Image...Loading FACTORY SECURE/ENCRYPTED image ...
initialize_sdmmc finished. sdmmc.sdmmc_pbase=481D8000



Factory Mode: Restoring Image.
32768+0 records in
32768+0 records out
32768+0 records in
32768+0 records out
Initializing UI
cp: Can't open source file.  (/emmc/uiFactory)
Resetting wifi
/etc/factory_reset.sh[69]: [: missing ]
Reset Security
Reset complete. Rebooting
Shutting down daemons...
Shutting down filesystems...
```

#### Shutdown the robot fully
```
TestMode on
SetSystemMode Shutdown
```

(This could be written as `t on` and `setsy sh`)

