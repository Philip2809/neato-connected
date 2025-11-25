

## Setup network

If factory reset (by loading the factory IFS or holding the front and right bumper switches while turning it off (I havn't personally tried this method)) or by holding the left bumper switch while turning the robot off, the next time it turns on it will go into pairing mode. I will host a network called `Neato-{serial-number}` (on my factory firmware it is `neato-{serial-number}`).

Connecting to this network, the ip range will be `192.168.219.XXX` with the robot at `192.168.219.1`. (on my factory firmware it is at `192.168.0.1`). 

An nmap scan reveals that port 4443 and port 8081 is open of the robot. (on my factory firmware it is only port 4443 that is open). I am not sure why, but running nmap seams to crash the webserver and to connect to it again I need to restart the robot.

I looked first at how the app connects to the robot, and had some issues when trying to use pcapdroid to decrypt the payload, I got SSL protocol not supported, I tried to connect via curl, same error. I am not exactly sure why; but after some debuggning I think it requires a TLS 1.0 handshake and modern curl/mitmproxy/python is not happy for that. Sending curl requests with `--ciphers ALL:@SECLEVEL=0` solves the issues with TLS.

The endpoints important to the setup is:
```
GET /info
GET /wifi_networks
PUT /robot/initialize
GET /robot/wifi_networks/new/progress
PUT /robot/access_point/shutdown
```

The app sends `authorization` headers but I think that it is pointless, I have just been sending random data on this header during all my testing. I will be testing to remove headers that might be unnessecery.

Lets look at the request body and response body.
GET /info
```json
{
    "serial": "serial-number",
    "model": "BotVacD3Connected",
    "firmware": "4.5.3-189", // 3.2.0-305 for my factory firmware
    "name": "name-of-robot", // empty string if factory reset
    "easyWifiConnectVersion": "advanced-3" // basic-3 for my factory firmware
}
```

GET /wifi_networks
```json
[
    {
        "ssid": "wifi ssid",
        "strength": 3 // seams to be from 1-3, 3 being strongest
    }
    [...]
]
```

PUT /robot/initialize
request:
```json
{
    "name": "name to give robot",
    "password": "password of wifi to connect to",
    "server_urls": {
        "beehive": "beehive", // .neatocloud.com will be autoapended
        "ntp": "pool.ntp.org",
        "nucleo": "nucleo" // .neatocloud.com will be autoapended
    },
    "ssid": "ssid of wifi to connect to",
    "timezone": "Europe/Stockholm",
    "user_id": "userid", // hash of some kind?
    "utc_offset": "UTC+1:00UTC+2:00"
}
```
response is just an empty object.

GET /robot/wifi_networks/new/progress
```json
{
    "type": "primary",
    "step": 1/2/3/4, // 1 - connecting to wifi, 2 - connecting to internet, 3 - connecting to neato cloud, 4 - connecting robot
}
```

There seams to be 2 more endpoints:
```
PUT /robot/wifi
PUT /robot/wifi_networks/primary
```

however I am not sure how these work, might be used by older firmware versions, havn't tried to do the setup via app then mitm it with the factory firmware yet.

### mitmproxy to look at data
You will need mitmproxy 4.0.4 (other versions may also work). I would recommend downloading their binary with the correct python version bundeled from:
https://www.mitmproxy.org/downloads/#4.0.4/

Run mitmproxy with:
`mitmproxy --listen-host 0.0.0.0 --listen-port 8080 --ssl-insecure`

Open port 8080, I just open all temporarly:
`iptables -I INPUT -j ACCEPT`

Connect the pc running mitmproxy to the robot AP first, then connect the phone to the robot AP and set the proxy settings as follows:
```
Server: 192.168.219.9
Port: 8080
```

Of couse, check your exact ip in case you are on another firmware version or it is not working.


## Once connected to wifi

Once connected to wifi the robot will do the following:
1. Check internet connactivity by pinging 8.8.8.8
2. Get NTP servers from pool and update the time
3. Contact the "beehive" url (with `.neatocloud.com` appended)

Rewriting the DNS in my router to an local openssl server to see if the robot is checking certificates gave: `SSL3 alert read:fatal:unknown CA`, meaning the cloud replacment method is not possible without removing secure boot and changing the CA list.
