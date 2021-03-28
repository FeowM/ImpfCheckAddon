/*
 * ImpfCheck
 * Copyright (c) 2021 Felix Menke
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  var a;
  var z;
  var urlImpfAvail = "";
  var urlImpfError = "";
  var urlImpfAlive = "";

  function injectScript() {
    console.log("injected");
    showScriptInjected();
    sendWebHook(urlImpfAvail);
    var searchBtn = document.getElementsByClassName("btn btn-magenta kv-btn kv-btn-round search-filter-button");
    if(searchBtn.length>0){ if(searchBtn[0]!= null){
      searchBtn[0].click();
      setTimeout(function(){
        checkImpfAvailable();
      }, 5000); // 5 Sekunden warten.
    }}

    a = window.setInterval(function () {
      var done = false;
      var o = document.getElementsByClassName("its-search-step-info");
      if(o.length>0){ if(o[0]!= null){
        var p = o[0].getElementsByClassName("text-magenta");
        if(p.length>0){ if(p[0]!= null){
          p[0].click();
          setTimeout(function(){
              if(checkImpfAvailable()==true){done=true;}
            }, 20000); // 20 Sekunden warten.
        }}
      }} 

      // Pruefe, ob alles okay:
      setTimeout(function(){
        if(done==false){
          // Etwas stimmt nicht oder es gibt Termine:
          console.log("Es gibt Termine oder etwas stimmt nicht.");
          sendWebHook(urlImpfError);
          removeScript();
        }
        done=false;
      }, 40000); // 40 Sekunden warten.
    }, 660000); // 11 Minuten warten.

    if(urlImpfAlive!=null && urlImpfAlive!="") {
      // Lebenszeichen:
      z = window.setInterval(function () {
        sendWebHook(urlImpfAlive);
      }, 21600000); // 6 Stunden warten.
    }
  }

  function checkImpfAvailable() {
    var h = document.getElementsByClassName("d-flex flex-column its-slot-pair-search-info");
      if(h.length>0){ if(h[0]!= null){
        var j = h[0].getElementsByTagName("span");
        if(j.length>0){ if(j[0]!= null){
          if(j[0].innerHTML.includes("leider keine Termine"))
          {
            console.log("Keine Termine");
            document.getElementById("itsSearchAppointmentsModal").click();
          }else{
            // Nochmalige Pruefung, zur Sicherheit:
            var bodystring = document.documentElement.innerHTML;
            if(bodystring.includes("leider keine Termine")==true){
              impfNotAvailable();
            }else{
              impfIsAvailable();
            }
          }
          return true;
      }}
    }}

    // Fallback: Sollte sich der HTML-Code verändert haben:
    var bodystring = document.documentElement.innerHTML;
    if(bodystring.includes("leider keine Termine")==true){
      console.log("FALLBACK");
      impfNotAvailable();
      return true; // nur hier.
    }else{
      impfIsAvailable()
    }
    return false;
  }

  function impfNotAvailable() {
    console.log("Keine Termine");
    document.getElementById("itsSearchAppointmentsModal").click();
  }

  function impfIsAvailable() {
    console.log("Es gibt Termine");
    sendWebHook(urlImpfAvail);
    removeScript();
  }

  function removeScript() {
    console.log("removed");
    if(a!=null){clearInterval(a);}
    if(z!=null){clearInterval(z);}
    showScriptRemoved();
  }

  function sendWebHook(hookurl) {
    var sending = browser.runtime.sendMessage({
      command: "openTab",
      param1: hookurl,
      param2: "autoclose"
    });
  }

  /**
   * Listen for messages from the background script.
  */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "impfCheckStart") {
      injectScript();
    } else if (message.command === "impfCheckStop") {
      removeScript();
    } else if (message.command === "updateURL") {
      console.log("UPDATE URL");
      urlImpfAvail = message.param1;
      urlImpfError = message.param2;
      urlImpfAlive = message.param3;
    }
  });

  var currUrl = window.location.href;
  var mainImpfUrl="impfterminservice.de/impftermine/service";
  var mainImpfUrl2="impfterminservice.de/impftermine/suche";
  var mainImpfUrl1="impfterminservice.de/impftermine";

  if(currUrl.includes(mainImpfUrl)==false && currUrl.includes(mainImpfUrl2)==false && currUrl.includes(mainImpfUrl1)==true){
    showHTMLMessage('Bitte wählen Sie zuerst Ihr Bundesland und Ihr Impfzentrum aus und klicken Sie dann auf "Zum Impfzentrum".');
  }

  function showScriptInjected() {
    showHTMLMessage('ImpfCheck-Script gestartet. Nach ca. 11 Minuten wird das Script automatisch auf den Button "Termine suchen" erneut klicken.');
  }

  function showScriptRemoved() {
    showHTMLMessage('ImpfCheck-Script gestoppt.')
  }

  function showHTMLMessage(message) {
    var oldInfo = document.getElementById("impfCheckInfo");
    if(oldInfo!=null){
      document.body.removeChild(oldInfo);
    }
    var infodiv = document.createElement("DIV");
    var infotext = document.createElement("P");
    var infotext2 = document.createElement("P");
    infotext.innerHTML = message;
    infotext.style.fontSize = "25px";
    infotext.style.textAlign="center";
    infotext2.innerHTML = 'ImpfCheck-Addon';
    infotext2.style.fontSize = "16px";
    infotext2.style.paddingRight = "25px";
    infotext2.style.textAlign="right";
    infodiv.appendChild(infotext);
    infodiv.appendChild(infotext2);
    infodiv.id = "impfCheckInfo";
    infodiv.style.position="fixed";
    infodiv.style.bottom= "0px";
    infodiv.style.width= "100%";
    infodiv.style.border= "3px solid rgb(138, 192, 7)";
    infodiv.style.minHeight= "50px";
    infodiv.style.backgroundColor= "lightgreen";
    infodiv.style.zIndex = 999;
    document.body.appendChild(infodiv);
  }

})();