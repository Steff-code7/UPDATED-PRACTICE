# BO-BYTE: ORDERING AND MANAGEMENT SYSTEM FOR YAS MILKTEA HOUSE
## Complete System Documentation
**Team Name:** Lovebugs

---

# MODULE 1: PROJECT SCOPE MANAGEMENT PLAN

## A. Project Description and Objectives

**BO-BYTE** (Ordering and Management System for Yas Milktea House) is a comprehensive web-based application designed to streamline operations for a milk tea shop. The system facilitates seamless customer ordering, account management, and administrative control. It serves as a bridge between customers and business operations, enabling customers to browse products, manage their accounts, and track orders while providing administrators with tools to manage inventory, monitor sales, and maintain customer relationships.

### Primary Objectives:
- Provide customers with an intuitive platform to browse products, place orders, and manage their accounts
- Enable administrators to efficiently manage products, orders, payments, and customer data
- Implement secure authentication and session management for multiple user roles
- Maintain real-time order status tracking and payment processing
- Ensure scalability and maintainability through well-structured architecture

---

## C. Project Scope and Limitation

### Scope:
**In Scope:**
- Customer registration, login, and account management
- Product catalog with categories and size variants
- Shopping cart and order placement functionality
- Order history and status tracking
- Address management for delivery
- Payment method management (Cash on Delivery, GCash, Online)
- Admin dashboard for product, order, and customer management
- User role management (Customer, Admin, Staff)
- Profile picture upload and management
- Email verification and password reset functionality
- CSRF protection and secure session handling

**Out of Scope:**
- Loyalty points/rewards system (database structure ready, feature pending)
- Real-time payment gateway integration (placeholder structure exists)
- Mobile application
- Multi-language support
- Advanced analytics and reporting tools
- Inventory auto-reorder system

### Limitations:
- Currently supports local deployment (XAMPP/local server)
- Email functionality requires proper SMTP configuration
- Real-time notifications not yet implemented
- Payment integration requires third-party setup
- Staff role structure defined but features pending implementation
- Limited to single location management

---

## D. Functional Requirements (Key Features)

| # | Feature | Description | Difficulty | Duration |
|---|---------|-------------|------------|----------|
| 1 | User Authentication | Registration, login, email verification, password reset | Medium | 2 weeks |
| 2 | Customer Account Management | Profile editing, address management, contact details | Medium | 2 weeks |
| 3 | Product Management | Add, update, delete products with categories and pricing | Medium | 1.5 weeks |
| 4 | Order Management | Create, track, and manage customer orders | High | 2.5 weeks |
| 5 | Order History | Display detailed order history with items and status | Medium | 1 week |
| 6 | Payment Status Tracking | Monitor payment status for all orders | Medium | 1.5 weeks |
| 7 | Customer Management | View, search, and filter customer records | Low | 1 week |
| 8 | Profile Picture Upload | Upload and manage user profile pictures | Low | 1 week |
| 9 | Address CRUD Operations | Create, read, update, delete delivery addresses | Medium | 1.5 weeks |
| 10 | Admin Dashboard | System overview with key metrics and statistics | Low | 1 week |
| 11 | Session Management | Secure session handling with timeout and CSRF protection | High | 1.5 weeks |
| 12 | Role-Based Access Control | Different access levels for Customer, Admin, Staff | Medium | 1 week |

---

# MODULE 2: SOFTWARE REQUIREMENT SPECIFICATION

## A. Software Requirements

### A1. Programming Languages and How They Were Used

**PHP (Server-Side Backend)**
- Used for: Server-side page rendering, API endpoint creation, database operations
- Version: PHP 8.2.12 (via XAMPP)
- Key Usage Areas:
  - `api/*.php` files - RESTful API endpoints for AJAX requests
  - `*auth*.php` - Authentication and authorization logic
  - `customerAccount*.php` - Dynamic customer dashboard pages
  - Session management and secure data handling
- Libraries: PHPMailer for email operations, PDO for database abstraction

**HTML5 (Frontend Structure)**
- Used for: Page structure, form creation, semantic markup
- Key Files:
  - Landing pages: `index.html`, `aboutUs.html`, `customerHomePage.html`
  - Admin pages: `adminDashboard.html`, `adminProducts.html`, `adminOrders.html`, `adminCustomers.html`, `adminPayments.html`, `adminArchive.html`
  - Policy pages: `PrivacyPolicy.html`, `T&C.html`
- Features: Responsive meta tags, accessibility attributes (aria-labels), semantic section elements

**CSS3 (Frontend Styling)**
- Used for: Visual design, responsive layouts, animations
- File: `style.css` (comprehensive design system)
- Key Features:
  - Mobile-first responsive design (Media queries)
  - Flexbox and Grid layouts
  - CSS animations and transitions
  - Custom color scheme and typography (Poppins, Nunito fonts)
  - Component-based styling (.MODAL, .ACCOUNT-*, .ADMIN-*)
  - Status indicators and badge styling

**JavaScript (Client-Side Interactivity)**
- Used for: Dynamic interactions, form validation, API communication
- Files:
  - `script.js` - Shared utilities and navigation logic
  - `account-module.js` - Customer account page interactions
  - `admin-profile.js` - Admin dashboard functionality
- Key Features:
  - AJAX fetch calls to API endpoints
  - Form submissions and real-time validation
  - Modal management and DOM manipulation
  - Event delegation for dynamic content
  - LocalStorage for caching user preferences
  - Session timeout handling

