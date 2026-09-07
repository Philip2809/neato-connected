[buymeacoffee]: https://www.buymeacoffee.com/philip2809
[buymeacoffee-shield]: https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png

<div align="center">
  <img alt="vacuula Logo" src="./pics/logo.svg" width="250">
  <h1>fang of vacuula (formerly Brainslug)</h1>
</div>

<div align="center">

_Control your Neato vacuum locally with the fang of vacuula_

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V61PBIY6)
[![Buy me a coffee][buymeacoffee-shield]][buymeacoffee]

  <h2>
      <a href="https://discord.gg/PAgwhWvyD8">
        Discord
      </a>
      <span> | </span>
      <a href="faq.md">
        FAQ
      </a>
      <span> | </span>
      <a href="manual.md">
        Manual
      </a>
      <span> | </span>
      <a href="#beta">
        Beta
      </a>
      <span> | </span>
      <a href="https://tools.vacuula.phma.dev">
        Vacuula Tools
      </a>
</div>


> [!NOTE]
> We have found a way to make the Neato connect to a custom server and we are working on a custom app for this! Stay tuned, coming soon!




Repair your Neato Robot Vacuum to be controlled locally after the shutdown of the Neato servers. The scope of this project is to give your robot at least the same functionallity as when you bought it, however the project is in a development state. The `main` branch only gets updates on releases, check out the `next` branch for the latest updates!

Since there is a couple of robots from Neato and they have different firmware versions, they will need different configurations. I have decided they will be grouped based on their "generation".

- `gen1` - (Generation 1)
    - XV11
    - XV12
    - XV14
    - XV21
    - XV RS/HP
    - XV signature
    - XV signature pro
- `gen2` - (Generation 2)
    - Neato Botvac D70
    - Neato Botvac D75
    - Neato Botvac D80
    - Neato Botvac D85
    - Neato Botvac Connected **(Non DX)** `905-0249`, `905-0317`
- `gen3` - (Generation 3)
    - Neato Botvac D3 Connected `905-0321`, `905-0437`, `905-0327`
    - Neato Botvac D4 Connected `905-0499`, `905-0514`
    - Neato Botvac D5 Connected `905-0358`, `905-0357`, `905-0402`
    - Neato Botvac D6 Connected `905-0496`, `905-0517`
    - Neato Botvac D7 Connected `905-0415`, `905-0537`
- `gen 4` (Generation 4) - Sadly not yet supported
    - Neato D800 (very very likely the same as the d8-d10, not confirmed tho)
    - Neato D8 Intelligent `905-09596`
    - Neato D9 Intelligent `905-0559`
    - Neato D10 Intelligent `905-0724`


| Feature | `gen1` | `gen2` | `gen3` |
|---|---|---|---|
| Start & Stop | ✅ | ✅ | ✅ |
| Check errors | ✅ | ✅ | ✅ |
| Status | 🟠 | 🟠 | ✅ |
| Edit settings | ❌ | ✅ | ✅ |
| Scheduling on robot (via screen) | ✅ | ✅ | ❌ |
| Scheduling via ESPHome | ✅ | ✅ | ✅ |
| Scheduling via HA Automation | ✅ ¹ | ✅ ¹ | ✅ ¹ |
| Notifications | ✅ ¹ | ✅ ¹ | ✅ ¹ |
| Return to start | ❌ ³ | ✅ | ❌ ³ |
| Return to dock | ❌ ³ | ❌ ³ | ✅ |
| Manual driving | ❌ ² | ❌ ² | ✅ |

- ✅ - Supported
- 🟠 - Limited functionality
- ❌ - Not supported
- ¹ - Home Assistant required
- ² - Support can be added by version 1
- ³ - Support can be added by version 2

Please refer to the [status.md](./status.md) for project status, roadmap and version meanings!

Gen 2 exposes [motor telemetry for home automation](./gen2-motor-telemetry.md), including running/moving/stationary activity and guidance on combining stopped motors with robot errors when inferring a cleaning cycle.
  
The ability to create, view and edit floormaps so the robot can get the same functionallity with no-go lines and zones is in the making.

