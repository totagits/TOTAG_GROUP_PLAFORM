# TOTAG Group Email Setup - Step by Step Guide

## Quick Setup for totaggroup.com Professional Emails

### Step 1: Choose Your Email Provider

**Recommended: Zoho Mail (Free for 5 users)**
- Cost: Free for up to 5 users
- Perfect for small business
- Easy setup process

### Step 2: Sign Up for Zoho Mail

1. Go to: https://www.zoho.com/mail/
2. Click "Get Started Free"
3. Choose "Add your own domain"
4. Enter: `totaggroup.com`
5. Verify domain ownership

### Step 3: Get Your DNS Records from Zoho

After domain verification, Zoho will provide these exact records:

**MX Records:**
```
Type: MX
Name: @
Value: mx.zoho.com
Priority: 10
TTL: 3600

Type: MX  
Name: @
Value: mx2.zoho.com
Priority: 20
TTL: 3600

Type: MX
Name: @  
Value: mx3.zoho.com
Priority: 50
TTL: 3600
```

**SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 include:zoho.com ~all
TTL: 3600
```

**DKIM Record (Zoho will provide):**
```
Type: TXT
Name: zmail._domainkey
Value: [Zoho will give you this long string]
TTL: 3600
```

### Step 4: Add Records in Name.com

1. Log into your Name.com account
2. Go to "Domain Manager"
3. Click "totaggroup.com"
4. Select "DNS Records"
5. Add each record above exactly as shown

### Step 5: Create Your Email Accounts

After DNS records are active (24-48 hours), create these accounts in Zoho:

**Essential Business Emails:**
- `admin@totaggroup.com` - General administration
- `info@totaggroup.com` - Customer inquiries  
- `sales@totaggroup.com` - Sales communications
- `support@totaggroup.com` - Customer support
- `accounts@totaggroup.com` - Billing/accounting

**Department-Specific Emails:**
- `it@totaggroup.com` - IT Services
- `catering@totaggroup.com` - Catering services
- `merchandise@totaggroup.com` - General merchandise
- `construction@totaggroup.com` - Construction services
- `agriculture@totaggroup.com` - Agricultural services

### Step 6: Update Your Platform

Once emails are working, update these files in your TOTAG platform:

**Environment Variables:**
```bash
COMPANY_EMAIL=admin@totaggroup.com
SUPPORT_EMAIL=info@totaggroup.com
SALES_EMAIL=sales@totaggroup.com
IT_EMAIL=it@totaggroup.com
CATERING_EMAIL=catering@totaggroup.com
```

**Contact Form Updates:**
Update contact forms to send emails to your professional addresses.

## Alternative: Google Workspace Setup

If you prefer Google Workspace ($6/month per user):

**MX Records for Google:**
```
Type: MX, Name: @, Value: smtp.google.com, Priority: 1
Type: MX, Name: @, Value: smtp2.google.com, Priority: 5  
Type: MX, Name: @, Value: smtp3.google.com, Priority: 10
Type: MX, Name: @, Value: smtp4.google.com, Priority: 15
Type: MX, Name: @, Value: smtp-relay.gmail.com, Priority: 20
```

**SPF Record for Google:**
```
Type: TXT, Name: @, Value: v=spf1 include:_spf.google.com ~all
```

## Verification Process

### Test Your Email Setup:
1. Wait 24-48 hours for DNS propagation
2. Send test email to `info@totaggroup.com`
3. Check if email arrives in your Zoho/Google account
4. Send email FROM your professional address
5. Verify emails are not going to spam

### DNS Propagation Check:
Use these tools to verify DNS records are active:
- https://mxtoolbox.com/mx/totaggroup.com
- https://dnschecker.org/
- https://www.whatsmydns.net/

## Professional Email Best Practices

### Email Signatures:
```
John Doe
General Manager
TOTAG Group of Companies Ltd
Email: admin@totaggroup.com
Website: https://totaggroup.com
Phone: [Your Phone Number]
```

### Email Organization:
- Use `info@totaggroup.com` for general inquiries
- Forward department emails to appropriate staff
- Set up auto-responses for business hours
- Enable email forwarding to personal accounts if needed

## Security Settings

### Enable These Security Features:
- Two-factor authentication (2FA)
- Strong passwords for all accounts
- Regular password updates
- Email encryption when possible
- Backup important emails

## Integration with Your Platform

### Update Contact Forms:
Modify your platform's contact forms to use:
- General inquiries → `info@totaggroup.com`
- IT Services → `it@totaggroup.com`
- Catering requests → `catering@totaggroup.com`
- Sales inquiries → `sales@totaggroup.com`

### Email Notifications:
Configure your platform to send notifications from professional addresses:
- Order confirmations from `sales@totaggroup.com`
- Support tickets from `support@totaggroup.com`
- System alerts from `admin@totaggroup.com`

## Troubleshooting

### Common Issues:
- **DNS propagation takes 24-48 hours** - be patient
- **Check spam folders** when testing
- **Verify exact record values** - one typo breaks everything
- **Contact provider support** if setup fails

### Support Contacts:
- **Zoho Support**: https://help.zoho.com/portal/en/home
- **Name.com Support**: https://www.name.com/support
- **Google Workspace Support**: https://support.google.com/a/

## Cost Summary

**Zoho Mail Free Plan:**
- Up to 5 users: FREE
- 5GB storage per user
- Web and mobile access

**Zoho Mail Paid Plans:**
- Standard: $1/user/month (10GB)
- Professional: $4/user/month (50GB)

**Google Workspace:**
- Business Starter: $6/user/month (30GB)
- Business Standard: $12/user/month (2TB)

## Next Steps

1. **Choose Zoho Mail or Google Workspace**
2. **Sign up and add totaggroup.com domain**
3. **Get exact DNS record values**
4. **Add records in Name.com**
5. **Wait for DNS propagation (24-48 hours)**
6. **Create your professional email accounts**
7. **Test email sending and receiving**
8. **Update your platform with new email addresses**

Your professional email system will be ready within 2-3 days after DNS setup!