**MySQL (Database)**
- Used for: Data storage and retrieval
- Version: MariaDB 10.4.32 (via XAMPP)
- Database: `yas_milktea_house`
- Key Operations:
  - User authentication and session management
  - Product catalog management
  - Order and order items tracking
  - Payment processing records
  - Address management
  - Rewards and loyalty system (structure)

---

### A2. API Endpoints

**Authentication & Session APIs**
```
POST   /api/auth_login.php              - User login
POST   /api/auth_signup.php             - User registration
GET    /api/check_session.php           - Verify active session
GET    /api/session_config.php          - Session configuration
GET    /api/verify_email.php            - Email verification endpoint
POST   /api/request_password_reset.php  - Request password reset
POST   /api/reset_password.php          - Complete password reset
POST   /api/confirm_password_reset.php  - Confirm password change
GET    /api/get_csrf_token.php          - CSRF token retrieval
POST   /api/csrf.php                    - CSRF validation
```

**Account Management APIs**
```
GET    /api/get_account_data.php        - Fetch user profile and stats
POST   /api/update_account.php          - Update personal information, email, password, username
POST   /api/update_profile_picture.php  - Upload and update profile picture
POST   /api/remove_profile_picture.php  - Remove profile picture
```

**Address Management APIs**
```
GET    /api/manage_addresses.php        - Get all user addresses
POST   /api/manage_addresses.php        - Add new address (POST with action=add)
PUT    /api/manage_addresses.php        - Update address (PUT)
DELETE /api/manage_addresses.php        - Delete address (DELETE)
```

**Order Management APIs**
```
GET    /api/get_user_orders.php         - Fetch customer order history
GET    /api/get_user_orders.php?order_id=X - Get specific order details
GET    /api/get_orders.php              - Admin: Get all orders (filtered/paginated)
POST   /api/place_order.php             - Create new order
POST   /api/update_order_status.php     - Update order status (admin/customer)
```

**Product Management APIs**
```
GET    /api/get_products.php            - Fetch product catalog
GET    /api/get_product_details.php     - Get single product details
POST   /api/add_product.php             - Admin: Add new product
POST   /api/update_product.php          - Admin: Update product
POST   /api/delete_product.php          - Admin: Delete/archive product
GET    /api/get_categories.php          - Fetch product categories
```

**Payment Management APIs**
```
GET    /api/get_payments.php            - Admin: Fetch payment records
POST   /api/update_payment_status.php   - Admin: Update payment status
```

**User/Customer Management APIs**
```
GET    /api/get_customers.php           - Admin: Get all customers
GET    /api/get_admin_data.php          - Get admin user information
POST   /api/update_user_role.php        - Admin: Change user role
POST   /api/update_user_status.php      - Admin: Change user status
```

**Utility APIs**
```
POST   /api/send_welcome_email.php      - Send welcome email to new users
GET    /api/mail_config.example.php     - Email configuration (example)
POST   /api/account_setup.php           - Database schema initialization
```

---

### A3. Integrated Development Environment Used

**Primary IDE:**
- **Visual Studio Code (VS Code)**
  - Version: Latest community build
  - Extensions Used:
    - PHP Intelephense (code intelligence for PHP)
    - SQL Beautify (database query formatting)
    - Live Server (frontend testing)
    - Thunder Client / REST Client (API testing)
    - Git Graph (version control)

**Development Tools:**
- **XAMPP Stack** - Local development server containing:
  - Apache 2.4 - Web server
  - PHP 8.2.12 - Server-side interpreter
  - MariaDB 10.4.32 - Database management system
  - phpMyAdmin - Database administration interface

**Version Control:**
- **Git** - Source code version control
- **GitHub** - Remote repository (optional)

**Design & Prototyping:**
- **Figma** - UI/UX design and prototyping (mentioned in scope)
- **Adobe/Sketch** - Mockups and wireframes

**API Testing:**
- **Postman / Thunder Client** - REST API endpoint testing
- **Browser DevTools** - Network analysis and JavaScript debugging

---

### A4. Database Management System Used

**Primary DBMS:**
- **MariaDB 10.4.32**
  - Engine: InnoDB (transactions, foreign keys)
  - Charset: utf8mb4 (full UTF-8 support)
  - Connection: PDO (PHP Data Objects) for abstraction

**Alternative Support:**
- MySQL 5.7+ (backward compatible)
- Percona Server

**Key Database Features:**
- Transaction support for order operations
- Foreign key constraints for data integrity
- Timestamps for audit trails
- Enum types for status values
- CONCAT for string operations

---

### A5. Other Tools and Technologies

**XAMPP (Development Environment Suite)**
- **Apache 2.4**: Web server for serving HTTP requests
  - Virtual hosts support
  - .htaccess rewrite rules
  - SSL/TLS support for HTTPS

- **PHP 8.2.12**: Server-side scripting
  - Built-in session handling
  - File upload management
  - JSON encoding/decoding
  - PDO database abstraction

- **MariaDB 10.4.32**: Data persistence
  - Relational database structure
  - ACID compliance
  - Query optimization

**Ngrok (Optional - For Production/Testing)**
- Secure tunneling for exposing local server to internet
- Use Case: Testing webhooks, third-party integrations, sharing demos
- Configuration: Port forwarding to localhost:80/XAMPP

