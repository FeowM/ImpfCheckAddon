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

var urlImpfAvail = "";
var urlImpfError = "";
var urlImpfAlive = "";
var activeTabID = 0;

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
	var currPage=0;

  document.addEventListener("click", (e) => {

    function impfcheckStart(tabs) {

    	if(checkURLSet()==false){
    		showMessage("Bitte zuerst die URLs in den Einstellungen festlegen.");
    		return;
    	}

    	if(getActiveTabID()!=0){
    		showMessage('Es läuft bereits ein Script. Bitte zuerst auf "Stop" klicken.');
    		return;
    	}

      	browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
          let tab = tabs[0];
          if(tab.url==""){return;}
          if(tab.url.includes("impfterminservice.de/impftermine")==false){showWrongSiteMessage(1); return;}else{
          	if(tab.url.includes("impfterminservice.de/impftermine/service")==false && 
          		tab.url.includes("impfterminservice.de/impftermine/suche")==false){showWrongSiteMessage(2); return;}else{
          		if(tab.url.includes("impfterminservice.de/impftermine/service")==true){
          			showWrongSiteMessage(3); return;
          		}else {
	          		if(tab.url.includes("impfterminservice.de/impftermine/suche")==true){
	          			setActiveTabID(tabs[0].id);
	          			browser.tabs.executeScript({file: "/content_scripts/impfcheck.js"})
						.then(startImpfChecker)
						.catch(reportExecuteScriptError);
	          		}
	          	}
          	}
          }
      	}, console.error);
    }

    function startImpfChecker() {
		updateWebHookURL();
		browser.tabs.sendMessage(getActiveTabID(), {
        	command: "impfCheckStart"
      	});
      	showMessage('Impfcheck gestartet. Nach ca. 11 Minuten wird das Script erneut auf den Button "Termine suchen" klicken. Sobald ein Termin verfügbar ist oder ein Fehler festgestellt wird, wird Sie das Addon über die zuvor in den Einstellungen gesetzten URLs benachrichtigen.');
    }

    function impfcheckStop(tabs) {
      browser.tabs.sendMessage(getActiveTabID(), {
        command: "impfCheckStop"
      });
      resetActiveTabID();
      showMessage('Impfcheck gestoppt.');
    }

    function openSettings() {
    	openPage(3);
    	readSettings();
    }

    function openHelp() {
    	openPage(2);
    }

    /**
     * Just log the error to the console.
     */
    function reportError(error) {
      console.error(`ImpfCheck-Error: ${error}`);
    }

    function showWrongSiteMessage(mode){
    	if(mode==1){
    		showMessage("Falsches Fenster. Bitte öffnen Sie die Website.", true);
      		document.querySelector("#error-link").textContent="Hier";
      		document.querySelector("#error-link").onclick= function(event){openImpfTerminSite();};
    	}
      	if(mode==2){
      		showMessage('Bitte wählen Sie zuerst Ihr Bundesland und Ihr Impfzentrum aus. Klicken Sie danach auf "Zum Impfzentrum".', false);
      	}

      	if(mode==3){
      		showMessage('Bitte geben Sie Ihren Vermittlungscode ein. Klicken Sie danach auf "Termin suchen". Sollten Sie noch keinen Vermittlungscode haben, müssen Sie diesen zuerst beantragen.', false);
      	}
    }

    function showMessage(message, withLink){
		if(withLink==false){
			document.querySelector("#error-link").style.display="none";
			document.querySelector("#error-link").textContent="";
			document.querySelector("#error-link").onclick= "";
		}
      	document.querySelector("#popup-content").classList.add("hidden");
      	document.querySelector("#error-content").classList.remove("hidden");
      	document.querySelector("#error-message").textContent=message;
    }

    function openPage(pageNum) {
    	document.getElementById("popup-content").style.display="none";
    	document.getElementById("popup-content2").style.display="none";
    	document.getElementById("popup-content3").style.display="none";

    	switch(pageNum) {
    		case 1:
    			document.getElementById("popup-content").style.display="block";
    		break;

    		case 2:
    			document.getElementById("popup-content2").style.display="block";
    		break;

    		case 3:
    			document.getElementById("popup-content3").style.display="block";
    		break;

    		default:break;
    	}

    	currPage=pageNum;
    }

    function goPageBack()
    {
    	switch(currPage){
    		case 2:
    		case 3:
    			openPage(1);
    		break;

    		default:break;
    	}
    }

    function saveSettings(){
    	switch(currPage){
    		case 3:
    			urlImpfAvail = document.getElementById("impfavail").value;
    			urlImpfError = document.getElementById("impferror").value;
    			urlImpfAlive = document.getElementById("impfalive").value;

    			if(urlImpfAvail!=""){if(urlImpfAvail.includes("http")==false){urlImpfAvail="http://"+urlImpfAvail;}}
    			if(urlImpfError!=""){if(urlImpfError.includes("http")==false){urlImpfError="http://"+urlImpfError;}}
    			if(urlImpfAlive!=""){if(urlImpfAlive.includes("http")==false){urlImpfAlive="http://"+urlImpfAlive;}}
    			updateFirefoxSettings(urlImpfAvail, urlImpfError, urlImpfAlive, "");
    			updateWebHookURL();
    			openPage(1);
    		break;

    		default:break;
    	}
    }

    function readSettings() {
    	switch(currPage){
    		case 3:
    			document.getElementById("impfavail").value = urlImpfAvail;
    			document.getElementById("impferror").value = urlImpfError;
    			document.getElementById("impfalive").value = urlImpfAlive;
    		break;

    		default:break;
    	}
    }

    function checkURLSet() {
    	if(urlImpfAvail=="" || urlImpfError==""){return false;}
    	return true;
    }

    /**
     * Get the active tab,
     * then call "impfcheckStart()" or "impfcheckStop()" as appropriate.
     */
    if (e.target.classList.contains("start")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(impfcheckStart)
        .catch(reportError);
    }
    else if (e.target.classList.contains("stop")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(impfcheckStop)
        .catch(reportError);
    }
    else if (e.target.classList.contains("settings")) {
      openSettings();
    }
    else if (e.target.classList.contains("help")) {
      openHelp();
    }
    else if (e.target.classList.contains("goback")) {
      goPageBack();
    }
    else if (e.target.classList.contains("dosave")) {
      saveSettings();
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute content script: ${error.message}`);
}

function openImpfTerminSite() {
  var creating = browser.tabs.create({
    url:"https://impfterminservice.de"
  });
  creating.then(onImpfTerminSiteCreated, onImpfTerminSiteError);
}

function updateWebHookURL()
{
	if(getActiveTabID()==0){return;}
	browser.tabs.sendMessage(getActiveTabID(), {
	    command: "updateURL",
	    param1: urlImpfAvail,
	    param2: urlImpfError,
	    param3: urlImpfAlive,
	    param4: activeTabID
	});
}

function updateFirefoxSettings(tmpUrlImpfAvail="", tempUrlImpfError="", tmpUrlImpfAlive="", tmpActiveTabID="") {
	if(tmpUrlImpfAvail==""){tmpUrlImpfAvail=urlImpfAvail;}
	if(tempUrlImpfError==""){tempUrlImpfError=urlImpfError;}
	if(tmpUrlImpfAlive==""){tmpUrlImpfAlive=urlImpfAlive;}
	if(tmpActiveTabID==""){tmpActiveTabID=activeTabID;}
	browser.storage.sync.set({
	    urlImpfAvail: tmpUrlImpfAvail,
	    urlImpfError: tempUrlImpfError,
	    urlImpfAlive: tmpUrlImpfAlive,
	    activeTabID: tmpActiveTabID
	});
}

function onImpfTerminSiteCreated(tab) {
  console.log(`Created new tab: ${tab.id}`)
}

function onImpfTerminSiteError(error) {
  console.log(`Error: ${error}`);
}

function restoreOptions() {

  function setWebHookURLs(result) {
  	console.log("Get URLs");
  	if(result==null || result.urlImpfAvail==null || result.urlImpfError==null || result.urlImpfAlive==null){return;}
  	if(result==undefined || result.urlImpfAvail==undefined || result.urlImpfError==undefined || result.urlImpfAlive==undefined || result.activeTabID==undefined){return;}
  	urlImpfAvail = result.urlImpfAvail;
  	urlImpfError = result.urlImpfError;
  	urlImpfAlive = result.urlImpfAlive;
  	activeTabID = result.activeTabID;
  	updateWebHookURL();
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get(["urlImpfAvail", "urlImpfError", "urlImpfAlive", "activeTabID"]);
  getting.then(setWebHookURLs, onError);
}

function resetActiveTabID()
{
	setActiveTabID(0);
}

function setActiveTabID(id) {
	activeTabID=id;
	updateFirefoxSettings("", "", "", activeTabID);
}

function getActiveTabID() {
	console.log(activeTabID);
	return activeTabID;
}

listenForClicks();

document.addEventListener("DOMContentLoaded", restoreOptions);


function handleMessage(request, sender, sendResponse) {
	console.log("Nachricht eingegangen.");
  	console.log(request);
  	if(request.command=="openTab" && request.param1!=""){
	  	var creating = browser.tabs.create({
		  url:request.param1
		});
		if(request.param2=="autoclose" && request.param1!=""){
			creating.then(onWebHookCreated, onWebHookError);
		}
	}
  //sendResponse({response: "Response from background script"});
}

function onWebHookCreated(tab) {
	setTimeout(function(){
	  browser.tabs.remove(tab.id);
	}, 10000);
}

function onWebHookError(error) {
	console.log(`Error: ${error}`);
}

browser.runtime.onMessage.addListener(handleMessage);

