# 🚀 KOSGE Berlin - Complete Deployment Guide

## Overview

This guide provides step-by-step instructions to deploy the KOSGE Berlin website on Netlify with full functionality including authentication, CMS, and serverless functions.

## Prerequisites

- GitHub account with repository: `https://github.com/CosmicSlothOracle/kosvite`
- Netlify account
- Domain: `kosge-berlin.de` (or your custom domain)
- Python 3.11+ for credential generation

---

## 🔧 STEP 1: Repository Setup

### 1.1 Verify Repository Structure

Ensure your repository has this structure:

```
kosge_berlin_static_html/
├── docs/                          # ✅ Netlify publish directory
│   ├── admin/                     # CMS configuration
│   ├── css/                       # Stylesheets
│   ├── js/                        # JavaScript files
│   ├── img/                       # Images
│   ├── lang/                      # Multi-language pages
│   ├── public/                    # Data and uploads
│   ├── CNAME                      # Domain configuration
│   ├── index.html                 # Main page
│   └── teilnahme.html             # Participation form
├── netlify/functions/             # ✅ Serverless functions
│   ├── banners.js                 # Banner management
│   ├── participants.js            # Participant handling
│   ├── common.js                  # Shared utilities
│   └── package.json               # Function dependencies
├── scripts/                       # Build and utility scripts
├── netlify.toml                   # ✅ Netlify configuration
└── participants.json              # Participant data
```

### 1.2 Verify netlify.toml Configuration

Ensure your `netlify.toml` contains:

```toml
[build]
  command = "npm --prefix netlify/functions install && python scripts/generate_chatbot_key.py && python scripts/inject_chatbot_script.py"
  publish = "docs"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/login"
  to = "/.netlify/functions/login"
  status = 200

[[redirects]]
  from = "/api/participants"
  to = "/.netlify/functions/participants"
  status = 200

[[redirects]]
  from = "/api/banners/*"
  to = "/.netlify/functions/banners/:splat"
  status = 200

[[redirects]]
  from = "/api/banners"
  to = "/.netlify/functions/banners"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🌐 STEP 2: Netlify Site Setup

### 2.1 Create New Site from Git

1. **Login to Netlify**: Go to https://app.netlify.com
2. **New site from Git**: Click "New site from Git"
3. **Connect to GitHub**: Authorize Netlify to access your GitHub
4. **Select repository**: Choose `CosmicSlothOracle/kosvite`
5. **Configure build settings**:
   - **Branch to deploy**: `main`
   - **Build command**: `npm --prefix netlify/functions install && python scripts/generate_chatbot_key.py && python scripts/inject_chatbot_script.py`
   - **Publish directory**: `docs`
6. **Deploy site**: Click "Deploy site"

### 2.2 Configure Custom Domain

1. **Domain settings**: Site Dashboard → Domain settings
2. **Add custom domain**: Click "Add custom domain"
3. **Enter domain**: `kosge-berlin.de`
4. **DNS configuration**: Update your domain's DNS to point to Netlify:

   ```
   Type: CNAME
   Name: www
   Value: [your-site-name].netlify.app

   Type: A
   Name: @
   Value: 75.2.60.5
   ```

5. **SSL certificate**: Netlify will automatically provision SSL

---

## 🔐 STEP 3: Generate Secure Credentials

### 3.1 Install Dependencies

```bash
# Navigate to your project directory
cd kosge_berlin_static_html

# Install Python dependencies
pip install bcrypt
```

### 3.2 Generate Credentials

```bash
# Run the credential generator
python scripts/generate_secure_credentials.py
```

**Example output:**

```
=== KOSGE Secure Credentials Generator ===

Enter admin password: [enter your secure password]

=== Copy these values to Netlify Environment Variables ===

