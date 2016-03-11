// write javascript here
strRELAY1 = "";
strRELAY2 = "";
strRELAY3 = "";
strRELAY4 = "";
strRELAY5 = "";
var RELAY1_state = 0;
var RELAY2_state = 0;
var RELAY3_state = 0;
var RELAY4_state = 0;
var RELAY5_state = 0;
function GetArduinoIO() {
  nocache = "&nocache=" + Math.random() * 100000;
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        if (this.responseXML !== null) {
          // XML file received - RELAY states
          var count;
          // Temperature
          document.getElementById("celsius").innerHTML = this.responseXML.getElementsByTagName('temp')[0].childNodes[0].nodeValue;

          // Button 1
          if (this.responseXML.getElementsByTagName('RELAY')[0].childNodes[0].nodeValue === "on") {
            document.getElementById("RELAY1").innerHTML = "ON";
            RELAY1_state = 1;
          }
          else {
            document.getElementById("RELAY1").innerHTML = "OFF";
            RELAY1_state = 0;
          }
          // Button 2
          if (this.responseXML.getElementsByTagName('RELAY')[1].childNodes[0].nodeValue === "on") {
            document.getElementById("RELAY2").innerHTML = "ON";
            RELAY2_state = 1;
          }
          else {
            document.getElementById("RELAY2").innerHTML = "OFF";
            RELAY2_state = 0;
          }
          // Button 3
          if (this.responseXML.getElementsByTagName('RELAY')[2].childNodes[0].nodeValue === "on") {
            document.getElementById("RELAY3").innerHTML = "ON";
            RELAY3_state = 1;
          }
          else {
            document.getElementById("RELAY3").innerHTML = "OFF";
            RELAY3_state = 0;
          }
          // Button 4
          if (this.responseXML.getElementsByTagName('RELAY')[3].childNodes[0].nodeValue === "on") {
            document.getElementById("RELAY4").innerHTML = "ON";
            RELAY4_state = 1;
          }
          else {
            document.getElementById("RELAY4").innerHTML = "OFF";
            RELAY4_state = 0;
          }
          // Button 5
          if (this.responseXML.getElementsByTagName('RELAY')[4].childNodes[0].nodeValue === "on") {
            document.getElementById("RELAY5").innerHTML = "ON";
            RELAY5_state = 1;
          }
          else {
            document.getElementById("RELAY5").innerHTML = "OFF";
            RELAY5_state = 0;
          }
        }
      }
    }
  };
  // send HTTP GET request with RELAYs to switch on/off if any
  request.open("GET", "home_automation" + strRELAY1 + strRELAY2 + strRELAY3 + strRELAY4 + strRELAY5 + nocache, true);
  request.send(null);
  setTimeout(function() {
	  GetArduinoIO();
  }, 1000);
  strRELAY1 = "";
  strRELAY2 = "";
  strRELAY3 = "";
  strRELAY4 = "";
  strRELAY5 = "";
}
function GetButton1() {
  if (RELAY1_state === 1) {
    RELAY1_state = 0;
    strRELAY1 = "&RELAY1=0";
  }
  else {
    RELAY1_state = 1;
    strRELAY1 = "&RELAY1=1";
  }
}
function GetButton2() {
  if (RELAY2_state === 1) {
    RELAY2_state = 0;
    strRELAY2 = "&RELAY2=0";
  }
  else {
    RELAY2_state = 1;
    strRELAY2 = "&RELAY2=1";
  }
}
function GetButton3() {
  if (RELAY3_state === 1) {
    RELAY3_state = 0;
    strRELAY3 = "&RELAY3=0";
  }
  else {
    RELAY3_state = 1;
    strRELAY3 = "&RELAY3=1";
  }
}
function GetButton4() {
  if (RELAY4_state === 1) {
    RELAY4_state = 0;
    strRELAY4 = "&RELAY4=0";
  }
  else {
    RELAY4_state = 1;
    strRELAY4 = "&RELAY4=1";
  }
}
function GetButton5() {
  if (RELAY5_state === 1) {
    RELAY5_state = 0;
    strRELAY5 = "&RELAY5=0";
  }
  else {
    RELAY5_state = 1;
    strRELAY5 = "&RELAY5=1";
  }
}
