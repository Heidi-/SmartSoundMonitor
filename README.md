Environmental Noise Detector (E.N.D.Y)
=============================================
See [LICENSE.md](LICENSE.md) for license terms and conditions.

App Overview
------------
This is a personal noise exposure monitor designed for the Women Who Code IoT Sustainable Cities Hackathon, sponsored by Intel.

Internationally, both cities and urban workplaces are getting louder and louder. Prolonged exposure to noise can have negative effects on health and productivity. The monitor provides instantaneous feedback (LEDS alert the user to sounds over 120dB, OSHA's recommended sound level). The monitor also tracks the cummulative amount of noise the user is exposed to over a 24 hour period, and alerts the user when they've hit above the WHO's recommend noise exposure for the day.

The monitor comes equipped with vibration and a buzzer for the visually impaired, and pulls data from Strava or Fitbit to measure heart rate and graph it against noise exposure. 

[Picture of the E.N.D.Y Prototype](ENDY.jpg)

Hardware Requirements
------------
* Grove Starter Kit Plus containing:
* Intel Edison platform with an Arduino breakout board
* Grove Sound Sensor
* Grove red, green and blue LEDs
* Grove Rotation Motor

Software Requirements
------------
* Intel System Studio IoT Edition
* Intel XDK
* Node.JS library


Getting Started
------------
For help getting started running Intel XDK, please start with
[the Intel XDK documentation](https://software.intel.com/en-us/xdk/docs).

See pictures [full hardware](hardware_setup.jpg) and [board closeup](hardware_setup_board.jpg).

Important App Files
--------------------------
* main.js
* package.json

Important Project Files
------------------------------
* README.md
* LICENSE.md
* project-name.xdk
* project-name.xdke

Repo for Accompanying App
------------------------------
* https://github.com/AddisonNishijima/wwc-hackathon-sound-companion-app


Authors/Contributors
----------------------------
* [Heidi Perry](https://github.com/Heidi-)
* [Addison Nishijima](https://github.com/AddisonNishijima)
* [Alanna Risse](https://github.com/alannarisse)
* [Ewa Manek](https://github.com/ewajm)
* [Sara Jensen](https://github.com/the jensen)
* [Elise Avery Nason](https://github.com/ElysiaAvery)
* [Keeley Hammond](https://github.com/VerteDinde)

Copyright (c) 2016.

Acknowledgements
----------------------------
Thanks to Women Who Code 2016 and Intel for sponsoring the 2016 Hackathon and 
providing all of the hardware that we used to build the sound monitor.

Thanks to Simple for providing the space for us to work.

Data Sources
----------------------------
* http://www.nonoise.org/library/handbook/handbook.htm
* http://www.who.int/docstore/peh/noise/Commnoise4.htm
* https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1253729
* http://www.nonoise.org/library/smj/smj.htm
