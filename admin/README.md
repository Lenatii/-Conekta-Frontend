# CONEKTA Admin Dashboard

This is the admin control panel for CONEKTA platform.

## Access

- **URL**: https://conekta.co.ke/admin/login.html
- **Default Login**:
  - Username: `admin`
  - Password: `conekta2024`

## Pages

- `login.html` - Admin login
- `dashboard.html` - Main dashboard
- `contacts.html` - User management
- `mama-dennis.html` - AI chatbot control
- `escrow.html` - Escrow system
- `emergency.html` - Emergency contacts
- `heartbeat.html` - System monitoring
- `analytics.html` - Platform analytics
- `settings.html` - Configuration

## API Configuration

Backend API: `https://conekta-complete-system.onrender.com`

Configured in: `js/admin.js` (line 7)

## Security

⚠️ **IMPORTANT**: Change default password after first login!

The admin dashboard uses JWT authentication. Tokens are stored in localStorage.

## Deployment

This folder is deployed as part of the main Vercel project at `/admin/`.