**Figma (Design Tool)**
- UI/UX mockups and prototypes
- Component library for consistency
- Collaboration platform for design reviews
- Export assets for web development

**Composer (PHP Package Manager)**
- Dependency management
- Currently configured for: PHPMailer, other utilities
- `composer.json` and `composer.lock` for reproducibility
- `vendor/autoload.php` for autoloading classes

**Font Awesome (Icon Library)**
- CDN: `cdnjs.cloudflare.com`
- Version: 6.4.0
- Icons used for: Navigation, buttons, status indicators
- Example: `<i class="fa-solid fa-user"></i>`

**Google Fonts (Typography)**
- **Poppins**: Primary font (modern, clean)
- **Nunito**: Secondary font (friendly, readable)
- CDN: `fonts.googleapis.com`
- Weights: 400, 500, 600, 700, 800

**Browser APIs**
- **LocalStorage**: Client-side data persistence (user preferences, profile pics)
- **Fetch API**: Asynchronous HTTP requests
- **File API**: Profile picture upload handling
- **Session Storage**: Temporary session data

**Email Service (Optional)**
- **PHPMailer**: Email sending library
- **SMTP Configuration**: Required for production email
- Use Case: Welcome emails, password resets, notifications

---

## B. System Users

### 1. **Customer**
- **Description**: End-user who browses products, places orders, and manages personal account
- **Access Level**: Limited to personal data and order history
- **Capabilities**:
  - Register and authenticate
  - Browse product catalog
  - Manage profile (picture, name, email, password)
  - Add/edit/delete delivery addresses
  - View order history and details
  - Track order status
  - Manage payment methods
  - Request password reset
  - View and contact support

**Customer User Stories:**
- "As a customer, I want to create an account so I can place orders online"
- "As a customer, I want to save multiple delivery addresses for convenience"
- "As a customer, I want to track my order status in real-time"
- "As a customer, I want to upload a profile picture for personalization"
- "As a customer, I want to view my complete order history"

---

### 2. **Admin**
- **Description**: System administrator with full control over all operations
- **Access Level**: Complete access to all system features and data
- **Capabilities**:
  - All customer capabilities plus:
  - Manage product catalog (CRUD operations)
  - Manage inventory and stock levels
  - View and manage all orders
  - Update order statuses
  - Monitor payment statuses
  - View all customer data
  - Manage user roles (promote/demote staff to admin)
  - Manage user account status (active/inactive/pending)
  - View system statistics and dashboard
  - Archive/restore products

**Admin User Stories:**
- "As an admin, I want to add new products to the catalog"
- "As an admin, I want to track all orders and their statuses"
- "As an admin, I want to manage payment records and status"
- "As an admin, I want to monitor customer base and activity"
- "As an admin, I want to promote staff members to administrators"

---

### 3. **Staff**
- **Description**: Employee with limited administrative capabilities
- **Access Level**: Partial access focused on order and customer support
- **Capabilities**:
  - View own profile
  - View orders (read-only or limited update)
  - View customer information (for support)
  - Update order status (pending features)
  - Generate reports (pending features)
  - Cannot modify products
  - Cannot modify user roles
  - Cannot access payment details (restricted)

**Staff User Stories:**
- "As a staff member, I want to view pending orders for fulfillment"
- "As a staff member, I want to update order status as we prepare it"
- "As a staff member, I want to look up customer information for support"
- "As a staff member, I want to view order history for a specific customer"

**Note:** Staff functionality structure is in place but feature development is pending.

---

## C. System Features and Processes

### **FEATURE 1: USER AUTHENTICATION & REGISTRATION**

#### Description
The authentication system manages secure user registration, login, email verification, password reset, and session management. It supports three user roles (Customer, Admin, Staff) with role-based redirects.

#### Stimulus and Response Sequences

**Scenario 1: New User Registration**
```
STIMULUS:  User fills registration form (email, username, password, confirm password)
RESPONSE:  Form validates input client-side
           Server generates verification token
           Email verification sent to provided email
           User redirected to verification page
           User clicks email link to verify account
           Account status changes from 'pending' to 'active'
           User can now log in
```

**Scenario 2: Existing User Login**
```
STIMULUS:  User enters username/email and password
RESPONSE:  Server validates credentials against database
           Password verified using bcrypt hashing
           Session created with user_id and role
           User role determined (admin/staff → adminDashboard.html)
                              (customer → customerHomePage.html)
           Session cookie set with security flags
           User redirected to appropriate dashboard
```

**Scenario 3: Password Reset**
```
STIMULUS:  User clicks "Forgot Password"
RESPONSE:  User enters email address
           Server generates reset token with expiration (24 hours)
           Reset link sent to email
           User clicks link in email
           Reset page shows password fields
           User enters new password
           Token validated and expires after use
           Password updated and rehashed
           User redirected to login page
```

#### Functional Requirements
- **FR-AUTH-01**: System shall support user registration with email, username, password
- **FR-AUTH-02**: System shall validate password strength (min 8 chars, mixed case, numbers)
- **FR-AUTH-03**: System shall send verification email with unique token link
- **FR-AUTH-04**: System shall verify email within 24 hours of registration
- **FR-AUTH-05**: System shall securely hash passwords using bcrypt
- **FR-AUTH-06**: System shall support login via username OR email
- **FR-AUTH-07**: System shall create session with 30-minute timeout
- **FR-AUTH-08**: System shall implement CSRF protection for all forms
- **FR-AUTH-09**: System shall support password reset with expiring tokens
- **FR-AUTH-10**: System shall log failed login attempts (pending feature)
- **FR-AUTH-11**: System shall redirect users based on role (customer/admin/staff)

