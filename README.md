Good day everyone,

My first Arduino-based project is ready and it turned out to be rather useful.

As I looked around for project ideas, almost instantly I found several ways to improve my surroundings at work. I started with determining a set of problems I can address and those turned to be rather universal:

Temperature. Air conditioning system in our office is great and state-of-the-art but nonetheless we have enough local heat/cold problems (you should have seen a balloon flying in circles around the office pushed by wind from various directions)
Lighting. The lighting in our room is automated although it feels like the sensor is placed in a wrong position and it never works right.
Distractions. The process of programming implies you have to focus and any distraction might ruin the sequence of ideas in your head crucial to finish the job. An indication that you're busy and which task you're working on might just help cope with that.
First two points are rather clear and installing temperature and light sensors with LED indicator would deal with the problem, while distractions are slightly harder to tackle. My approach was to add an LCD screen that would show the task I was working on and it would a way to communicate my working state (it still won't fend off those standing behind my back and peering into my screen, probably need a laser pointer that would shoot in their eyes, but I care just a tad too much about people to do that). For that purpose I chose to use our existing JIRA task manager and integrate my new functionality into existing workflow.

The most interesting stuff comes to mind as you try to implement all of this in one device in a friendly way, so you wouldn't waste more time pressing buttons and dancing around with numbers than getting useful information. So I've decided to write an application for Google Chrome browser as it's last experimental builds, fortunately, support serial (USB) communication and it's possible to open actual pages and track user actions in them. That's a key concept and let's go on with a more detailed view.

Temperature & Lighting indication.

The idea for this part was to provide real-time data on temperature and lighting as well as warnings when parameters go out of a predefined range. Of course, the first thing to do is to define measurement units and ranges.

In Russia, we have standards for workplace environment parameters, which I took as a base for my measurement. The temperature should be measured in Celsius; lighting should be measured in lux (lumen on square meter). And the ranges are:

temperature from 22 to 28 Celcius
lighting from 300 to 500 lux on the level of your desk
So this project could actually be used as a tool for health inspectors. To indicate parameters going out of ranges there's an LED on the board which is doubled by LCD screen information.

I've made 3 ways of showing information:

since we have an LCD screen it would be nice to teach it to display temperature information. I've made two dedicated buttons both for temperature and lighting, which would show you temperature and lighting information as long as you hold it
since we have USB connection to a computer and an dedicated application, I've made special containers in it which would get real-time updates on both parameters
a dedicated LED that would show indicate inappropriate working conditions, it's doubled by LCD texts. Too hot - LED flashes red (burning at work), LCD says "It's too hot. Turn on the fan", too cold - LED flashes blue (ice cold), LCD says "It's too cold. Time to dance", too dark - LED flashes green (too bad you can't flash black), LCD says "It's too dark", too bright - LED flashes white (adds some more brightness), LCD says "It's too bright".
Task manager integration.

At work, we have use Atlassian JIRA as a task manger. Although it's a great tool it still doesn't have such state-of-the-art capabilities as my project requires. So I've decided to go with a workaround, namely build an application for a browser that would add an overlay to our task manager. The overlay would detect user actions on the page and send the data to Arduino controller over USB.

Routine with the task manager doesn't change except that you don't do it in a browser window but in an application that replicates one.

As user clicks on "Start" button to initiate the progress on task, information on task number and heading is gathered and sent to Arduino, which in turn displays it on the LCD screen. In addition, this text is shown as long as the task is in progress.

Results.

Hurrah! Now everybody knows when I'm busy and, looking at the whole set up, knows that it's serious. Plus I have a legal right to stop working when a warning pops up on inappropriate conditions. Cool, right?

You can find detailed information on my account in GitHub, soon there will be docs and schematics.

Hacks:

1. Arduino UNO restarts as soon as you establish serial connection. To avoid that you need to start your Arduino and then put a 10mF capacitor between reset pin and the ground.
2. USB sends values as in chunks 1 byte length, and when the value comes it doesn't necessarily contain all the values you meant to send. To solve this you need to track incoming
 code "10" which corresponds the end of line. Only then you'll get the lines right 