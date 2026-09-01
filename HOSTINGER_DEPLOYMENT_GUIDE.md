# Step-by-Step Hostinger Deployment Guide for TOTAG OF COMPANIES LTD Platform (`totaggroup.com`)

This guide explains how to deploy your TOTAG OF COMPANIES LTD platform directly to your **Hostinger Account Server**.

---

## Deployment Packages Ready on Your PC:

Your deployment zip packages have been compiled and saved to your local folder:
1. **Static Web Hosting Package (Recommended for Hostinger hPanel Shared / Cloud Web Hosting)**:  
   `C:\Users\MichaelGwoah\Videos\totaggroup_hostinger_public_html.zip`
2. **Full Node.js Server Package (For Hostinger VPS / Node.js Runner)**:  
   `C:\Users\MichaelGwoah\Videos\totaggroup_hostinger_nodejs_app.zip`

---

## OPTION 1: Deploying via Hostinger hPanel File Manager (Standard Shared / Cloud Web Hosting)

### Step 1: Log in to Hostinger hPanel
1. Go to **[https://hpanel.hostinger.com](https://hpanel.hostinger.com)** and log in.
2. Navigate to **Websites** -> Select **totaggroup.com** -> Click **Manage**.

### Step 2: Open File Manager
1. Under the **Files** section, click **File Manager** (or access via FTP).
2. Double-click the **`public_html`** directory to open it.
3. *If there are old default files (e.g. `default.php`), delete or backup them.*

### Step 3: Upload and Extract Deployment Package
1. Click the **Upload** icon (top right) in File Manager.
2. Select the file:  
   `C:\Users\MichaelGwoah\Videos\totaggroup_hostinger_public_html.zip`
3. Once uploaded, right-click `totaggroup_hostinger_public_html.zip` and select **Extract**.
4. Choose **`public_html`** as the destination folder and click **Extract**.
5. Ensure the following files are now inside `public_html`:
   - `index.html`
   - `.htaccess`
   - `assets/` folder
   - `images/` folder
   - `videos/` folder
   - `favicon.ico`, `manifest.json`

### Step 4: Verify `.htaccess` SPA Routing
The package includes an `.htaccess` file configured with Apache/LiteSpeed rewrite rules. This enables Single Page Application (SPA) client-side routing so pages like `https://totaggroup.com/farm`, `/it-services`, `/catering`, `/saas`, and `/payment-processing` load cleanly without 404 errors.

---

## OPTION 2: Deploying via Hostinger Node.js Application / VPS

If you run the full Express backend Node.js server on Hostinger:
1. Upload `C:\Users\MichaelGwoah\Videos\totaggroup_hostinger_nodejs_app.zip` to your app root directory.
2. Extract the zip archive.
3. In Hostinger Node.js Application panel / terminal, set:
   - **Entry Point**: `dist/index.js`
   - **Node Version**: `18.x` or `20.x`
   - **Run Command**: `npm start`
4. Start / restart the Node.js application.

---

## Summary of Storage & Backup Architecture:
- **Primary Live Hosting**: Hostinger Server (`public_html` / Hostinger VPS)
- **Source Code Backup**: GitHub Repository (`https://github.com/totagits/TOTAG_GROUP_PLAFORM.git`)
- **Local Development Copy**: `c:\Users\MichaelGwoah\Videos\TOTAGGROUP`