---

### **FEATURE 2: CUSTOMER ACCOUNT MANAGEMENT**

#### Description
The account management system allows customers to maintain their personal information, manage multiple delivery addresses, upload profile pictures, and track order history. Features include profile editing, address CRUD operations, and payment method management.

#### Stimulus and Response Sequences

**Scenario 1: Edit Customer Profile**
```
STIMULUS:  Customer navigates to Profile module
RESPONSE:  System loads current profile data from database
           Display form fields pre-filled with existing data
           Customer edits fields (full name, contact, DOB, email, username)
           Customer clicks "Save Changes"
           Client-side validation checks required fields
           Server-side validation verifies data format and uniqueness
           Database updates user record
           Success message displayed
           Profile updated in navbar if applicable
           If email changed → requires re-login
           If username changed → requires re-login
```

**Scenario 2: Upload Profile Picture**
```
STIMULUS:  Customer clicks "Choose File" in profile picture upload
RESPONSE:  File picker opens, user selects image (JPG, PNG, GIF, WebP)
           File size validated (max 5MB)
           Image dimensions checked (recommended)
           File uploaded to server
           Image processed and stored in /images directory
           Database updated with new image path
           Profile picture updated in navbar
           Previous image replaced
           Success confirmation shown
```

**Scenario 3: Add New Delivery Address**
```
STIMULUS:  Customer clicks "Add New Address" in Addresses module
RESPONSE:  Modal form opens with empty fields
           Customer fills: address type, house number, street, barangay, city, province
           Optional fields: landmark, delivery instructions
           Customer can set as primary address (checkbox)
           Submit button triggers validation
           Server validates address completeness
           Address saved to database
           Modal closes
           New address appears in addresses list
           If set as primary, updates overview primary address
```

**Scenario 4: View Order History**
```
STIMULUS:  Customer navigates to Order History module
RESPONSE:  System fetches all customer orders from database
           Orders displayed in table: Order ID, Date, Items, Total, Status
           Status color-coded: pending (yellow), preparing (blue), completed (green), cancelled (red)
           Customer clicks on order row
           Modal opens showing detailed information:
             - Order items with quantities and prices
             - Delivery address
             - Payment method
             - Order date/time
           Cancel button appears if status is 'pending'
           Customer can cancel pending orders
           Modal closes and order history updates
```

#### Functional Requirements
- **FR-ACCT-01**: System shall display account overview with member stats
- **FR-ACCT-02**: System shall allow customers to edit full name and contact number
- **FR-ACCT-03**: System shall allow email update (requires re-login after change)
- **FR-ACCT-04**: System shall allow password change with current password verification
- **FR-ACCT-05**: System shall allow username change (requires re-login after change)
- **FR-ACCT-06**: System shall support profile picture upload (JPG, PNG, GIF, WebP max 5MB)
- **FR-ACCT-07**: System shall display profile picture in navbar and account page
- **FR-ACCT-08**: System shall allow removing profile picture (returns to default)
- **FR-ACCT-09**: System shall support multiple delivery addresses per customer
- **FR-ACCT-10**: System shall allow CRUD operations on addresses
- **FR-ACCT-11**: System shall enforce one primary address per customer
- **FR-ACCT-12**: System shall display order history with items and status
- **FR-ACCT-13**: System shall show order details in modal on row click
- **FR-ACCT-14**: System shall allow cancelling pending orders
- **FR-ACCT-15**: System shall calculate and display member since date
- **FR-ACCT-16**: System shall calculate and display total orders count
- **FR-ACCT-17**: System shall calculate and display total amount spent

---

### **FEATURE 3: PRODUCT MANAGEMENT**

#### Description
The product management system enables administrators to maintain the product catalog, manage pricing for different sizes (16oz, 22oz), organize products by categories, and control product availability through status management (active/archive).

#### Stimulus and Response Sequences

**Scenario 1: Add New Product (Admin)**
```
STIMULUS:  Admin clicks "Add Product" button in Products module
RESPONSE:  Modal form opens with empty fields
           Admin fills: Product name, category dropdown, description
           Admin enters prices for both sizes (16oz, 22oz)
           Admin uploads product image
           Admin sets initial stock quantity
           Admin clicks "Add Product"
           Server validates all required fields
           Image uploaded and stored in /images directory
           Product record created in database with status='active'
           Modal closes
           New product appears in product table
           Success notification displayed
```

**Scenario 2: Update Product**
```
STIMULUS:  Admin clicks "Edit" icon on product row
RESPONSE:  Product detail modal opens pre-filled with current data
           Admin can modify: name, category, description, prices, stock, image
           Admin clicks "Update Product"
           Server validates changes
           Database record updated
           Modal closes
           Product table reflects changes
           Success confirmation shown
```

**Scenario 3: Archive Product**
```
STIMULUS:  Admin clicks "Archive" or "Delete" on product row
RESPONSE:  Confirmation dialog appears
           Admin confirms action
           Product status changed from 'active' to 'archive'
           Product removed from active product list
           Product appears in archive list (for reference)
           Customers cannot select archived products
           Archive is reversible (restore functionality)
```