ADMIN_USERNAME=administroni
ADMIN_PASSWORD_HASH=$2b$12$XYZ123...
GROQ_API_KEY=[Get new key from https://console.groq.com/keys]
```

### 3.3 Get GROQ API Key

1. Visit: https://console.groq.com/keys
2. Create account/login
3. Generate new API key
4. Copy the key (starts with `gsk_...`)

---

## ⚙️ STEP 4: Environment Variables Setup

### 4.1 Configure Netlify Environment Variables

1. **Navigate**: Site Dashboard → Site settings → Environment variables
2. **Add variables** one by one:

| Variable Name         | Example Value   | Description                |
| --------------------- | --------------- | -------------------------- |
| `ADMIN_USERNAME`      | `administroni`  | Admin login username       |
| `ADMIN_PASSWORD_HASH` | `$2b$12$XYZ...` | Bcrypt hash from generator |
| `GROQ_API_KEY`        | `gsk_xyz123...` | Groq AI API key            |
| `NODE_VERSION`        | `18`            | Node.js version            |
| `PYTHON_VERSION`      | `3.11`          | Python version             |

### 4.2 Security Notes

- ⚠️ **NEVER** commit these values to Git
- 🔒 Store them only in Netlify environment variables
- 🔄 Rotate GROQ_API_KEY regularly
- 📝 Keep a secure backup of ADMIN_PASSWORD_HASH

---

## 🆔 STEP 5: Netlify Identity Setup

### 5.1 Enable Identity

1. **Navigate**: Site Dashboard → Site settings → Identity
2. **Enable Identity**: Click "Enable Identity"
3. **Settings configuration**:
   - **Registration preferences**: "Invite only" (recommended)
   - **Email confirmations**: "Enabled"
   - **Allow external providers**: Leave unchecked (use email only)

### 5.2 Configure Email Templates

1. **Navigate**: Identity settings → Emails
2. **Configure templates**:

**Invitation Template:**

```
Subject: Sie sind eingeladen, dem KOSGE CMS beizutreten
Template URL: /admin/invite-template.html
```

**Confirmation Template:**

```
Subject: Bestätigen Sie Ihre E-Mail für KOSGE Berlin
Template URL: /admin/confirmation-template.html
```

### 5.3 Invite First Admin User

1. **Navigate**: Site Dashboard → Identity → Invite users
2. **Enter email**: Your admin email address
3. **Send invitation**: Click "Send"
4. **Check email**: Complete registration via email link

---

## 🔗 STEP 6: GitHub Gateway Setup

### 6.1 Create GitHub Personal Access Token

1. **Navigate**: GitHub → Settings → Developer settings → Personal access tokens
2. **Generate new token**: Choose "Generate new token (classic)"
3. **Token name**: `KOSGE-Netlify-GitGateway`
4. **Scopes** (minimal required):

   ```
   ✅ repo (Full control of private repositories)
      ├── repo:status
      ├── repo_deployment
      ├── public_repo
      ├── repo:invite
      └── security_events

   ✅ workflow (Update GitHub Action workflows)
   ```

5. **Generate token**: Copy immediately (shown only once!)

### 6.2 Configure Git Gateway in Netlify

1. **Navigate**: Site Dashboard → Site settings → Services → Git Gateway
2. **Enable Git Gateway**: Click "Enable Git Gateway"
3. **Repository**: Should auto-detect `https://github.com/CosmicSlothOracle/kosvite`
4. **GitHub access token**: Paste your personal access token
5. **Save**: Click "Save"

### 6.3 Test Git Gateway

1. **Navigate**: `https://your-site.netlify.app/admin/`
2. **Login**: Use your Netlify Identity account
3. **Test CMS**: Try editing content
4. **Verify**: Check that changes appear in GitHub repository

---

## 🧪 STEP 7: Testing & Verification

### 7.1 Site Functionality Test

```bash
# Test main site
curl https://kosge-berlin.de

# Test API endpoints (should return authentication required)
curl https://kosge-berlin.de/api/participants
curl https://kosge-berlin.de/api/banners
```

### 7.2 CMS Access Test

1. **Visit**: `https://kosge-berlin.de/admin/`
2. **Login**: Use Netlify Identity credentials
3. **Edit content**: Make a test change
4. **Verify**: Check changes deploy automatically

### 7.3 Forms Test

1. **Visit**: `https://kosge-berlin.de/teilnahme.html`
2. **Submit form**: Fill out and submit participation form
3. **Check**: Verify submission appears in admin dashboard

### 7.4 Function Logs

1. **Navigate**: Netlify Dashboard → Functions
2. **View logs**: Check for any errors
3. **Monitor**: Watch for successful API calls

---

## 🚨 STEP 8: Security & Monitoring

### 8.1 Security Checklist

- [ ] Environment variables set in Netlify (not in code)
- [ ] Netlify Identity set to "invite only"
- [ ] GitHub token has minimal required permissions
- [ ] GROQ API key is fresh and secure
- [ ] Admin authentication uses bcrypt password hashing
- [ ] Admin password is strong (8+ characters)
- [ ] SSL certificate is active
- [ ] No secrets committed to Git

### 8.2 Monitoring Setup

1. **Function monitoring**: Netlify Dashboard → Functions → Logs
2. **Site analytics**: Consider enabling Netlify Analytics
3. **Error tracking**: Monitor function error rates
4. **Performance**: Check Core Web Vitals in Netlify dashboard

### 8.3 Backup Strategy

1. **Content backup**: CMS content is auto-backed up in Git
2. **Environment variables**: Keep secure copy of all variables
3. **Function data**: Consider periodic exports from Netlify Blobs
4. **Participant data**: Regular exports via admin dashboard

---

## 🔄 STEP 9: Maintenance & Updates

### 9.1 Regular Maintenance

- **Monthly**: Review function logs for errors
- **Quarterly**: Rotate GROQ_API_KEY
- **Annually**: Review and update admin access

### 9.2 Content Updates

1. **Via CMS**: `https://kosge-berlin.de/admin/` (recommended)
2. **Via Git**: Direct commits trigger auto-deployment
3. **Monitor**: Check Netlify deployment logs

### 9.3 Code Updates

1. **Push to main**: Changes trigger automatic deployment
2. **Monitor builds**: Netlify Dashboard → Deploys
3. **Rollback**: Use Netlify's instant rollback if needed

---

## ❗ Troubleshooting

### Common Issues

#### Build Fails

```bash
# Check Python dependencies
pip install -r scripts/requirements-dev.txt

# Check Node.js dependencies
npm --prefix netlify/functions install
```

#### CMS Login Issues

1. Verify Netlify Identity is enabled
2. Check Git Gateway connection
3. Ensure user is invited and confirmed
4. Clear browser cache

#### Function Errors

1. Check environment variables are set
2. Review function logs in Netlify
3. Test API endpoints manually
4. Verify build completed successfully

#### Domain Issues

1. Check DNS configuration
2. Verify CNAME file contains correct domain
3. Ensure SSL certificate is provisioned
4. Wait up to 24h for DNS propagation

### Support Resources

- **Netlify Docs**: https://docs.netlify.com/
- **Netlify Community**: https://community.netlify.com/
- **KOSGE Issues**: https://github.com/CosmicSlothOracle/kosvite/issues

---

## 🎯 Summary

After completing this guide, you will have:

✅ **Fully deployed KOSGE website** on Netlify
✅ **Working CMS** with GitHub integration
✅ **Secure authentication** system
✅ **Functional API endpoints** for forms and banners
✅ **SSL-secured custom domain**
✅ **Monitoring and backup** systems

**Your site should be live at**: `https://kosge-berlin.de`
**CMS access at**: `https://kosge-berlin.de/admin/`

**🎉 Deployment Complete!** Your KOSGE Berlin website is now live and fully functional.
