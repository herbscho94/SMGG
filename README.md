# Inside Thai Property - Social Media Grafik Generator

Eine lokale Web-Anwendung zur automatisierten Generierung von Social Media Grafiken (Titelbildern) basierend auf einer festen Vorlage.

## 🚀 Schnellstart

1. Öffnen Sie die `index.html` Datei direkt in Ihrem Browser
2. Die Anwendung läuft vollständig lokal ohne Backend-Server

## ✨ Funktionen

### 🖼️ Bild-Mosaik
- Upload von bis zu 5 Bildern
- Automatische Anordnung in Mosaik-Layout
- Hauptbild (groß) + 4 kleinere Bilder
- Drag & Drop Unterstützung

### 📝 Dynamische Texteingaben
- **Projektname**: Objektname (z.B. "NUE EPIC ASOK - RAMA 9")
- **Startpreis**: Preis pro Quadratmeter (z.B. "135,000 BAHT / SQM")
- **Beispielpreis**: Konkretes Beispiel (z.B. "26 SQM UNIT FROM 3.5 M BAHT")

### 📊 Lukrativitäts-Indikator
- Schieberegler von 0-100%
- Farbkodierung:
  - 0-33%: Rot (Weniger lukrativ)
  - 34-66%: Gelb (Normal)
  - 67-100%: Grün (Sehr lukrativ)
- Goldener Indikator-Punkt

### 📱 Export-Formate
- **Instagram/Facebook Square**: 1:1 (1080x1080 px)
- **Instagram Portrait**: 4:5 (1080x1350 px)
- **TikTok Portrait**: 9:16 (1080x1920 px)

## 🎨 Corporate Design

### Farben
- **Dunkelblau**: `#1a365d` (Header, Rahmen)
- **Dunkelgrün**: `#2d5016` (Logo-Hintergrund)
- **Gold/Gelb**: `#f6ad55` (Akzentfarbe, Text-Highlights)

### Layout-Struktur
1. **Header**: Logo "inside property" mit dunkelgrünem Kasten
2. **Bildbereich**: Mosaik-Layout für Upload-Bilder
3. **Fußzeile**: Dunkler Hintergrund für Texte und Indikator

## 🛠️ Technologie-Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Bildgenerierung**: html2canvas
- **Design**: Responsive CSS mit CSS Grid/Flexbox
- **Keine Dependencies**: Läuft ohne Node.js oder Backend

## 📁 Dateistruktur

```
/
├── index.html          # Haupt-HTML-Datei
├── style.css           # CSS-Styles mit Corporate Design
├── script.js           # JavaScript-Funktionalität
└── README.md           # Diese Dokumentation
```

## 🔧 Verwendung

1. **Bilder hochladen**: Klicken Sie auf "Dateien auswählen" und wählen Sie bis zu 5 Bilder aus
2. **Texte eingeben**: Füllen Sie die Eingabefelder für Projektname und Preise aus
3. **Indikator einstellen**: Bewegen Sie den Schieberegler für die Lukrativität
4. **Format wählen**: Wählen Sie das gewünschte Export-Format
5. **Grafik generieren**: Klicken Sie auf "Grafik generieren & Download"

## 📱 Responsive Design

Die Anwendung passt sich automatisch an verschiedene Bildschirmgrößen an:
- **Desktop**: Side-by-side Layout mit Control Panel
- **Tablet**: Gestapeltes Layout
- **Mobile**: Optimiertes Layout für kleine Bildschirme

## 🎯 Features im Detail

### Bild-Upload
- Unterstützt alle gängigen Bildformate (JPG, PNG, GIF, WebP)
- Automatische Größenanpassung und Optimierung
- Vorschau der hochgeladenen Bilder
- Möglichkeit, einzelne Bilder zu entfernen

### Text-Synchronisation
- Echtzeit-Updates zwischen Eingabefeldern und Anzeige
- Automatische Formatierung und Styling
- Responsive Textgrößen

### Export-Funktion
- Hochauflösende PNG-Ausgabe (2x Skalierung)
- Automatische Größenanpassung je nach Format
- Optimierte Dateigröße bei hoher Qualität

## 🔒 Datenschutz

- Alle Daten werden lokal im Browser verarbeitet
- Keine Übertragung von Daten an externe Server
- Bilder werden nicht gespeichert oder übertragen
- Vollständig offline-fähig

## 🐛 Fehlerbehebung

### Häufige Probleme:
1. **Bilder werden nicht angezeigt**: Überprüfen Sie das Bildformat (JPG, PNG empfohlen)
2. **Download funktioniert nicht**: Stellen Sie sicher, dass Pop-ups erlaubt sind
3. **Layout-Probleme**: Aktualisieren Sie den Browser-Cache (Strg+F5)

### Browser-Kompatibilität:
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 📞 Support

Bei Fragen oder Problemen wenden Sie sich an das Entwicklungsteam von Inside Thai Property.