#### Functional Requirements
- **FR-PROD-01**: System shall support CRUD operations on products
- **FR-PROD-02**: System shall organize products by categories
- **FR-PROD-03**: System shall support multiple sizes with different pricing
- **FR-PROD-04**: System shall manage product stock levels
- **FR-PROD-05**: System shall support product image upload
- **FR-PROD-06**: System shall allow archiving (soft delete) of products
- **FR-PROD-07**: System shall display active products in customer catalog
- **FR-PROD-08**: System shall hide archived products from customers
- **FR-PROD-09**: System shall validate product price format (decimal with 2 places)
- **FR-PROD-10**: System shall provide product search/filter by category

---

### **FEATURE 4: ORDER MANAGEMENT**

#### Description
The order management system handles order creation, status tracking, customer order history display, and admin order overview. Orders can be placed in multiple formats (dine-in, to-go, delivery) and tracked through various statuses (pending, preparing, completed, cancelled).

#### Stimulus and Response Sequences

**Scenario 1: Place Order (Customer)**
```
STIMULUS:  Customer adds items to cart and clicks "Checkout"
RESPONSE:  Checkout page displays items, quantities, sizes, and total
           Customer selects delivery address or dine-in location
           Customer selects order type (dine-in, to-go, delivery)
           System calculates total with any applicable fees
           Customer reviews order
           Customer clicks "Place Order"
           Server validates order items and availability
           Order record created with status='pending'
           Order items inserted for each cart item
           Payment record created with initial status='unpaid'
           Order confirmation page displayed with Order ID
           Order appears in customer's order history
           Admin receives order notification
```

**Scenario 2: Admin Updates Order Status**
```
STIMULUS:  Admin views orders in Orders module
RESPONSE:  List displays all orders with current status
           Admin clicks on order to view details
           Details modal shows: items, customer info, address, total
           Admin selects new status: pending → preparing → completed
           Status update submitted to server
           Order status updated in database
           Customer notification sent (if implemented)
           Order details reflect new status
           Completed orders can show in customer's history as 'completed'
```

**Scenario 3: Customer Views Order Details**
```
STIMULUS:  Customer clicks on order in Order History
RESPONSE:  Modal opens showing complete order details:
             - Order ID and date
             - Items (product name, quantity, size, price)
             - Delivery address
             - Order status with timestamp
             - Total amount and payment method
           If status is 'pending':
             - Cancel button available
             - Customer can click Cancel Order
             - Confirmation dialog appears
             - Upon confirmation, order status changed to 'cancelled'
             - Customer notified of cancellation
```

#### Functional Requirements
- **FR-ORD-01**: System shall support multiple order types (dine-in, to-go, delivery)
- **FR-ORD-02**: System shall create order with associated line items
- **FR-ORD-03**: System shall track order status (pending, preparing, completed, cancelled)
- **FR-ORD-04**: System shall allow customers to view their order history
- **FR-ORD-05**: System shall display detailed order information in modal
- **FR-ORD-06**: System shall allow customers to cancel pending orders only
- **FR-ORD-07**: System shall allow admins to update order status
- **FR-ORD-08**: System shall validate order total against items and pricing
- **FR-ORD-09**: System shall maintain audit trail of order status changes
- **FR-ORD-10**: System shall calculate order total based on items and sizes
- **FR-ORD-11**: System shall associate delivery address with delivery orders
- **FR-ORD-12**: System shall track order creation timestamp

---

### **FEATURE 5: PAYMENT MANAGEMENT**

#### Description
The payment management system tracks payment methods, payment statuses, and payment records associated with orders. Supports multiple payment methods including Cash on Delivery, Cash, GCash, and Online Payment.

#### Stimulus and Response Sequences

**Scenario 1: Admin Monitors Payment Status**
```
STIMULUS:  Admin navigates to Payments module
RESPONSE:  List displays all payment records with:
             - Order ID and customer name
             - Payment amount
             - Payment method (COD, Cash, GCash, Online)
             - Payment status (paid, unpaid, refunded, pending)
             - Payment date/time
           Admin can filter by payment method or status
           Admin clicks on payment record to view details
           Details show: GCash reference, mobile number (if applicable), receipt info
           Admin can update payment status (mark as paid, refund, etc.)
```

**Scenario 2: Update Payment Status**
```
STIMULUS:  Admin changes payment status for an order
RESPONSE:  Status update submitted to server
           Server validates status transition
           Payment record updated in database
           If marked as 'paid':
             - Confirmation message shown
             - Order processing can proceed
           If marked as 'refunded':
             - Refund recorded
             - Reference information saved
```

#### Functional Requirements
- **FR-PAY-01**: System shall create payment record with each order
- **FR-PAY-02**: System shall support multiple payment methods
- **FR-PAY-03**: System shall track payment status (paid, unpaid, refunded, pending)
- **FR-PAY-04**: System shall store GCash reference and mobile number when applicable
- **FR-PAY-05**: System shall store cash payment receipt information
- **FR-PAY-06**: System shall allow admins to update payment status
- **FR-PAY-07**: System shall track payment date and timestamps
- **FR-PAY-08**: System shall validate payment amount matches order total
- **FR-PAY-09**: System shall support payment refunds with reason tracking

---

### **FEATURE 6: CUSTOMER MANAGEMENT (Admin)**

#### Description
The admin customer management system provides administrators with tools to view, search, and manage customer information. Includes capabilities to filter by status and user role.

#### Stimulus and Response Sequences

