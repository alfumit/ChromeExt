#define thermoPin A0
#define lightPin A1
#define thermoKey 7
#define lightKey 6

#include <LiquidCrystal.h>
#include <math.h>

LiquidCrystal lcd(13,12,11,10,9,8);
String valueStorage = "Please enter";
unsigned long thermoWait = millis();
unsigned long lightWait = millis();

void setup() {
  // Initialize pins
  pinMode(thermoPin, INPUT);
  pinMode(lightPin, INPUT);
  pinMode(thermoKey, INPUT_PULLUP);
  pinMode(lightKey, INPUT_PULLUP);

  //Initialize lcd
  lcd.begin(5, 2);
  lcd.print("Please enter");
  lcd.setCursor(0,1);
  lcd.print("your text!");
  //Initialize serial connection 
  Serial.begin(9600);
}

void loop(){

  char incomingChar;
  String valueRead = "";

  //Read the button state
  boolean thermoKeyPressed = digitalRead(thermoKey);
  boolean lightKeyPressed = digitalRead(lightKey);

  //Temperature calculation
  float thermoValue = analogRead(thermoPin)*5.0 / 1023.0;
  float temperature = 1.0 / (log(thermoValue / 2.5) / 4300.0 + 1.0 / 298.0) - 273;
  //Lighting calculation
  float lightValue = 5.0 * (analogRead(lightPin) / 1024.0);
  float  resistor = (10.0*5.0)/lightValue-10.0;
  float  lx = 2223.35*pow(resistor,-10/8);
  Serial.print(millis());
  Serial.print(" wait till ");
  Serial.println(lightWait);

  if(!thermoKeyPressed) {
    //   In case if the key is pressed temperature information is closed
    lcd.clear();
    lcd.print("The temp is");
    lcd.setCursor(0,1);
    lcd.print(temperature);

    Serial.print("The temp is ");
    Serial.println(temperature);
    delay(3000);
  } 
  else if(!lightKeyPressed) {

    lcd.clear();
    lcd.print("The light is");
    lcd.setCursor(0,1);
    lcd.print(lx);

    Serial.print("Lux ");
    Serial.println(lx);
    delay(3000);
  }
  else {
    //In case  if not pressed works by showing the value recieved from Serial
    while(Serial.available()) {
      incomingChar = Serial.read();
      valueRead.concat(incomingChar);
    }

    if(valueRead!="") {
      valueStorage = valueRead;
      lcd.clear();
      lcd.print(valueRead);

      if(valueRead.length() > 16) { 
        for(int i=0; i < valueRead.length()- 16; i++)  {
          lcd.scrollDisplayLeft();
          delay(300);
        }

      }
      Serial.println(valueRead);
    } 
    else if(valueRead=="") {
      lcd.clear();
      lcd.print(valueStorage);
      delay(1000);
      if(valueStorage.length() > 16) { 
        for(int i=0; i < valueStorage.length()- 16; i++)  {
          lcd.scrollDisplayLeft();
          delay(300);
        }

      }
    }

    if((temperature > 30.0) && (millis() > thermoWait)) {
      lcd.clear();
      lcd.print("It's too hot!");
      lcd.setCursor(0,1);
      lcd.print("Turn on the fan.");
      delay(2000);
      thermoWait = millis()+900000;     
    } 
    else if ((temperature < 20.0) && (millis() > thermoWait)) {
      lcd.clear();
      lcd.print("It's very cold!");
      lcd.setCursor(0,1);
      lcd.print("Let's dance.");
      delay(2000);
      thermoWait = millis()+900000;    
    }
    if((lx > 500.0) && (millis() > lightWait)) {
      lcd.clear();
      lcd.print("Too much light!");
      delay(2000);
      lightWait = millis()+900000;     
    } 
    else if ((lx < 300.0) && (millis() > lightWait)) {
      lcd.clear();
      lcd.print("Too dark!");
      delay(2000);    
      lightWait = millis()+900000;
    }    
  }
}


