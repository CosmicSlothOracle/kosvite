# Netlify CMS Setup Guide

## Overview

This project is configured with Netlify CMS for authenticated content editing with Git Gateway.

## Setup Steps

### 1. Netlify Dashboard Configuration

1. Go to your Netlify dashboard
2. Navigate to **Site settings** > **Identity**
3. Click **Enable Identity**
4. Under **Registration preferences**, choose "Invite only" or "Open" as needed
5. Go to **Services** > **Git Gateway**
6. Connect your GitHub repository

### 2. Admin Access

- Access the CMS at: `https://your-site.netlify.app/admin/`
- Users can be invited through the Netlify Identity dashboard

### 3. Content Management

- The CMS is configured to edit `docs/public/data/homepage.yml`
- Changes trigger automatic commits via Git Gateway
- Netlify automatically rebuilds and deploys on changes

### 4. File Structure

```
docs/
├── admin/
│   ├── index.html          # Netlify CMS admin panel
│   └── config.yml          # CMS configuration
└── public/
    ├── data/
    │   └── homepage.yml    # Editable content
    └── uploads/            # Media uploads
```

### 5. Client-side Loading

The main page loads YAML configuration client-side using js-yaml:

- Fetches `/data/homepage.yml`
- Updates logo images and title dynamically
- Falls back gracefully if config is unavailable

## Workflow

1. Edit content in Netlify CMS
2. Changes are committed to Git via Git Gateway
3. Netlify rebuilds and deploys automatically
4. Updated content appears on the live site

## Customization

- Modify `docs/admin/config.yml` to add more content types
- Update the JavaScript in `docs/index.html` to handle new fields
- Add more YAML files in `docs/public/data/` for different content sections