**Scenario 1: View Customer List**
```
STIMULUS:  Admin navigates to Customers module
RESPONSE:  System displays customers organized by status:
             - Active customers (verified, active accounts)
             - Inactive customers (deactivated accounts)
             - Pending customers (awaiting verification)
           Also displays staffs and admins
           Count badges show number in each category
           Admin can click on customer name to view details
           Details modal shows: username, email, contact, join date, profile picture
           Admin can perform actions: deactivate, promote to staff (if applicable)
```

**Scenario 2: Manage User Status**
```
STIMULUS:  Admin clicks status action on customer row
RESPONSE:  Status update modal appears or inline confirmation
           Admin selects new status (active, inactive, pending)
           Admin confirms change
           Customer status updated in database
           Customer access changes based on new status
           Inactive customers cannot log in
           Change reflected in customer list
```

#### Functional Requirements
- **FR-CUST-01**: System shall display all customers with status indicators
- **FR-CUST-02**: System shall organize customers by status (active, inactive, pending)
- **FR-CUST-03**: System shall display separate lists for admins and staff
- **FR-CUST-04**: System shall show customer join date
- **FR-CUST-05**: System shall allow admins to view customer details
- **FR-CUST-06**: System shall allow admins to update customer status
- **FR-CUST-07**: System shall display customer profile pictures
- **FR-CUST-08**: System shall provide customer search/filter capability

---

### **FEATURE 7: ADMIN DASHBOARD**

#### Description
The admin dashboard provides system overview with key metrics and statistics. Displays order count, customer count, payment status breakdown, and product availability at a glance.

#### Functional Requirements
- **FR-DASH-01**: System shall display total orders count
- **FR-DASH-02**: System shall display total customers count
- **FR-DASH-03**: System shall display order status breakdown
- **FR-DASH-04**: System shall display payment status breakdown
- **FR-DASH-05**: System shall display total products in catalog
- **FR-DASH-06**: System shall display low stock warnings (pending)
- **FR-DASH-07**: System shall display recent orders
- **FR-DASH-08**: System shall display sales metrics (pending advanced feature)

---

# MODULE 3: DATABASE REQUIREMENT SPECIFICATION

## Database Name
**`yas_milktea_house`**

---

## List of User Credentials

### Test Accounts (From Database):

**Admin Account:**
```
Username: Stef_admin
Email: marekeyks101@gmail.com
Password: [Hashed - bcrypt]
Role: admin
Status: active
User ID: 21
```

**Customer Accounts (Sample):**
```
User ID: 28
Username: [From database]
Email: [Customer email]
Role: customer
Status: active

User ID: 37
Username: [From database]
Email: [Customer email]
Role: customer
Status: active

User ID: 38
Username: [From database]
Email: [Customer email]
Role: customer
Status: active
```

**Note:** Passwords are stored as bcrypt hashes for security. New user credentials are created through the registration process.

---

## List of Tables

1. **users** - User account and authentication information
2. **address_locations** - Physical address component storage
3. **address_details** - User delivery addresses and preferences
4. **categories** - Product category classification
5. **products** - Product catalog and inventory
6. **orders** - Customer orders
7. **order_items** - Individual items within orders
8. **payments** - Payment transaction records
9. **rewards** - Loyalty rewards system structure

---

## Data Dictionary and Schema

### TABLE 1: `users`
**Purpose:** Store user account information and authentication credentials

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| user_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| username | VARCHAR(100) | NOT NULL, UNIQUE | Login username |
| email | VARCHAR(150) | NOT NULL, UNIQUE | Email address for login and contact |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| role | ENUM('admin', 'customer', 'staff') | NOT NULL | User role for access control |
| status | ENUM('active', 'inactive', 'pending') | DEFAULT 'pending' | Account status |
| verification_token | VARCHAR(255) | NULLABLE | Email verification token |
| verified_at | TIMESTAMP | NULLABLE | Email verification completion timestamp |
| password_reset_token | VARCHAR(255) | NULLABLE | Password reset token |
| password_reset_expires_at | DATETIME | NULLABLE | Password reset token expiration |
| password_reset_confirmed_at | DATETIME | NULLABLE | Password reset completion timestamp |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| full_name | VARCHAR(150) | NULLABLE | User's full name |
| contact_number | VARCHAR(20) | NULLABLE | User's phone number |
| profile_picture | VARCHAR(255) | DEFAULT 'images/yas_logo.png' | Path to profile picture |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Sample Records:**
- Admin: Stef_admin (user_id: 21)
- Various customers with user_ids 28, 37, 38

---

### TABLE 2: `address_locations`
**Purpose:** Store components of physical addresses for flexible address management

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| location_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique location identifier |
| house_no | VARCHAR(50) | NULLABLE | House/unit number |
| street | VARCHAR(255) | NULLABLE | Street name |
| barangay | VARCHAR(255) | NULLABLE | Barangay (Philippines administrative division) |
| city | VARCHAR(100) | NULLABLE | City/municipality name |
| province | VARCHAR(100) | NULLABLE | Province name |
| address_line | VARCHAR(255) | NOT NULL | Complete formatted address |

---

