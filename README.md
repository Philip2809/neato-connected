# neato-connected

# WARNING - this branch is for work in progress text! please go to the main branch!

### What is this?

Repair your Neato Robot Vacuum to be controlled via home assistant after the shutdown of the Neato servers. The scope of this project is to give your robot at least the same functionallity as when you bought it, however as the project is in a development state, the current functionalities include:
- Viewing status
- Start & stop cleaning
- Editing settings (even some hidden settings!)
- Scheduling via an home assistant automation/script

The ability to create, view and edit floormaps so the robot can get the same functionallity with nogo-lines and zones is in the making.

Main card | Settings View
:-------------------------:|:-------------------------:
![ha-card](./pics/esphome/ha-card.png) |  ![ha-card-settings](./pics/esphome/ha-card-settings.png)

Now due to the shutdown of the cloud for the neato robots, there are three options to get out of this mess:
- Buy a new robot.
    - Cons: Costs $$$.
    - Pros: But maximum WAF and no skills required
- Open the robot. 
    - Cons: Skills required. 
    - Pros: WAF is likely good and price is $
- Drill through the bumper. 
    - Cons: WAF at risk. 
    - Pros: Less skills required and price is $

### What is supported?

**We would like to support all robots where an debug interface, or other controls, is accessible, but since we only have easy access to test on a D3 and D5, we can only test on those. If you have another robot, please open an discussion so we can verify that it works or add support for it!**

As far as we know, only the D3, D4, D5, D7 and D7 has the firmware `4.5.3` and currenly the config is based on that so the robots that should work with that firmware is as follows:
- Confirmed working: **D3, D5, D7**
- Should work, need confirmation: **D4, D6**
- Should work with some work: **D70-D85, Connected, [maybe others? please get in touch!]**

**Trickier robots**
- D8 (probably D9, D10) - These robots use a compleatly different board, chip and firmware, and because the debug interface seams to be behind a password lock, this cannot be controlled directly.

### What do I need?
Sadly to be able to repair your neato vacuum you **need to access an USB port or debug pins** to be able to connect to the debug interface, we will be going through the different options to access these pins, as well as everything you need for a full locally controlled setup!

# Getting started!

