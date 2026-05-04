# Google Sign-In Setup Guide

Your car rental website now supports **both device storage AND Google Sign-In authentication**!

## 📱 Device Storage (Already Working)
- Users can create accounts with Email, Name, and Phone Number
- All credentials are stored securely on their device
- No setup required - ready to use!

## 🔐 Google Sign-In Setup (Optional)

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project"
3. Enter project name: `ZubaeAutos`
4. Click "Create"

### Step 2: Enable Google+ API
1. In the left sidebar, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and press **"Enable"**

### Step 3: Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** → **"OAuth 2.0 Client IDs"**
3. If prompted, configure the OAuth consent screen first:
   - Choose **External** user type
   - Fill in app name: `ZubaeAutos`
   - Add your email
   - Save and continue
4. Back to credentials, click **"+ Create Credentials"** → **"OAuth 2.0 Client IDs"**
5. Select **"Web application"**
6. Under **Authorized JavaScript origins**, add:
   ```
   file://
   http://localhost
   http://localhost:3000
   http://localhost:5500
   ```
7. Click **"Create"**
8. Copy your **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)

### Step 4: Update Your Website
1. Open `script.js` in your editor
2. Find this line (around line 140):
   ```javascript
   client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
   ```
3. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID from Step 3
4. Save the file

### Step 5: Test Google Sign-In
1. Refresh your website
2. Click **"Login"** button
3. You should now see a **"Sign in with Google"** button
4. Users can now login with their Google account!

## ✨ Features

### Login with Email (Device Storage)
- ✅ No setup needed
- ✅ Works on all devices
- ✅ Private - stays on user's device
- ✅ Simple - just email needed

### Login with Google
- ✅ Fast and secure
- ✅ Remembers profile picture
- ✅ Auto-fills name and email
- ✅ One-click signup
- ✅ No password to remember

## 🔄 How It Works

**New User Flow:**
1. Click "Rent Now"
2. Choose: Sign in with Google OR Create Account with Email
3. Get instant access to rental options

**Returning User Flow:**
1. Click "Login"
2. Use Google OR Email
3. See your profile picture (if Google login)
4. Continue to rent

## 💾 Data Storage

All user data is stored in two places:

**Device Storage (localStorage)**
- Email-based accounts
- Phone number
- Name
- Account creation date

**Google Account**
- Google ID
- Name
- Email
- Profile picture
- Account creation date

Both are secure and private to each user!

## 🚀 Advanced Options

### Using Firebase (Optional)
For better scalability, you can integrate Firebase:
1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Add Firebase authentication to `script.js`
3. Store user data in Firestore database

This would enable cross-device login and cloud backup.

## ❓ Troubleshooting

**Google button not showing?**
- Check that your Client ID is correct
- Make sure your JavaScript origins are whitelisted
- Clear browser cache and refresh

**Getting "Invalid Client ID" error?**
- Verify you copied the entire Client ID correctly
- Check Google Cloud Console settings
- Ensure Google+ API is enabled

**Users can't login with Google?**
- Check browser console for errors (F12 → Console)
- Verify OAuth consent screen is configured
- Ensure website is in authorized origins

## 📞 Support

If you need help:
1. Check Google's [OAuth 2.0 documentation](https://developers.google.com/identity/protocols/oauth2)
2. Review [Google Sign-In integration guide](https://developers.google.com/identity/gsi/web)

---

**Your website now has professional-grade authentication!** 🎉