### TABLE 3: `address_details`
**Purpose:** Manage customer delivery addresses with preferences and delivery instructions

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| address_details_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique address record identifier |
| user_id | INT UNSIGNED | NOT NULL, FOREIGN KEY | Reference to users table |
| location_id | INT UNSIGNED | NOT NULL, FOREIGN KEY | Reference to address_locations table |
| address_type | ENUM('home', 'office', 'other') | DEFAULT 'home' | Type of address |
| landmark | VARCHAR(255) | NULLABLE | Landmark or building name |
| delivery_instructions | TEXT | NULLABLE | Special delivery instructions |
| is_primary | TINYINT(1) | DEFAULT 0 | Flag for primary address (0=false, 1=true) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

---

### TABLE 4: `categories`
**Purpose:** Organize products into logical groupings for catalog navigation

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| category_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique category identifier |
| category_name | VARCHAR(100) | NOT NULL | Category display name |
| category_slug | VARCHAR(100) | NOT NULL, UNIQUE | URL-friendly category identifier |

**Sample Categories:**
- Classic Milktea
- Premium Milktea
- Cream Cheese Series
- Fruit Milk
- Fruit Tea
- Takoyaki
- Shawarma
- Chicken Wings + Fries
- Burger
- Fries

---

### TABLE 5: `products`
**Purpose:** Store product catalog with pricing, inventory, and metadata

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| product_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique product identifier |
| category_id | INT UNSIGNED | NOT NULL, FOREIGN KEY | Reference to categories table |
| product_name | VARCHAR(150) | NOT NULL | Product display name |
| price_16 | DECIMAL(10,2) | DEFAULT 0.00 | Price for 16oz size |
| price_22 | DECIMAL(10,2) | DEFAULT 0.00 | Price for 22oz size |
| description | TEXT | NULLABLE | Product description |
| stock | INT UNSIGNED | DEFAULT 0 | Available quantity in inventory |
| image | VARCHAR(255) | NULLABLE | Path to product image file |
| status | ENUM('active', 'archive') | DEFAULT 'active' | Product availability status |

**Sample Products (45+ total):**
- Matcha (16oz: ₱90, 22oz: ₱110)
- Okinawa (16oz: ₱90, 22oz: ₱110)
- Red Velvet (16oz: ₱90, 22oz: ₱110)
- [... many more beverages and food items]

---

### TABLE 6: `orders`
**Purpose:** Track customer orders with totals and current status

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| order_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique order identifier |
| user_id | INT UNSIGNED | NOT NULL, FOREIGN KEY | Reference to customers table |
| order_date | DATETIME | NOT NULL | Order creation date and time |
| order_type | ENUM('dine-in', 'to-go', 'delivery') | DEFAULT 'to-go' | Type of order |
| total_amount | DECIMAL(10,2) | DEFAULT 0.00 | Order total in Philippine Pesos |
| status | ENUM('pending', 'preparing', 'completed', 'cancelled') | DEFAULT 'pending' | Current order status |

**Sample Orders:**
```
Order ID: 14, User: 28, Date: 2026-05-05, Type: delivery, Total: ₱260, Status: completed
Order ID: 26, User: 38, Date: 2026-05-11, Type: delivery, Total: ₱245, Status: pending
Order ID: 27, User: 28, Date: 2026-05-11, Type: delivery, Total: ₱335, Status: completed
[... more orders]
```

---

### TABLE 7: `order_items`
**Purpose:** Detail individual items within each order with customization

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| order_item_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique line item identifier |
| order_id | INT UNSIGNED | NOT NULL, FOREIGN KEY | Reference to orders table |
| product_id | INT UNSIGNED | NOT NULL, FOREIGN KEY | Reference to products table |
| location | VARCHAR(20) | NOT NULL | Delivery/order location tag |
| size | VARCHAR(20) | NULLABLE | Size (16oz, 22oz) |
| sugar_level | VARCHAR(10) | NULLABLE | Sugar percentage (0%, 25%, 50%, 75%, 100%) |
| addons | TEXT | NULLABLE | JSON or comma-separated addon details |
| flavor | VARCHAR(50) | NULLABLE | Flavor selection (if applicable) |
| pieces_per_box | VARCHAR(20) | NULLABLE | Box quantity for food items |
| serving | VARCHAR(30) | NULLABLE | Serving size specification |
| quantity | INT UNSIGNED | DEFAULT 1 | Number of units ordered |
| price | DECIMAL(10,2) | DEFAULT 0.00 | Unit price at time of order |

**Sample Order Items:**
```
Order 14, Item: Matcha 22oz (25% sugar, Whip addon) × 1 @ ₱145
Order 14, Item: Red Velvet 16oz (25% sugar) × 1 @ ₱90
Order 26, Item: Matcha 16oz (100% sugar, Oreo addon) × 2 @ ₱110
```

---

### TABLE 8: `payments`
**Purpose:** Track payment transactions linked to orders

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| payment_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique payment record identifier |
| order_id | INT UNSIGNED | NOT NULL, FOREIGN KEY | Reference to orders table |
| amount | DECIMAL(10,2) | DEFAULT 0.00 | Payment amount in Philippine Pesos |
| method | ENUM('cash_on_delivery', 'cash', 'gcash', 'online_payment') | DEFAULT 'cash_on_delivery' | Payment method used |
| status | ENUM('paid', 'unpaid', 'refunded', 'pending') | DEFAULT 'unpaid' | Current payment status |
| receipt_info | VARCHAR(255) | NULLABLE | Receipt or transaction reference |
| gcash_reference | VARCHAR(100) | NULLABLE | GCash transaction reference number |
| gcash_mobile | VARCHAR(30) | NULLABLE | GCash mobile number used |
| payment_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Payment timestamp |

