# ImpfCheckAddon

Dieses Addon für Firefox soll dabei helfen, leichter eine Corona-Schutzimpfung zu bekommen.

Das Addon klickt dabei lediglich den Button "Termine suchen" auf der <a href="https://impfterminservice.de" target="_blank">impfterminservice.de - Seite</a> ca. alle 11 Minuten an und prüft, ob nun ein Impftermin verfügbar ist.
Ist ein Impftermin verfügbar, wird die zuvor in den Einstellungen festgelegte WebHook-URL aufgerufen. Diese URL sollte dann eine Mitteilung auf einem mobilen Endgerät triggern, sodass der Benutzer schnell seinen Impftermin innerhalb von 10 Minuten wahrnehmen kann.

<b>Das Addon bucht keine Termine selbstständig! Es benachrichtigt lediglich den Benutzer, dass ein Impftermin für Ihn für 10 Minuten reserviert wurde.</b>

Um sogenannte WebHook-URLs zu generieren, wird z.B. eine der folgenden App benötigt:

Für Android-Smartphones: <a href="https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid" target="_blank">Macrodroid</a>
Für iPhone (iOS): <a href="https://apps.apple.com/de/app/push-custom-notifications/id1444391917" target="_blank">Push: custom notifications</a>

<b>Hinweis:</b>
Die oben aufgeführten Apps sind lediglich eine Empfehlung. Ich übernehme keinerlei Verantwortung für die Nutzung und den evtl. entstandenen Schäden durch die oben erwähnten Apps. Es können gerne auch andere Apps verwendet werden. In der Regel sollten aber keine Probleme auftreten.

# Macro-Vorlagen für Macrodroid
Nachfolgend habe ich bereits 3 Macro-Vorlagen für Macrodroid programmiert. Diese können - nachdem die <a href="https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid" target="_blank">App</a> zuvor installiert wurde - einfach durch einen Klick auf die Datei, installiert werden. Somit muss nur noch die URL, welche unter dem "Auslöser" (roter Hintergrund, ganz oben) steht, in die Einstellungen des Addons eingefügt werden.

<ul>
  <li>Macro für Impfung verfügbar - Benachrichtigung: <a href="">Download</a></li>
  <li>Macro für Impfung Fehlgeschlagen - Benachrichtigung: <a href="">Download</a></li>
  <li>Macro für Impfung Lebenszeichen - Benachrichtigung: <a href="">Download</a></li>
</ul>

Ich hoffe ich konnte durch dieses Addon dem ein oder anderen etwas helfen.
Bitte entschuldigt den etwas schlampig programmierten Code. Das ist mein erstes Firefox-Addon und ich wollte es einfach so schnell wie möglich veröffentlichen.