The reason this works on all Neato robots is because they all have the command interface, even the robots that originally don't have any WiFi, will still work, since it is no longer WiFi robot that is connecting to the WiFi, it is the ESP device. This also removes any limitations the robots WiFi may have had.

**`gen1` robots**
- We are currently looking into the best way to connect to these, please join the [Discord](https://discord.gg/PAgwhWvyD8) where we are currently talking about the best way to do it and the experimentation going on!

**`gen4` robots**
- These robots use a compleatly different board, chip and firmware, and we cannot interface with these directly. However one idea to get the start/stop feature back is to wire an esp32 to the button itself, join the [Discord](https://discord.gg/PAgwhWvyD8) or open an discussion here so we can discuss! 

# Getting started!

For this repair you will need some tools to connect an ESP device, if you already have an ESP device, awesome try using that, but if you don't already have one you should buy one according to what we have found works best. ESPs recommended by ESPHome (`ESP32`, `ESP32S3` and `ESP32C3`) will all work and have prebuilt files for easy installation, however some ESP devices that are very cheap and small should be avoided since they have some defects and need to use a lower power output on the wifi signal. Please check [supported-esp32.md](./supported-esp32.md) for more information!

First of all we need to get the version of your robot, do this with the [Vacuula Tools](https://tools.vacuula.phma.dev/#/robot)

Since we are parsing the data from the serial interface we need to be on the same verion of the robot firmware, this is what has been confirmed working:
| `gen2`  | `gen3` |
|---|---|
| `2.2.0` or `2.2.1` | `4.5.3` or `4.6.0` (note, many `4.X.X` versions will work) |

If you have another version then these; please get in touch!

There is two ways of using this repair:

- [**Without Home Assistant**](./install-no-ha.md) 
- [**With Home Assistant**](./install-ha.md)

**If you don't mind to tinker a little bit I really do recommend to check out Home Assistant and do that route.** It is an open source home automation tool that puts local control and privacy first. Read more about them on their [website](https://www.home-assistant.io/) and try their [live demo](https://demo.home-assistant.io) if you want! There is a lot of great guides and information about home hassistant on youtube and their forums! They also have some amazing guides on their [site](https://www.home-assistant.io/installation/) to get an home assistant installation going. If you have any questions or problems, don't hesitate to ask for help here in the [discusstions](https://github.com/Philip2809/neato-connected/discussions) section, on our [Discord](https://discord.gg/PAgwhWvyD8) or the home assistant [help](https://www.home-assistant.io/help/) page. 

**From version 2 of this project, when ROS is used for getting a floormap, you will need a separate computer running ROS, and the easiest and prioritized way to set that up will be via Home Assistant.**

## Beta
The `main` branch will have the code and guide for the latest release, but in case you want to try the latest beta this version with live on the `next` branch. In case certain features are on their way into the beta, but not in a beta yet, they will live on `next/<feature name>`. 

The config files for the betas will live in the `config` folder instead of the releases tab, where the links in the different guides will point to!

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=philip2809/neato-brainslug&type=date&legend=top-left)](https://www.star-history.com/#philip2809/neato-brainslug&type=date&legend=top-left)

## Acknowledgements

- @Fabian Ullrich, Jiska Classen, Johannes Eger, Matthias Hollick, Fabian Freyer, crunch from Secure Mobile Networking Lab
    - [Security and Privacy for IoT Ecosystems](https://tuprints.ulb.tu-darmstadt.de/handle/tuda/4937)
    - [Vacuums in the Cloud:
Analyzing Security in a Hardened IoT Ecosystem](https://www.usenix.org/system/files/woot19-paper_ullrich.pdf)
    - And all of their work on these robots!
- [@jeroenterheerdt](https://github.com/jeroenterheerdt) for testing, reviewing, writing the guide for installing internally and the original [neato-serial](https://github.com/jeroenterheerdt/neato-serial)
- [@algaen](https://github.com/algaen) for the info about the D8 (D9, D10?) robots
- [@tomwj](https://github.com/tomwj) for testing and pictures installing it internally in a D7
- [@RobertSundling](https://github.com/RobertSundling) for the [firmware files](https://github.com/RobertSundling/neato-botvac)
- [@mikeyp] for the amazing logo