**Sample Payments:**
```
Payment 7: Order 14, ₱260, COD, unpaid
Payment 17: Order 27, ₱335, GCash, paid, Ref: 0123456789
Payment 18: Order 28, ₱170, GCash, unpaid, Ref: 676767676767
```

---

### TABLE 9: `rewards`
**Purpose:** Store loyalty rewards system structure (currently not in use)

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| reward_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique reward identifier |
| reward_name | VARCHAR(150) | NOT NULL | Reward name/description |
| points_required | INT UNSIGNED | DEFAULT 0 | Points needed to redeem |
| status | ENUM('active', 'inactive') | DEFAULT 'active' | Reward availability status |

**Note:** This table structure exists for future rewards system implementation. No data currently populated.

---

## Database Schema Summary

### Entity Relationships
```
Users (1) ──── (M) Orders
Users (1) ──── (M) Address_Details
Address_Details (M) ──── (1) Address_Locations
Orders (1) ──── (M) Order_Items
Orders (1) ──── (1) Payments
Products (1) ──── (M) Order_Items
Categories (1) ──── (M) Products
```

### Key Constraints
- **Foreign Keys**: All references enforce referential integrity
- **Unique Constraints**: username, email, category_slug
- **Check Constraints**: Implicit through ENUM types
- **Default Values**: Timestamps auto-generated, status defaults specified

### Indexing Strategy (Recommended)
```sql
-- Performance optimization indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_address_details_user_id ON address_details(user_id);
```

### Database Statistics
- **Total Tables**: 9
- **Total Columns**: 85+
- **Relationships**: 8 Foreign Keys
- **Current Data**: 
  - 3+ admin/staff users
  - 20+ customer users
  - 9+ orders
  - 45+ products
  - 10 categories
  - 9 payments

---

## Data Integrity & Security

### Authentication & Authorization
- Passwords: bcrypt hashing (salt + hash iterations)
- Session Management: PHP sessions with timeout (30 minutes)
- CSRF Protection: Token-based prevention on all forms
- Email Verification: Token-based verification for new accounts

### Data Validation
- Input validation on both client and server
- SQL Injection prevention: PDO prepared statements
- File upload validation: Type and size restrictions
- Email format validation: RFC 5322 compliance

### Audit Trail
- Timestamps on all records (created_at, updated_at)
- Status history tracked through order status enum
- Payment status changes tracked with timestamps
- User profile updates recorded with updated_at

### Backup & Recovery
- Database exported as SQL dump: `yas_milktea_house.sql`
- Structure includes: CREATE TABLE, INSERT statements
- Version: Generated May 14, 2026 at 03:56 PM
- Location: Project root directory

---

## ERD (Entity Relationship Diagram)

```
┌─────────────┐
│   users     │
├─────────────┤
│ user_id (PK)│
│ username    │
│ email       │
│ password    │
│ role        │
│ status      │
│ created_at  │
└──────┬──────┘
       │
       ├───────────┬──────────────┐
       │           │              │
       │    (1:M)  │      (1:M)   │
       ▼           ▼              ▼
  ┌────────┐  ┌──────────────┐
  │orders  │  │addr_details  │
  ├────────┤  ├──────────────┤
  │order_id│  │address_id    │
  │user_id │  │user_id       │
  │status  │  │address_type  │
  │total   │  │location_id   │
  └─────┬──┘  └────────┬─────┘
        │              │
        │ (1:M)        │ (M:1)
        ▼              ▼
  ┌──────────────┐  ┌─────────────────┐
  │order_items   │  │address_locations│
  ├──────────────┤  ├─────────────────┤
  │order_item_id │  │location_id      │
  │order_id      │  │street, city     │
  │product_id    │  │barangay, etc    │
  │quantity      │  └─────────────────┘
  │price         │
  └──────┬───────┘
         │
         │ (M:1)
         ▼
    ┌─────────────┐
    │  products   │
    ├─────────────┤
    │ product_id  │
    │ category_id │
    │ price_16    │
    │ price_22    │
    │ stock       │
    └────────┬────┘
             │
             │ (M:1)
             ▼
    ┌──────────────┐
    │ categories   │
    ├──────────────┤
    │ category_id  │
    │ category_name│
    └──────────────┘

    ┌──────────────┐
    │  payments    │
    ├──────────────┤
    │ payment_id   │
    │ order_id (FK)│
    │ amount       │
    │ method       │
    │ status       │
    └──────────────┘
       (M:1)
         │
         └──────── to Orders
```

---

## System Generated Reports

- Order Summary Report - Provides total orders, order statuses, and revenue figures for a selected date range.
- Customer Activity Report - Shows customer login activity, registered accounts, and order frequency.
- Inventory Status Report - Lists product stock levels and identifies low-stock or out-of-stock items.
- Payment Transaction Report - Summarizes payment amounts, methods used, and payment status distribution.
- Delivery Address Report - Displays saved customer addresses by type and usage frequency.
- Order Detail Report - Generates a detailed breakdown of individual orders, including items, totals, and delivery details.
- User Role Report - Shows counts and statuses of Admin, Staff, and Customer accounts.

---

## End of Documentation

**Document Version:** 1.0
**Last Updated:** May 14, 2026
**Team:** Lovebugs
**System:** BO-BYTE: Ordering and Management System for Yas Milktea House
