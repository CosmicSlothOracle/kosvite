# 🔑 GitHub Token & Git Gateway Setup Guide

## **Schritt 1: GitHub Personal Access Token erstellen**

### **1.1 GitHub.com aufrufen**

- Gehe zu: https://github.com/settings/tokens
- Oder: GitHub → Settings → Developer settings → Personal access tokens

### **1.2 Neuen Token erstellen**

1. Klicke **"Generate new token"**
2. Wähle **"Generate new token (classic)"**
3. Gib einen Namen ein: `KOSGE-Netlify-GitGateway`

### **1.3 Token-Berechtigungen setzen**

**WICHTIG:** Setze nur die minimalen Berechtigungen:

```
✅ repo (Full control of private repositories)
   ├── repo:status
   ├── repo_deployment
   ├── public_repo
   ├── repo:invite
   └── security_events

✅ workflow (Update GitHub Action workflows)
```

**❌ NICHT aktivieren:**

- `admin:org` (zu viele Rechte)
- `delete_repo` (gefährlich)
- `gist` (nicht nötig)

### **1.4 Token generieren**

1. Scrolle nach unten
2. Klicke **"Generate token"**
3. **Kopiere den Token sofort** (wird nur einmal angezeigt!)
4. Speichere ihn sicher (z.B. in einem Passwort-Manager)

## **Schritt 2: Netlify Git Gateway konfigurieren**

### **2.1 Netlify Dashboard**

- Gehe zu deinem KOSGE-Site in Netlify
- **Site settings** → **Services** → **Git Gateway**

### **2.2 Git Gateway aktivieren**

1. Klicke **"Enable Git Gateway"**
2. Repository sollte automatisch erkannt werden: `https://github.com/CosmicSlothOracle/kosvite`

### **2.3 Token eintragen**

1. **GitHub API access token:** Füge deinen kopierten Token ein
2. **Roles (optional):** Leer lassen (Standard-Rollen verwenden)
3. Klicke **"Save"**

## **Schritt 3: GitHub Repository-Einstellungen prüfen**

### **3.1 Repository-Berechtigungen**

Gehe zu: https://github.com/CosmicSlothOracle/kosvite/settings

**Prüfe diese Einstellungen:**

#### **✅ Erlaubt sein sollte:**

- **Issues:** Enabled
- **Wiki:** Enabled (optional)
- **Discussions:** Enabled (optional)
- **Projects:** Enabled (optional)

#### **❌ Deaktivieren falls aktiv:**

- **Restrict pushes that create files larger than 100 MB:** Disabled
- **Allow force pushes:** Disabled (Sicherheit)
- **Allow deletions:** Disabled (Sicherheit)

### **3.2 Branch Protection Rules**

Gehe zu: **Settings** → **Branches**

**Für `main` Branch:**

```
✅ Require a pull request before merging
✅ Require status checks to pass before merging
✅ Require branches to be up to date before merging
✅ Include administrators
❌ Allow force pushes (DEAKTIVIERT)
❌ Allow deletions (DEAKTIVIERT)
```

### **3.3 Actions Permissions**

Gehe zu: **Settings** → **Actions** → **General**

```
✅ Allow all actions and reusable workflows
✅ Allow GitHub Actions to create and approve pull requests
✅ Allow GitHub Actions to create and approve pull requests
```

## **Schritt 4: Netlify Identity konfigurieren**

### **4.1 Identity aktivieren**

- **Site settings** → **Identity** → **Enable Identity**

### **4.2 Registration Settings**

```
Registration preferences: "Invite only"
Email confirmations: "Enabled"
Autoconfirm: "No"
```

### **4.3 Email Templates eintragen**

```
Invitation Template:
- Subject: "Sie sind eingeladen, dem KOSGE Kollektiv beizutreten"
- Path: "/admin/invite-template.html"

Confirmation Template:
- Subject: "Bestätigen Sie Ihre E-Mail-Adresse für KOSGE Berlin"
- Path: "/admin/confirmation-template.html"
```

## **Schritt 5: Testen**

### **5.1 Git Gateway Test**

1. Gehe zu deiner Site: `https://kosge-berlin.de/admin/`
2. Versuche dich anzumelden
3. Prüfe ob Git Gateway funktioniert

### **5.2 Email Template Test**

1. Lade einen Test-Admin ein
2. Prüfe ob die E-Mail-Templates korrekt angezeigt werden
3. Teste den Bestätigungs-Link

## **🔒 Sicherheits-Checkliste**

### **GitHub Token:**

- ✅ Minimal permissions gesetzt
- ✅ Token sicher gespeichert
- ✅ Token nicht in Code committed

### **Repository Settings:**

- ✅ Keine gefährlichen Berechtigungen
- ✅ Branch protection aktiviert
- ✅ Actions permissions korrekt

### **Netlify Identity:**

- ✅ Invite-only aktiviert
- ✅ Email confirmation aktiviert
- ✅ Custom templates eingetragen

## **🚨 Troubleshooting**

### **Problem: "Git Gateway connection failed"**

**Lösung:**

1. Token-Berechtigungen prüfen
2. Token neu generieren falls nötig
3. Repository-URL in Netlify prüfen

### **Problem: "Email templates not found"**

**Lösung:**

1. Templates ins Repository gepusht?
2. Pfade in Netlify korrekt eingetragen?
3. Deployment abgewartet?

### **Problem: "Cannot access repository"**

**Lösung:**

1. Repository ist public?
2. Token hat `repo` permissions?
3. GitHub-Account hat Repository-Zugriff?

## **📞 Support**

Bei Problemen:

- **Netlify Support:** https://support.netlify.com/
- **GitHub Support:** https://support.github.com/
- **KOSGE Team:** info@kosge-berlin.de
