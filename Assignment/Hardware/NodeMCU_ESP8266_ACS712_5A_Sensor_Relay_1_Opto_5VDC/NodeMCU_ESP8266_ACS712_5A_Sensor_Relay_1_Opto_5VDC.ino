#include <ACS712.h>
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

const char* ssid = "BKHCM_OISP";
const char* password = "bachkhoaquocte";
const char* MQTTServer = "192.168.0.111";
const int MQTTPort = 1883;

boolean isOff = true;
double AmpsRMS = 0;
double SensorVoltage = 0;
double SensorVRMS = 0;
float KWH = 0;
int mVperAmp = 185;
int pinout = 2;
uint32_t lastTime = 0;

WiFiClient ESPClient;
PubSubClient client(ESPClient);
ACS712 sensor(ACS712_05A, A0);

void setup()
{
  Serial.begin(115200);

  pinMode(pinout, OUTPUT);
  digitalWrite(pinout, HIGH);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println("Wi-Fi Connecting.......");
  }
  Serial.println("Wi-Fi Connected");

  Serial.println("Calibrating... Ensure that no current flows through the sensor at this moment");
  sensor.calibrate();
  Serial.println("Done!");

  client.setServer(MQTTServer, MQTTPort);
  client.setCallback(callback);

  while (!client.connected())
  {
    Serial.println("\n\rMQTT Connecting.......");

    if (client.connect("ESP8266Client"))
    {
      Serial.println("MQTT Connected");
      client.subscribe("IoT/Relay");
    }
    else
    {
      Serial.print("MQTT Failed Connection ");
      Serial.print(client.state());
      delay(1000);
    }
  }
}

void toggleRelay()
{
  digitalWrite(pinout, !digitalRead(2));
  isOff = !isOff;
  if (isOff)
  {
    char chP[10];
    Serial.println(String("P = ") + KWH + " KWH");
    dtostrf(KWH, 5, 2, chP);
    client.publish("IoT/KWH", strcat(chP, "-1"));
  }
}

void callback(char* topic, byte* payload, unsigned int length)
{
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);

  String message = "";
  for (int i = 0; i < length; i++)
  {
    message = message + (char)payload[i];
  }

  if (message == "Toggle")
  {
    toggleRelay();
    Serial.println("Relay Toggled");
  }

  Serial.print("Message: ");
  for (int i = 0; i < length; i++)
  {
    Serial.print((char)payload[i]);
  }

  Serial.println();
  Serial.println("-------");
}

float getSensorVoltageInput()
{
  float result;

  int readValue; // value read from the sensor
  int maxValue = 0; // store max value here
  int minValue = 1024; // store min value here

  uint32_t start_time = millis();
  while ((millis() - start_time) < 1000) // sample for 1s
  {
    readValue = analogRead(A0);
    // see if you have a new maxValue
    if (readValue > maxValue)
    {
      maxValue = readValue;
    }
    if (readValue < minValue)
    {
      minValue = readValue;
    }
  }

  result = ((maxValue - minValue) * 5.0) / 1024.0;

  return result;
}

void loop()
{
  client.loop();

  lastTime = millis();
  SensorVoltage = getSensorVoltageInput();
  SensorVRMS = (SensorVoltage / 2.0) * 0.707;
  AmpsRMS = (SensorVRMS * 1000) / mVperAmp;
  Serial.print(AmpsRMS);
  Serial.print("RMS Current ");
  Serial.print("Energy ");
  KWH = KWH + (((AmpsRMS * 220 * 0.9) / 3600000) * (millis() - lastTime)); // taken 220V RMS (Indian Scenario) and PF 0.9
  Serial.print(millis());
  Serial.print(" : ");
  Serial.println(KWH);

  delay(500);
}
