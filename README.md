# ImpfCheckAddon

Dieses Addon für Firefox (Windows, Linux, Mac, <b>nicht Android und nicht iOS</b>) soll dabei helfen, leichter eine Corona-Schutzimpfung zu bekommen.
Es ist mit diesem Addon theoretisch möglich, innerhalb von ein paar Stunden, einen Impftermin zu bekommen (natürlch abhängig von der Impfstoff-Verfügbarkeit im jeweiligen Impfzentrum).

Das Addon klickt dabei lediglich den Button "Termine suchen" auf der <a href="https://impfterminservice.de" target="_blank">impfterminservice.de - Seite</a> ca. alle 11 Minuten an und prüft, ob nun ein Impftermin verfügbar ist.
Ist ein Impftermin verfügbar, wird die zuvor in den Einstellungen festgelegte URL aufgerufen. Diese URL sollte dann eine Mitteilung auf einem mobilen Endgerät verursachen, sodass der Benutzer schnell seinen Impftermin innerhalb von 10 Minuten wahrnehmen kann.

<b>Das Addon bucht keine Termine selbstständig! Es benachrichtigt lediglich den Benutzer, dass ein Impftermin für Ihn für 10 Minuten reserviert wurde.</b>

# NEU
Vermittlungscode kann nun ebenfalls über das Addon automatisiert gesucht werden!

# Voraussetzungen
1. Ein Smartphone (Android oder iOS) mit entsprechender App (nachfolgend beschrieben)

# App für die Benachrichtigung auf dem Smartphone
Um sogenannte WebHook-URLs zu generieren (einfach gesagt: eine URL), wird z.B. eine der folgenden App benötigt:

Für Android-Smartphones: <a href="https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid" target="_blank">Macrodroid</a>
Für iPhone (iOS): <a href="https://apps.apple.com/de/app/push-custom-notifications/id1444391917" target="_blank">Push: custom notifications</a>

<b>Hinweis:</b>
Die oben aufgeführten Apps sind lediglich eine Empfehlung. Ich übernehme keinerlei Verantwortung für die Nutzung und den evtl. entstandenen Schäden durch die oben erwähnten Apps. Es können gerne auch andere Apps verwendet werden. In der Regel sollten aber keine Probleme auftreten.

# Installation / Einrichtung
1. Die aktuelle Version des Firefox-Addons herunterladen (<a href="https://github.com/FeowM/ImpfCheckAddon/raw/main/firefoxRelease/impfcheck-1.5-fx.xpi" target="_blank">hier</a>) (<b>nur für Windows, Linux und Mac</b>).
2. Eine der oben aufgeführten App auf dem Smartphone installieren
3. Die App öffnen und die Einrichtung abschließen (Beim Programm für iOS kann eine Fake-Email-Adresse zur Registrierung angegeben werden). Bei Android die 3 Macros herunterladen (unten aufgelistet) und mit Macrodroid öffnen / installieren. Nähere Informationen zur Einrichtung folgen noch.
4. Am Besten die URL's testweise im Webbrowser öffnen und prüfen, ob eine Benachrichtung auf dem Smartphone angezeigt wird.
5. Die generierten URL's in der App kopieren und im ImpfCheck-Addon für Firefox unter dem Menüpunkt "Einstellungen" hinzufügen / speichern.
6. Nun die Seite <a href="https://impfterminservice.de" target="_blank">impfterminservice.de</a> aufrufen.
7. Das Bundesland auswählen
8. Das gewünschte Impfzentrum auswählen
9. Auf "Zum Impfzentrum" klicken
10. Vermittlungscode eingeben (sofern vorhanden, ansonsten Schritt 10.2 ausführen)
11. Auf "Termin suchen" klicken
12. ImpfCheck-Addon öffnen und auf die Schaltfläche "Start" klicken. Es sollte sich ein Fenster öffnen auf der Website.
13. Warten. Sobald ein Termin verfügbar ist, kommt eine Benachrichtigung auf das Smartphone.

10.2 Noch keinen Vermittlungscode? Dann auf "Vermittlungscode suchen" im Addon klicken.
11.2 Warten. Sobald ein Vermittlungscode verfügbar ist, kommt eine Benachrichtigung auf das Smartphone.


# Macro-Vorlagen für Macrodroid
Nachfolgend habe ich bereits 3 Macro-Vorlagen für Macrodroid programmiert. Diese können - nachdem die <a href="https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid" target="_blank">App</a> zuvor installiert wurde - einfach durch einen Klick auf die Datei, installiert werden. Somit muss nur noch die URL, welche unter dem "Auslöser" (roter Hintergrund, ganz oben) steht, in die Einstellungen des Addons eingefügt werden.

Bitte mit "Rechtsklick -> Ziel speichern unter" auf dem Endgerät (Android) abspeichern.
<ul>
  <li>Macro für Impfung verfügbar - Benachrichtigung: <a href="https://github.com/FeowM/ImpfCheckAddon/raw/main/macrodroid_macros/ImpfAvail.macro">Download</a></li>
  <li>Macro für Impfung Fehlgeschlagen - Benachrichtigung: <a href="https://github.com/FeowM/ImpfCheckAddon/raw/main/macrodroid_macros/ImpfError.macro">Download</a></li>
  <li>Macro für Impfung Lebenszeichen - Benachrichtigung: <a href="https://github.com/FeowM/ImpfCheckAddon/raw/main/macrodroid_macros/ImpfAlive.macro">Download</a></li>
  <li>Macro für Vermittlungscode verfügbar - Benachrichtigung: <a href="https://raw.githubusercontent.com/FeowM/ImpfCheckAddon/main/macrodroid_macros/CodeAvail.macro">Download</a></li>
  
</ul>

Ich hoffe ich konnte durch dieses Addon dem ein oder anderen etwas helfen.
Bitte entschuldigt den etwas unsauber programmierten Code. Das ist mein erstes Firefox-Addon und ich wollte es einfach so schnell wie möglich veröffentlichen.
