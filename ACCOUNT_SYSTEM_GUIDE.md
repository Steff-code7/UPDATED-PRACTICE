# YAS Milktea House - Customer Account System

## Overview
The customer account system is now fully functional with dynamic user profiles, address management, order history, and profile customization.

## Files Created/Modified

### Backend - PHP API Files

1. **api/account_setup.php**
   - Database schema initialization
   - Adds new columns to users table: full_name, contact_number, profile_picture, updated_at
   - Creates addresses table for managing multiple delivery addresses

2. **api/get_account_data.php**
   - Fetches complete user account information
   - Returns user profile, primary address, all addresses, and order statistics
   - Calculates member since date

3. **api/update_account.php**
   - Updates personal profile details (name, contact, DOB)
   - Updates email address
   - Changes password with verification
   - Updates username

4. **api/update_profile_picture.php**
   - Handles profile picture uploads (JPG, PNG, GIF, WebP)
   - Maximum file size: 5MB
   - Stores image in images/ directory
   - Updates profile picture across all displays (navbar, overview, etc.)

5. **api/manage_addresses.php**
   - Get all addresses for a user
   - Add new address
   - Update existing address
   - Delete address
   - Set primary address (only one primary at a time)

6. **api/get_user_orders.php**
   - Fetches all user orders with items
   - Includes order date, items, total, and status
   - Properly formats order IDs and dates

### Frontend - HTML/PHP/JavaScript

1. **customerAccount.php**
   - Main account page (replaces static HTML version)
   - Session-authenticated (redirects if not logged in)
   - Dynamic content loaded from database
   - Modular interface with tab switching
   - Modules: Overview, My Profile, Personal Details, Order History, Addresses, Payment Methods

2. **account-module.js**
   - Module switching/navigation
   - Form submissions and validation
   - Profile picture upload
   - Username and password changes
   - Address management (CRUD operations)
   - Order history loading
   - Contact support button (Facebook or phone)
   - All API communication

3. **style.css** (Updated)
   - Added form styling (inputs, selects, textareas)
   - Button styles (primary, outline, danger, small variants)
   - Order status indicators (pending, preparing, completed, cancelled, delivered)
   - Animation for module transitions
   - Responsive design maintained

## Features Implemented

### Overview Module
- Display username with greeting emoji
- Show member since date
- Total orders count
- Total amount spent
- Quick access buttons to other modules

### My Profile Module
- **Profile Picture**
  - Upload new profile picture
  - Updates automatically in navbar and overview
  - Supported formats: JPG, PNG, GIF, WebP
  - Max file size: 5MB

- **Username**
  - Edit and change username
  - Validation for uniqueness
  - Requires re-login after change

- **Password**
  - Change password with current password verification
  - Confirmation password field

### Personal Details Module
- **Full Name** - Editable text field
- **Email Address** - Can update email (required for login after change)
- **Contact Number** - Editable phone number
- **Date of Birth** - Date picker
- All fields update overview section

### Order History Module
- Display all user orders in a table
- Shows: Order ID, Date, Items, Total, Status
- Status color coding (pending, preparing, completed, delivered)
- Automatically populated from database

### Addresses Module
- **View All Addresses**
  - Shows address type (Home, Office, Other)
  - Marks primary address
  - Displays address line, landmark, delivery instructions

- **Add Address**
  - Modal form for entering address details
  - Address type selector (Home, Office, Other)
  - Address line, landmark, delivery instructions
  - Option to set as primary

- **Edit Address**
  - Click to edit existing address
  - Modal pre-fills with current address data
  - Can update all fields
  - Delete button appears when editing

- **Set Primary Address**
  - Easy button to set address as primary
  - Only one primary address allowed
  - Primary address shows in Overview

### Payment Methods Module
- Currently displays "Work in Progress" message
- Ready for future payment method management

### Contact Support
- Click button shows confirmation dialog
- Option to call (Tel link) or visit Facebook
- Links to business phone: +639073954150
- Links to Facebook: https://www.facebook.com/yas.elizalde.7

## Database Changes

### Users Table (Extended)
```sql
ALTER TABLE users ADD COLUMN (
    full_name VARCHAR(150),
    contact_number VARCHAR(20),
    profile_picture VARCHAR(255) DEFAULT 'images/default-avatar.png',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

### Addresses Table (New)
```sql
CREATE TABLE addresses (
    address_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    address_type ENUM('home', 'office', 'other') DEFAULT 'home',
    address_line VARCHAR(255) NOT NULL,
    landmark VARCHAR(255),
    delivery_instructions TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
)
```

## How It Works

### User Navigation
1. User logs in with username/email and password
2. On successful login, redirected to customerHomePage.html
3. User clicks on profile icon or navigates to customerAccount.php
4. Account page loads with session authentication
5. All data is fetched from database and displayed dynamically

### Module Switching
- Left sidebar has navigation links for each module
- Clicking a link shows/hides sections without page reload
- All modules communicate with backend APIs via AJAX
- Form submissions validated on both client and server

### Data Updates
- All changes are sent via AJAX POST requests to API endpoints
- Server validates data and updates database
- Success/error messages shown to user
- Updates reflect immediately in UI

### Security
- Session-based authentication required
- All API endpoints check for logged-in user
- User can only access/modify their own data
- Password changes require current password verification
- Email changes require re-login
- Username changes require re-login

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/get_account_data.php` | GET | Fetch complete user account |
| `/api/update_account.php` | POST | Update profile, email, password, username |
| `/api/update_profile_picture.php` | POST | Upload profile picture |
| `/api/manage_addresses.php` | POST | Manage addresses (CRUD) |
| `/api/get_user_orders.php` | GET | Fetch user's order history |

## Error Handling
- All API responses return JSON format
- HTTP status codes used appropriately (400, 401, 403, 404, 500)
- Client-side error messages show user-friendly messages
- Database errors logged but not exposed to users

## Testing Instructions

1. Access the account page: `http://localhost/YasMilkteaHouse_Clone/UPDATED-PRACTICE/customerAccount.php`
2. Test each module:
   - **Overview**: Verify stats display correctly
   - **My Profile**: Upload picture, change username/password
   - **Personal Details**: Edit and save details
   - **Order History**: Verify orders display
   - **Addresses**: Add, edit, delete addresses
   - **Payment Methods**: See work in progress message
3. Test profile picture updates reflected in navbar
4. Test contact support button

## Future Enhancements
- Implement payment methods module
- Add order tracking/status updates
- Implement loyalty points/rewards display
- Add order cancellation/return functionality
- Implement email notifications for order updates
