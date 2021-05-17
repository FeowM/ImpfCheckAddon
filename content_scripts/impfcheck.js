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
  //var b;
  var c;
  var z;
  var urlImpfAvail = "";
  var urlImpfError = "";
  var urlImpfAlive = "";
  var activeTabID = 0;
  var timercounter = 11;
  var intervalTimeImpfCheck = 660000; // 11 Minuten.
  var intervalTimeCodeCheck = 300000; // 5 Minuten.
  var errcounter = 0;

  function injectCodeCheckScript() {
    showCodeCheckScriptInjected();
    var radioBtns = document.getElementsByClassName("ets-radio-control");
    if(radioBtns.length>1){ if(radioBtns[1]!= null){
      var noBtn = radioBtns[1].getElementsByTagName("span");
      if(noBtn.length>0){ if(noBtn[0]!= null){
        noBtn[0].click(); // Klicke auf "Nein"
        setTimeout(function(){
          checkCodeAvailable();
        }, 10000); // 10 Sekunden warten.
      }}
    }}s

    a = window.setInterval(injectCodeCheckScript, intervalTimeCodeCheck); // Nach 5 Minuten erneut klicken.

    if(urlImpfAlive!=null && urlImpfAlive!="") {
      // Lebenszeichen:
      z = window.setInterval(function () {
        sendWebHook(urlImpfAlive);
      }, 21600000); // 6 Stunden warten.
    }
  }

  function injectImpfCheckScript() {
    showImpfCheckScriptInjected();
    var searchBtn = document.getElementsByClassName("btn btn-magenta kv-btn kv-btn-round search-filter-button");
    if(searchBtn.length>0){ if(searchBtn[0]!= null){
      searchBtn[0].click();
      setTimeout(function(){
        checkImpfAvailable();
      }, 5000); // 5 Sekunden warten.
    }}

    a = window.setInterval(checkImpfReservTime, intervalTimeImpfCheck);

    if(urlImpfAlive!=null && urlImpfAlive!="") {
      // Lebenszeichen:
      z = window.setInterval(function () {
        sendWebHook(urlImpfAlive);
      }, 21600000); // 6 Stunden warten.
    }
  }

  function checkImpfReservTime()
  {
  	if(checkReservFinished()==true){ // Wenn Zeit abgelaufen:
    	intervalTimeImpfCheck = 660000; // 11 Minuten.
  		doImpfCheck();
  	}else{ // Wenn Zeit nicht abgelaufen:
  		intervalTimeImpfCheck = 60000; // Jede Minute.
  	}  
  	clearInterval(a);
  	a = window.setInterval(checkImpfReservTime, intervalTimeImpfCheck); // Rufe nach intervalTimeImpfCheck-Minute erneut diese Funktion auf.
  }

  function checkReservFinished(){
  	var counterElem = document.getElementsByTagName("strong");
  	var foundCounterText = "";
  	for(var i=0;i<counterElem.length;i++){
      	if(counterElem[i].innerHTML.includes('min ')){
  			foundCounterText = counterElem[i].innerHTML;
  			break;
  		}
  	}
  	if(foundCounterText=="" || foundCounterText!="00min 00s"){
  		return false;
  	}
  	return true;
  }

  function doImpfCheck()
  {
	  timercounter=11;
	  var done = false;
	  var o = document.getElementsByClassName("its-search-step-info");
	  if(o.length>0){ if(o[0]!= null){
	    var p = o[0].getElementsByClassName("text-magenta");
	    if(p.length>0){ if(p[0]!= null){
        simulateClick(p[0]);
	      	setTimeout(function(){
	          if(checkImpfAvailable()==true){done=true;}
	        }, 20000); // 20 Sekunden warten.
	    }}
	  }} 

	  // Pruefe, ob alles okay:
	  setTimeout(function(){
	    if(done==false){
	      // Etwas stimmt nicht oder es gibt Termine:
	      sendWebHook(urlImpfError);
	      removeImpfCheckScript();
	    }
	    done=false;
	  }, 40000); // 40 Sekunden warten.
  }

  function checkImpfAvailable() {
    var h = document.getElementsByClassName("d-flex flex-column its-slot-pair-search-info");
      if(h.length>0){ if(h[0]!= null){
        var j = h[0].getElementsByTagName("span");
        if(j.length>0){ if(j[0]!= null){
          if(j[0].innerHTML.includes("leider keine Termine"))
          {
            impfNotAvailable();
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
      impfNotAvailable();
      return true; // nur hier.
    }else{
      impfIsAvailable()
    }
    return false;
  }

  function impfNotAvailable() {
    document.getElementById("itsSearchAppointmentsModal").click();

    // Nach 7 Sekunden erneut pruefen, ob die Zeit nun wieder von vorne beginnt. Wenn nicht, dann nochmal Link anklicken:
    setTimeout(function(){
	    if(checkReservFinished()==true){ // Wenn Zeit abgelaufen:
      errcounter++;
      if(errcounter>2){ // Wenn Zeit nach dem 3. Versuch immernoch nicht startet:
        errcounter=0;
        // Rufe die derzeitige URL noch einmal auf (AJAX):
        console.log("Reopen site with AJAX.");
        sendWebHook(window.location.href);
      }
			sendCanvasData();
	  		intervalTimeImpfCheck = 660000; // 11 Minuten.
	  		clearInterval(a);
  			doImpfCheck();
  			a = window.setInterval(checkImpfReservTime, intervalTimeImpfCheck); // Rufe nach intervalTimeImpfCheck-Minute erneut diese Funktion auf.
  		}else{
        errcounter=0; // Zeit läuft.
      }
  	}, 7000); 
  }

  function impfIsAvailable() {
    sendWebHook(urlImpfAvail);
    removeImpfCheckScript();
  }

  function removeImpfCheckScript() {
    if(a!=null){clearInterval(a);}
    //if(b!=null){clearInterval(b);}
    if(c!=null){clearInterval(c);}
    if(z!=null){clearInterval(z);}
    showImpfCheckScriptRemoved();
  }

  function checkCodeAvailable() {
    var h = document.getElementsByClassName("alert alert-danger text-center");
    if(h.length>0){ if(h[0]!= null){
      if(h[0].innerHTML.includes("keine freien Termine"))
      {
        return false;
      }else{
        // Nochmalige Pruefung, zur Sicherheit:
        var bodystring = document.documentElement.innerHTML;
        if(bodystring.includes("keine freien Termine")==true){
          return false;
        }else{
          codeIsAvailable();
        }
      }
    }}

    // Sollte Meldung nicht kommen, ist ein Code verfuegbar oder es gab einen Fehler:
    codeIsAvailable();
  }

  function codeIsAvailable() {
    sendWebHook(urlImpfAvail);
    removeImpfCheckScript();
  }

  function removeCodeCheckScript() {
    if(a!=null){clearInterval(a);}
    if(z!=null){clearInterval(z);}
    showCodeCheckScriptRemoved();
  }

  function sendWebHook(hookurl) {
  	let xhr = new XMLHttpRequest();
  	xhr.onload = function () {
  		console.log("done");
  	};

  	xhr.onerror = function (e) {
  		console.log('An error occurred');
  		console.log(e);
  	}
  	xhr.open('GET', hookurl, true);
  	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  	xhr.send();
  	return;
  }

  var simulateClick = function (elem) {
    var evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    var canceled = !elem.dispatchEvent(evt);
  };
  
  function sendCanvasData() {
  	var z1 = document.getElementsByClassName("app-wrapper");
  	if(z1==null){return;}
  	if(z1.length==0){return;}
  	z1[0].dispatchEvent(new Event('mousedown'));
  }

  /**
   * Listen for messages from the background script.
  */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "impfCheckStart") {
      injectImpfCheckScript();
    } else if (message.command === "impfCheckStop") {
      removeImpfCheckScript();
    } else if (message.command === "codeCheckStart") {
      injectCodeCheckScript();
    } else if (message.command === "codeCheckStop") {
      removeCodeCheckScript();
    } else if (message.command === "updateURL") {
      urlImpfAvail = message.param1;
      urlImpfError = message.param2;
      urlImpfAlive = message.param3;
      activeTabID  = message.param4;
    }
  });

  var currUrl = window.location.href;
  var mainImpfUrl="impfterminservice.de/impftermine/service";
  var mainImpfUrl2="impfterminservice.de/impftermine/suche";
  var mainImpfUrl1="impfterminservice.de/impftermine";

  if(currUrl.includes(mainImpfUrl)==false && currUrl.includes(mainImpfUrl2)==false && currUrl.includes(mainImpfUrl1)==true){
    showHTMLMessage('Bitte wählen Sie zuerst Ihr Bundesland und Ihr Impfzentrum aus und klicken Sie dann auf "Zum Impfzentrum".');
  }

  function showImpfCheckScriptInjected() {
    showHTMLMessage('ImpfCheck-Script gestartet. Nach ca. 11 Minuten wird das Script automatisch auf den Button "Termine suchen" erneut klicken.');
  }

  function showImpfCheckScriptRemoved() {
    showHTMLMessage('ImpfCheck-Script gestoppt.')
  }

  function showCodeCheckScriptInjected() {
    showHTMLMessage('CodeCheck-Script gestartet. Nach ca. 5 Minuten wird das Script automatisch auf den Button "Nein" erneut klicken.');
  }

  function showCodeCheckScriptRemoved() {
    showHTMLMessage('CodeCheck-Script gestoppt.')
  }

  function showHTMLMessage(message) {
    var oldInfo = document.getElementById("impfCheckInfo");
    if(oldInfo!=null){
      document.body.removeChild(oldInfo);
    }
    var infodiv = document.createElement("DIV");
    var infotext = document.createElement("P");
    var infotext2 = document.createElement("P");
    infotext.textContent = message;
    infotext.style.fontSize = "25px";
    infotext.style.textAlign="center";
    infotext2.textContent = 'ImpfCheck-Addon';
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
