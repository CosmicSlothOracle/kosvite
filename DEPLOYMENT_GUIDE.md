# KOSGE Netlify Deployment Guide

## Overview

This guide covers the complete setup of the KOSGE website on Netlify with Identity, CMS, and serverless functions.

## Architecture

- **Frontend**: Static HTML/CSS/JS in `/docs`
- **Backend**: Netlify Functions (`/netlify/functions`)
- **Authentication**: Netlify Identity (default configuration)
- **CMS**: Netlify CMS with Git Gateway
- **Database**: Netlify Blobs for data storage

## 1. Initial Netlify Setup

### Deploy Site

1. Connect your GitHub repository to Netlify: `https://github.com/CosmicSlothOracle/kosvite`
2. Set build settings:
   - **Build command**: `npm --prefix netlify/functions install && python scripts/generate_chatbot_key.py && python scripts/inject_chatbot_script.py`
   - **Publish directory**: `docs`

### Domain Configuration

- Custom domain: `kosge-berlin.de` (configured via `docs/CNAME`)
- SSL: Auto-enabled by Netlify

## 2. Netlify Identity Configuration

### ✅ Recommended: Use Default Configuration

**Why Default is Better:**

- Simpler setup and maintenance
- Immediate functionality
- No additional GitHub OAuth app needed
- Users see "Netlify Identity" (acceptable for CMS)

### Setup Steps:

1. **Enable Identity**:

   - Site Dashboard → Site settings → Identity
   - Click "Enable Identity"

2. **Configure Registration**:

   - Registration preferences: **"Invite only"** (recommended)
   - Email confirmations: Enabled

3. **Enable Git Gateway**:
   - Services → Git Gateway
   - Click "Enable Git Gateway"
   - Connect to GitHub repository: `https://github.com/CosmicSlothOracle/kosvite`

## 3. Environment Variables

### Critical Security Update Required

⚠️ **The GROQ API key in your message is exposed. Regenerate immediately!**

### Generate New Credentials

Run the credential generator:

```bash
# Install dependencies
pip install -r scripts/requirements-dev.txt

# Generate new credentials
python scripts/generate_secure_credentials.py
```

### Set in Netlify Dashboard

Navigate to: **Site Dashboard → Site settings → Environment variables**

Add these variables:

```bash
# Admin Authentication
ADMIN_USERNAME=administroni
ADMIN_PASSWORD_HASH=[Generated hash from script]
JWT_SECRET=[Generated secret from script]

# API Integration
GROQ_API_KEY=[New key from https://console.groq.com/keys]

# Optional build settings
NODE_VERSION=18
PYTHON_VERSION=3.11
```

## 4. Content Management Setup

### CMS Access

- Admin interface: `https://kosge-berlin.de/admin/`
- First admin user must be invited through Netlify Identity dashboard

### Adding Admin Users

1. Go to Netlify Dashboard → Identity → Invite users
2. Send invite to admin email addresses
3. Users complete registration via email link

### CMS Configuration

- Configuration file: `docs/admin/config.yml`
- Content storage: `docs/public/data/homepage.yml`
- Media uploads: `docs/public/uploads/`

## 5. Function Endpoints

Your site provides these API endpoints:

| Endpoint            | Method            | Purpose              | Auth Required       |
| ------------------- | ----------------- | -------------------- | ------------------- |
| `/api/login`        | POST              | Admin authentication | No                  |
| `/api/banners`      | GET, POST, DELETE | Banner management    | Yes (upload/delete) |
| `/api/participants` | GET, POST         | Participation form   | GET: Yes, POST: No  |

## 6. Testing Deployment

### 1. Basic Site Function

- Visit: `https://kosge-berlin.de`
- Test language switching
- Verify responsive design

### 2. CMS Access

- Visit: `https://kosge-berlin.de/admin/`
- Log in with Netlify Identity
- Test content editing

### 3. Forms and API

- Test participation form: `https://kosge-berlin.de/teilnahme.html`
- Verify banner functionality
- Check admin dashboard access

## 7. Monitoring and Maintenance

### Function Logs

- Netlify Dashboard → Functions → View logs
- Monitor for errors or performance issues

### Analytics

- Consider adding Netlify Analytics
- Monitor form submissions and user engagement

### Updates

- Content updates via CMS trigger automatic deployments
- Code changes via GitHub also trigger deployments

## 8. Security Best Practices

### Environment Variables

- Never commit secrets to git
- Use different secrets for different environments
- Regularly rotate API keys and tokens

### Access Control

- Keep CMS access to "invite only"
- Regularly review user access
- Monitor admin activity logs

### HTTPS

- Always enforce HTTPS (automatic on Netlify)
- Use secure headers (configured in `netlify.toml`)

## 9. Backup and Recovery

### Content Backup

- CMS content is stored in Git (automatic backup)
- Export participant data regularly via admin dashboard

### Function Data

- Netlify Blobs data is automatically backed up
- Consider periodic exports for critical data

## Troubleshooting

### Common Issues

1. **CMS Login Failed**

   - Check Netlify Identity is enabled
   - Verify Git Gateway connection
   - Ensure user is invited and confirmed

2. **Function Errors**

   - Check environment variables are set
   - Review function logs in Netlify Dashboard
   - Verify build completed successfully

3. **Form Submissions Failing**
   - Check API endpoints are working
   - Verify CORS configuration
   - Test with browser developer tools

### Support Resources

- Netlify Documentation: https://docs.netlify.com/
- Netlify Community: https://community.netlify.com/
- GitHub Issues: Create issues in your repository: https://github.com/CosmicSlothOracle/kosvite/issues

## Next Steps

After deployment:

1. **Invite Admin Users**: Add team members via Netlify Identity
2. **Test All Features**: Ensure forms, CMS, and API work correctly
3. **Configure Monitoring**: Set up alerts for downtime or errors
4. **Documentation**: Document any custom configurations for team

## Security Checklist

- [ ] Generated new GROQ API key
- [ ] Generated new JWT secret
- [ ] Generated new admin password hash
- [ ] Set all environment variables in Netlify
- [ ] Configured Netlify Identity to "invite only"
- [ ] Tested CMS access with admin account
- [ ] Verified all forms work correctly
- [ ] Checked that no secrets are committed to git
