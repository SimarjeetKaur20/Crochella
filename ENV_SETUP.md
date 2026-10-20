# Environment Variables for Crochella

Copy this file as `.env` in your project root and fill in the values.

```
# Supabase Configuration
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Razorpay Configuration (optional - for online payments)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here

# Admin Password (simple password auth when Supabase not configured)
VITE_ADMIN_PASSWORD=crochella2024
```

## How to get these values:

### Supabase
1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to Settings → API
4. Copy the "Project URL" → VITE_SUPABASE_URL
5. Copy the "anon public" key → VITE_SUPABASE_ANON_KEY

### Razorpay
1. Go to https://razorpay.com and create an account
2. Go to Settings → API Keys
3. Generate a key pair
4. Use the test key during development (starts with rzp_test_)
5. Switch to live key when going live

### Admin Password
Set a strong password for the admin dashboard. Default is 'crochella2024'.
