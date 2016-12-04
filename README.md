Intel® XDK IoT * Personal Sound/Noise Exposure Monitor
=============================================
See [LICENSE.md](LICENSE.md) for license terms and conditions.

App Overview
------------
This is a personal noise exposure monitor designed for the Women Who Code IoT Sustainable Cities Hackathon, sponsored by Intel.

Internationally, both cities and urban workplaces are getting louder and louder. Prolonged exposure to noise can have negative effects on health and productivity. The personal noise exposure monitor provides instantaneous feedback (LEDS alert you to sounds that are either over 90dB, OSHA's recommended sound level). The monitor also tracks the cumulate amount of noise that you've been exposed to over a 24 hour period, and alert you when you've hit above the WHO's recommend noise exposure for the day.

The monitor comes equipped with vibration and a buzzer for the visually impaired, and pulls data from Strava or Fitbit to measure heart rate and graph it against noise exposure.

Hardware Requirements
------------
Grove Starter Kit Plus containing:
Intel Edison platform with an Arduino breakout board
Grove Sound Sensor
Grove red, green and blue LEDs
Grove Rotation Motor

Software Requirements
------------
Intel System Studio IoT Edition
Intel XDK install
IDE: Node.JS (?)

This sample application is distributed as part of the
[Intel® XDK](http://xdk.intel.com). It can also be downloaded
or cloned directly from its git repo on the
[public Intel XDK GitHub\* site](https://github.com/gomobile).

For help getting started developing applications with the
Intel XDK, please start with
[the Intel XDK documentation](https://software.intel.com/en-us/xdk/docs).

Getting Started
------------
A simple Node.js application that blinks the onboard LED (a GPIO output),
on select Intel IoT development boards, and displays the result of that write
on the console log.

The app initializes a single pin to digital output mode, so it can be written;
writes that digital output at a regular basis; and prints the result of each
write to the console. The specific pin that is written is configured in
`cfg-app-platform.js` and can be identified by looking for lines similar to the
following line of code, in the `cfg.init` method:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    io = opt.altPin ? io : 100 ;            // use alternate pin?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In the example shown above, LED "pin 100" will be used to flash the LED.

**IMPORTANT:** the LED pin that is configured by the sample is a function of the
detected board. You **must** inspect the code to determine which LEd pin is being
configured for use on your board!!

Some boards have multiple LEDs that can be written to ("flashed" or "blinked").
The `cfg-app-platform.js` module has been designed so you can override the pin
that is used, by passing it an alternate pin during the init call (see the module
documentation). Or, you can simply modify the code to change the default value.

Important Sample App Files
--------------------------
* main.js
* package.json

Important Sample Project Files
------------------------------
* README.md
* LICENSE.md
* project-name.xdk
* project-name.xdke

Tested IoT Node.js Platforms
----------------------------
* [Intel® Galileo Board](http://intel.com/galileo)
* [Intel® Edison Development Platform](http://intel.com/edison)
* [Intel® Joule™ 570x Developer Kit](http://intel.com/joule)


Authors/Contributors
----------------------------
Heidi Perry (GitHub: Heidi-)
Addison Nishijima (gh: AddisonNishijima)
Alanna Risse (gh: alannarisse)
Ewa Manek (gh: ewajm)
Sara Jensen (gh: the jensen)
Elise Avery Nason (gh: ElysiaAvery)
Keeley Hammond (gh: VerteDinde)
Susan Johnson (gh: Brownish-Brown)
Copyright (c) 2016.

Acknowledgements
----------------------------
Thanks to Women Who Code 2016 and Intel for sponsoring the 2016 Hackathon and providing all of the hardware that we used to build the sound monitor.
Thanks to Simple for providing the space for us to work.

Data Sources
----------------------------
http://www.nonoise.org/library/handbook/handbook.htm\
http://www.who.int/docstore/peh/noise/Commnoise4.htm\
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1253729/\
http://www.nonoise.org/library/smj/smj.htm\