if you haven't heard of home assistant yet then this is an awesome time to learn about it! It is an open source home automation tool that puts local control and privacy first. Read more about them on their [website](https://www.home-assistant.io/) and try their [live demo](https://demo.home-assistant.io) if you want! There is a lot of great guides and information about home hassistant on youtube and their forums! They also have some amzing guides on their [site](https://www.home-assistant.io/installation/) to get an home assistant installation going. If you have any questions or problems, don't hesitate to ask for help here in the [discusstions](../discussions) section, on our [discord](https://discord.gg/PAgwhWvyD8) or the home assistant [help](https://www.home-assistant.io/help/) page.

First of all you should start thinking about how you want to keep your robot connected, but if you don't want to commit to opening your robot or drilling an hole in the bumper yet, you can always take the bumper off and connect an esp device to the robot and just run it via Home Assistant.

**Overview of steps:**
1. Make sure your robot's firmware is version `4.5.3`
2. Setup HACS and install required add-ons
3. Import the config to ESPHome
4. Flash the image to your ESP device
5. Connect the ESP device to your robot
6. Setup the Home Assistant card
7. Enjoy your locally connected robot!

## Step 1
The ESPHome config is designed for the latest firmware version, `4.5.3`, so you will need to check which version you are on and update if you are on an older version. If you have an neato robot that does not have support for the `4.5.3` firmware, please open an discussion or write in the discord!

To check your version you can:
- If you app still works, check in there
- Connect to the robot with an usb cable, at the port where the dustbin is
    - on windows use [NeatoToolio](https://github.com/jdredd87/NeatoToolio) or connect via serial as with unix systems
    - on unix systems, connect to serial:
        1. `screen /dev/ttyUSB0 115200`
        2. Once connected send the command `GetVersion`
        3. Look for the line with `Software`, this should be `Software,4,5,3,189,0`
- Restart the robot and send a curl request to `https://<robot-ip>:4443/info` with `--ciphers ALL:@SECLEVEL=0`. This should work both once connected to a wifi and on the robot AP.

If your firmware version is not `4.5.3` then you will need to update to the latest firmware, for this you will need to download the latest firmware from [here](https://github.com/RobertSundling/neato-botvac) and try to install it. I was able to install with the original certificate and all when I factory reset my robot and didn't connect it to the internet. If you are having troubles, try the different firmware images with different certificate dates, and if nothing works, feel free to ask for help here!

## Step 2

We need to install certain plugins and addons to the home assistant installation to use all the features of this project.

### Home assistant plugins
Donwload the "Esphome" plugin from Setting --> Add-ons --> Add-on Store --> install the "ESPHome Device Builder"

### HACS
If you don't already have hacs, follow their guide to set it up: https://www.hacs.xyz/docs/use/. Once you have HACS setup, open it and install the following addons:
- button-card
- browser-mod

After installing, it will ask you to reload the page, please do so.

## Step 3

### ESPHome Secrets
Open the ESPHome Builder and click the "Secrets" in the top right. Make sure your secrets include at the minimum this:
```yaml
# Generate at https://esphome.io/components/api/#api-key
neato_vacuum_api: "<API_KEY>"
# Generate at https://bitwarden.com/password-generator/
neato_vaccum_ota: "<OTA_PASSWORD>"

# Your Wi-Fi SSID and password
wifi_ssid: "<WIFI_SSID>"
wifi_password: "<WIFI_PASSWORD>"
```

Once you have filled this file with your values, save it, and make sure to never share this file if asking for support etc.

If you want to add more devices, best practice is to set the api key and ota password in your secrets file. Your wifi password and ssid should also be kept here. Since the esp device will be strapped to, or inside the robot OTA (over the air) updates is quite important for this use case.

### Config file
Once back at the ESPHome main page, click the big green button in the bottom left to add a new device. Read the information, but for now, click "Continue" and either import the [`neato_vacuum.yaml`](..) file, or start with an empty configuration.

**The following two steps might be hard to do, feel free to ask for help in the discord or discussions.**

Now, since you may be using a different board then I am, and this might get complicated. You will need to find out what platform to set. Here is the list of [available platforms](https://esphome.io/components/#supported-microcontrollers). 

Next, you will need to figure out which pins to use, once again this is highly dependent on your board, both based on which ones you can easily connect too, but also what is supported on your platform. In some cases, the pins labeled `TX` and `RX` cannot be used, as these are used to upload the firmware, you will need to find GPIO pins that support using using UART, on the ESP32 many of the GPIO pins can be used. There is many tutorials for the different boards, here is some common ones:
- [ESP32](https://randomnerdtutorials.com/esp32-pinout-reference-gpios/)
- [ESP8266](https://randomnerdtutorials.com/esp8266-pinout-reference-gpios/)

## Step 4
Now you will need to build and flash the images onto your ESP device! While in the editor, press the "Install" button in the top right, since the device is not yet setup, select "Manual download", this will build the configuration file to an image you can flash, this might take a while on a fresh system. 

Once the image has been built, select to download in "Factory format", save this file on your computer and open [ESPHome Web](https://web.esphome.io/). Since this uses WebSerial you will need to use a chromium based browser. ESPHome has an amazing [guide](https://esphome.io/guides/physical_device_connection/) if this is your first time doing this, but to summerize, if you have an usb-port on your device, connect to it, if not you will need to connect to the `TX`, `RX`, `GND` and `3.3V/5V` with an TTY adapter. Then go into bootloader mode by pressing the "BOOT" button, if you don't have one, connect `GPIO0` to `GND`.

Once in ESPHome Web, connect your device to your computer, while going into bootloader mode, then select it in the list. Once selected, upload the firmware file you downloaded before and wait for it to finish. Once finished, it will reboot and you should see it connect to your wifi network.

## Step 5
Now you will need to connect to the robot over it's serial debug port. 

To verify that everything works, either if you just want to try this out, or test what pins you can use before making a permanent installation you should take the bumper off and connect to the debug pins directly.
![debug-port-with-cables](./pics/d3/debug-port-with-cables.jpg)

Connect like this: TX-RX (pin you picked), RX-TX (pin you picked), 3.3V to 3.3V, GND to GND.

| Robot | ESP |
|---|---|
|RX|TX|
|3.3V|VCC / 3.3V|
|TX|RX|
|GND|GND|


Once you are ready for the permanent installation, you there is two ways to do it:

[Externally; by drilling a hole in the bumper](./install-externally.md) | [Internally; by connectiong to the debug port using an JST-XH connector (recommended)](./install-internally.md)
:-------------------------:|:-------------------------:
![cables-via-bumper](./pics/d3/cables-via-bumper.jpg) ![d3-install-outside](./pics/installs/d3-install-outside.png) | ![jay-jst-xh](./pics/installs/jay/2-install-JST-XH.jpg) ![jay-installed](./pics/installs/jay/4-installed-and-taped.jpg)

## Step 6
Copy the contents of [ha-card](./ha-card.yaml), if you changed the name you will need to do a find and replace all instances of `neato_vaccum` to whatever you set, however home assistant may change some characters, see the exact id under the ESPHome device settings. 

Edit a dashboard you where you want the card, add a new section with "Manual" and paste the config for the card. Save and exit edit mode, you should now be able to control your neato connected locally!

## Step 7
Now you can enjoy your locally controllable neato vacuum cleaner! Of course there is some quirks with this repair, however we feel they are worth the ability to regain functionality.

Missing features or annoying workarounds:
- Haven't found a way to tell the robot to dock via the serial interface
- Once in cleaning paused/running mode, to get the robot back into standby/idle, you need to either hold the button on the robot, or press the "STOP" button in home assistant, which will reboot the robot. You can also let the cleaning finish of course.

## Acknowledgements

- @Fabian Ullrich, Jiska Classen, Johannes Eger and Matthias Hollick from Secure Mobile Networking Lab
    - [Security and Privacy for IoT Ecosystems](https://tuprints.ulb.tu-darmstadt.de/handle/tuda/4937)
    - [Vacuums in the Cloud:
Analyzing Security in a Hardened IoT Ecosystem](https://www.usenix.org/system/files/woot19-paper_ullrich.pdf)
    - And all of their work on these robots, including talks etc!
- [@jeroenterheerdt](https://github.com/jeroenterheerdt) for testing, reviewing, writing the guide for installing internally and the original [neato-serial](https://github.com/jeroenterheerdt/neato-serial)
- [@algaen](https://github.com/algaen) for the info about the D8 (D9, D10?) robots
- [@tomwj](https://github.com/tomwj) for testing and pictures installing it internally in a D7
- [@RobertSundling](https://github.com/RobertSundling) for the [firmware files](https://github.com/RobertSundling/neato-botvac)

