# Yas Milktea House Web App - Defense Guide

## Table of Contents
1. Project overview
2. Architecture and how components fit together
3. Key folders and file categories
4. Public-facing pages
5. Customer account pages
6. Admin dashboard pages
7. Backend API and server-side scripts
8. Frontend JavaScript behavior
9. Styling and responsive layout
10. Security and data flow
11. Technical terms glossary
12. Defense talking points

---

## 1. Project Overview

This project is a PHP-based web application for a fictional milk tea shop called Yas Milktea House. It includes:
- a public marketing site and menu,
- customer login and account management,
- an admin dashboard for managing products, orders, promos, rewards, payments, and customers.

The project uses:
- PHP for server-side pages and API endpoints,
- MySQL via PDO for the database,
- HTML/CSS for layout and visual design,
- JavaScript for interaction, navigation, and AJAX data exchange.

The app is split into three major areas:
- Public pages: landing, menu, promotions, policy pages.
- Customer account pages: account overview, profile, addresses, orders, payments.
- Admin pages: product management, order management, user/customer management, promotions, rewards, payments.

---

## 2. Architecture and How Components Fit Together

### Overall architecture
- The **frontend** consists of HTML and PHP pages served by the web server.
- The **shared stylesheet** `style.css` defines the visual design.
- The **shared client script** `script.js` handles navigation, user data sync, and reusable behavior.
- The **backend** uses PHP to connect to the database and handle requests.
- The **API folder** contains endpoints that return JSON or perform actions.
- Session logic and authentication are centralized in `api/session_config.php` and `account-common.php`.

### Component flow
1. User visits a public page or login/signup page.
2. After logging in or signing up, the user may be redirected to the customer dashboard.
3. Customer pages load dynamic user data through PHP and client-side fetch requests.
4. Admin pages are static HTML but rely on JavaScript and API endpoints for dynamic content.
5. Form submissions and updates are sent to `api/*.php` endpoints.
6. API endpoints use `api/db.php` to connect to MySQL.
7. Shared UI elements like navigation, dropdowns, and modals are styled by `style.css`.

### Relationship between files
- `account-common.php` is included by customer account pages to enforce authentication, load session user data, and provide navigation.
- `api/db.php` provides a reusable PDO connection.
- `api/session_config.php` configures PHP sessions for user identity.
- `script.js` is loaded on most pages and provides shared interactive features like mobile nav toggling and account/user dropdown behaviors.
- Individual admin pages share the same CSS classes and a common design language.
- Public pages, customer pages, and admin pages are visually consistent because they all use `style.css`.

---

## 3. Key Folders and File Categories

### Root files
- `index.html`: main landing page for customers.
- `aboutUs.html`: brand story page.
- `menu.php`: menu listing page.
- `customerHomePage.html`: home page for logged-in customers.
- `loginSignUp.php`: handles both login and signup UI and client-side logic.
- `check_db.php`: optional utility to test database connectivity.
- `update_db.php`, `update_default.php`: database update utilities.
- `session_check.php`: simple session validation helper.
- `cussomterAccount.php`, `customerAccountPersonal.php`, `customerAccountProfile.php`, `customerAccountPayments.php`, `customerAccountOrders.php`, `customerAccountAddresses.php`: customer account pages.
- `account-sidebar.php`: shared account navigation sidebar included in customer account pages.
- `account-module.js`: account page logic for form behavior and API actions.
- `admin*.html`: admin dashboard pages.
- `style.css`: site-wide design system.
- `script.js`: shared JavaScript utilities.

### API files (`api/`)
- `db.php`: database connection.
- `session_config.php`: session configuration.
- `csrf.php` and `get_csrf_token.php`: CSRF protection.
- `check_session.php`: session validation endpoint.
- `get_account_data.php`: fetch customer account data.
- `update_account.php`: update profile, email, password, and username.
- `update_profile_picture.php`: upload and update user avatar.
- `manage_addresses.php`: CRUD on user addresses.
- `get_user_orders.php`: fetch user's order history.
- `get_products.php`, `get_product_details.php`, `add_product.php`, `update_product.php`, `delete_product.php`: admin product management.
- `get_orders.php`, `update_order_status.php`: order admin logic.
- `get_payments.php`, `update_payment_status.php`: payment status admin logic.
- `get_customers.php`, `get_admin_data.php`: user/customer admin data.
- `get_categories.php`: menu categories.
- `place_order.php`: create a customer order.
- `send_welcome_email.php`: email notification helper.
- `remove_profile_picture.php`: remove a user's profile image.
- `update_user_role.php`, `update_user_status.php`: admin account management.
- `account_setup.php`: schema and account setup helper.

### Assets and dependencies
- `images/`: photo and icon assets.
- `vendor/`: Composer autoload and package files.
- `yas_milktea_house.sql`: SQL dump for database schema.

---

## 4. Public-Facing Pages

### `index.html`
- The marketing homepage.
- Contains a fixed navbar, hero section, value propositions, product highlights, and links to menu and promotions.
- Uses the shared `.navbar`, buttons, and layout classes.

### `aboutUs.html`
- Brand story page.
- Contains a full-screen hero image and content sections describing the business.

### `customerAboutUs.html`
- Customer-facing version of the about page.
- Uses the same general layout but with customer navigation.

### `menu.php`
- Server-side menu page.
- Likely fetches product categories and items from the backend.
- Includes interactive filtering and search features.

### `PrivacyPolicy.html` and `T&C.html`
- Legal pages.
- Present policies and terms in a simple readable layout.

### `404.html` and `500.html`
- Error pages for not-found and server error states.
- Provide friendly messages and a button to return home.

### `addToCart.html` and `confirmOrder.html`
- Shopping cart and checkout pages.
- Display selected items, totals, and order confirmation flows.
- Confirm order likely shows a final review and submission UI.

### `items.html`
- Likely a standalone item or category page.

---

## 5. Customer Account Pages

The customer account pages are protected by session checks and display user-specific data.

### `customerAccount.php`
- Main customer dashboard layout.
- Includes `account-sidebar.php` to show account navigation.
- Loads user data from PHP queries and the DB.
- Shows overview cards, quick actions, and a user greeting.

### `customerAccountProfile.php`
- Profile page for picture upload and username updates.
- Likely includes forms for avatar updates and display.

### `customerAccountPersonal.php`
- Personal details page.
- Contains forms for name, email, contact number, and date of birth.

### `customerAccountOrders.php`
- Order history page.
- Shows past orders, statuses, totals, and item details.

### `customerAccountPayments.php`
- Payment methods page.
- Likely contains placeholders for payment management.

### `customerAccountAddresses.php`
- Address management page.
- Displays saved addresses.
- Provides add/edit modal forms.
- Allows setting one address as primary.

### `account-sidebar.php`
- Shared sidebar included in all customer account pages.
- Contains navigation links for the account modules.
- Also contains the cart button and user menu.

### `account-module.js`
- JavaScript that controls all customer account behavior.
- Handles module switching, API calls, form submissions, address CRUD, and profile syncing.
- Central to dynamic interactions on the account pages.

### `account-common.php`
- Shared PHP include that:
  - requires the user to be logged in,
  - redirects admins to admin pages,
  - fetches user and address data,
  - computes member since date,
  - generates a CSRF token.
- Makes it easier to keep account pages consistent.

---

## 6. Admin Dashboard Pages

The admin pages are a set of HTML dashboards with consistent top bar/navigation styling.

### `adminDashboard.html`
- Main admin landing page.
- Shows system stats and a dashboard overview.

### `adminProducts.html`
- Product management page.
- Contains a table of products and an Add Product button.
- Uses `ADMIN-PRODUCTS-TOOLS` and `ADMIN-ADD-BUTTON` classes.

### `adminOrders.html`
- Order management page.
- Displays order status, order details, and action buttons.

### `adminCustomers.html`
- Customer/user management page.
- Shows user lists and controls for status or roles.

### `adminPayments.html`
- Payment status management page.

### `adminArchive.html`
- Archive or historical data page.

### Shared admin layout
- All admin pages use CSS classes like `ADMIN-TOPBAR`, `ADMIN-USER`, and `ADMIN-ADD-BUTTON`.
- They share a similar top toolbar and navigation style.
- JavaScript in `script.js` adds dropdown and mobile nav behavior.

---

## 7. Backend API and Server-Side Scripts

### `api/db.php`
- Defines database settings and creates a PDO connection.
- Uses `PDO::ATTR_ERRMODE_EXCEPTION` for error handling.
- Exits with JSON if the connection fails.
- This file is included by all API scripts that need a DB.

### `api/session_config.php`
- Configures PHP sessions.
- Ensures session lifetime and security settings are applied.
- Used by account and API scripts.

### `api/csrf.php` and `api/get_csrf_token.php`
- Provide CSRF protection.
- `csrf.php` usually defines helper functions to generate and validate tokens.
- `get_csrf_token.php` returns a token for client-side requests.

### Authentication and session helpers
- `loginSignUp.php` itself contains the UI but client-side login/signup JS communicates with backend login APIs.
- `api/check_session.php` verifies whether a session is still valid.
- `session_check.php` can be used for client redirects if session expired.

### Customer account API
- `api/get_account_data.php`: returns user profile, primary address, order stats, and recent order summary.
- `api/update_account.php`: updates customer information, email, password, and username.
- `api/update_profile_picture.php`: handles image upload and updates the user's profile picture.
- `api/manage_addresses.php`: gets/adds/edits/deletes user addresses.
- `api/get_user_orders.php`: returns order history and order details.

### Admin API and product/order management
- `api/get_products.php`: fetches product lists for admin and possibly frontend menus.
- `api/get_product_details.php`: returns a single product's details.
- `api/add_product.php`: creates a new product record.
- `api/update_product.php`: updates existing product information.
- `api/delete_product.php`: removes a product.
- `api/get_orders.php`: fetches orders.
- `api/update_order_status.php`: changes order status.
- `api/get_payments.php`: fetches payment transactions.
- `api/update_payment_status.php`: updates payment status.
- `api/get_customers.php`: fetches customer records.
- `api/get_admin_data.php`: returns admin user-related data.
- `api/update_user_role.php` and `api/update_user_status.php`: manage user roles and account statuses.

### Other support endpoints
- `api/place_order.php`: used by checkout to store a new order and associated items.
- `api/send_welcome_email.php`: sends an email when accounts are created.
- `api/remove_profile_picture.php`: deletes a user's avatar file and resets it.
- `api/account_setup.php`: creates or alters database schema for the account system.
- `api/get_categories.php`: returns menu categories.

### Utilities
- `check_db.php`: likely a developer utility for testing connectivity.
- `update_db.php` / `update_default.php`: used to apply schema or data updates.
- `verify_email.php`: probably handles email verification from signup.

---

## 8. Frontend JavaScript Behavior

### `script.js`
This is the main shared JavaScript file. It includes:
- helper selector functions (`qs`, `qsa`)
- debug utilities
- CSRF token retrieval
- profile/username synchronization for customer nav
- mobile navigation toggling and `aria-expanded` support
- user dropdown menu logic
- admin dropdown menu logic
- smooth scroll, back-to-top button, and navbar scroll behavior
- search and filter behavior for menus
- modal management
- order and cart UI behavior
- generic interactive page helpers

A few important patterns:
- `fetch()` is used for AJAX data requests.
- `classList.toggle('show')` is used to show/hide menus and modals.
- localStorage caches username/picture for slightly faster UI updates.
- unauthorized responses redirect users to login.

### `admin-profile.js`
- likely contains admin profile page logic for updating admin user data.
- supports profile picture, name changes, and account settings.

### `account-module.js`
- handles the account dashboard-specific logic that is not part of shared `script.js`.
- likely manages form submission and responses for personal details, password changes, address CRUD, and profile updates.
- likely includes validation and interactive element enabling/disabling.

---

## 9. Styling and Responsive Layout

### `style.css`
This is the single shared stylesheet used by most pages.
It includes:
- global reset and typography
- button variants: `.btn`, `.outline`, `.pink`, `.ORDER-BUTTON`, `.ADMIN-ADD-BUTTON`
- navigation styling (`.navbar`, `.nav-links`, `.menu-toggle`)
- customer account styles (`.ACCOUNT-GRID`, `.ACCOUNT-SIDEBAR`, `.ACCOUNT-MODULE`)
- admin dashboard styles (`.ADMIN-TOPBAR`, `.ADMIN-USER`, `.ADMIN-ADD-BUTTON`)
- responsive breakpoints for tablets and mobile devices
- error pages and modal styling
- hero and content sections for public pages

### Design system points
- dark background with pink accent colors for brand.
- consistent rounded cards and buttons.
- spacing and grid layouts create visual hierarchy.
- accessibility improvements: focus outlines, `aria-label`, hidden states.

### Responsive behavior
- The navbar switches to a mobile menu using `.menu-toggle`.
- Account pages collapse sidebar and grid columns on smaller viewports.
- Admin toolbars adapt their layout on tablets.

---

## 10. Security and Data Flow

### Authentication
- Users authenticate by logging in on `loginSignUp.php`.
- Sessions are stored server-side using PHP sessions.
- `account-common.php` and `api/check_session.php` protect authenticated interfaces.
- Admin pages redirect non-admin users away.

### Authorization
- Customer APIs use session user IDs to ensure the user can only access their own data.
- Admin APIs likely validate admin role before responding.

### Input validation and protection
- The backend should validate all inputs before writing to the database.
- The application uses CSRF tokens to protect POST actions.
- Password updates require the current password.

### Database security patterns
- The project uses PDO with prepared statements to prevent SQL injection.
- `api/db.php` sets `PDO::ATTR_ERRMODE_EXCEPTION`.

### Error handling
- The backend generally returns JSON responses and HTTP status codes.
- The frontend shows user-friendly messages on failure.
- Error pages (`404.html`, `500.html`) exist for full-page failures.

---

## 11. Technical Terms Glossary

### PHP
A server-side scripting language used to generate dynamic HTML, handle forms, and interact with the database.

### MySQL
A relational database used to store users, orders, products, addresses, and other data.

### PDO
PHP Data Objects: a database access abstraction layer used to securely query MySQL.

### Session
A server-side record that identifies a logged-in user across multiple page requests.

### CSRF
Cross-Site Request Forgery: an attack where unauthorized commands are transmitted from a user the website trusts. The project uses CSRF tokens to mitigate this.

### AJAX / fetch()
Asynchronous JavaScript requests from the browser to the server without reloading the page.

### Responsive design
A design approach that ensures the site works on desktops, tablets, and mobile devices.

### API endpoint
A PHP script that accepts requests and returns data or performs an action.

### Frontend
What the user sees and interacts with in the browser.

### Backend
Server-side logic that handles authentication, database access, and business rules.

---

## 12. Defense Talking Points

### Standout architecture points
- The app separates public, customer, and admin concerns clearly.
- Reusable shared files (`style.css`, `script.js`, `account-sidebar.php`, `api/db.php`) reduce duplication.
- Customer account pages use modular sections for profile, orders, addresses, and payments.
- Admin pages are organized around management flows: products, orders, customers, payments, promos, rewards.

### Why this design works
- PHP is a natural fit for small-to-medium web apps that need server-side rendering plus API access.
- Shared styles make the application cohesive.
- JavaScript keeps interactions smooth and prevents full page reloads when updating account data.
- Session and CSRF protections improve security.

### How to explain the code during defense
- Start from the user journey: landing page → login/signup → customer dashboard → account updates.
- Describe how `account-common.php` loads the current user and `api/db.php` connects to the database.
- Explain that `script.js` provides shared interactivity and `account-module.js` handles account-specific actions.
- Use the admin pages as examples of how frontend HTML and CSS are paired with backend API calls.

### What to memorize
- The main folder breakdown: root pages, `api/`, `images/`, `vendor/`.
- The purpose of `loginSignUp.php`, `customerAccount.php`, `adminProducts.html`, and `api/get_account_data.php`.
- The fact that PDO prepared statements are used for safe database queries.
- CSRF token generation and usage is an important security point.

---

## File Reference Summary

### Public pages and user flow files
- `index.html`: landing page with hero, value propositions, and navigation.
- `aboutUs.html`: brand story.
- `customerAboutUs.html`: alternate about page for logged-in users.
- `menu.php`: menu browsing and product display.
- `items.html`, `customerItems.html`: item listing pages.
- `addToCart.html`: cart and checkout experience.
- `confirmOrder.html`: order review and confirmation.
- `OrderSuccessful.html`: success page after order completion.
- `404.html`, `500.html`: error pages.

### Account system files
- `customerAccount.php`: main account overview page.
- `customerAccountProfile.php`: profile management.
- `customerAccountPersonal.php`: personal details editing.
- `customerAccountOrders.php`: order history.
- `customerAccountPayments.php`: payment methods placeholder.
- `customerAccountAddresses.php`: full address CRUD.
- `account-sidebar.php`: shared account navigation.
- `account-common.php`: authentication and user data loader.
- `account-module.js`: account page interactions.

### Authentication and utility files
- `loginSignUp.php`: login/signup UI and JS logic.
- `verify_email.php`: email verification.
- `session_check.php`: session validation helper.
- `check_db.php`: DB connectivity tester.

### Admin pages
- `adminDashboard.html`: admin landing page.
- `adminProducts.html`: product admin.
- `adminOrders.html`: order admin.
- `adminCustomers.html`: customer admin.
- `adminPayments.html`: payments admin.
- `adminArchive.html`: archived data.

### Shared assets
- `style.css`: main stylesheet.
- `script.js`: shared JS utilities.
- `admin-profile.js`: admin profile interactions.

### Backend `api/` summary
- `api/db.php`: DB connection.
- `api/session_config.php`: session management.
- `api/csrf.php`, `api/get_csrf_token.php`: CSRF protection.
- `api/check_session.php`: verify logged-in status.
- `api/get_account_data.php`: fetch current user data.
- `api/update_account.php`: update account info.
- `api/update_profile_picture.php`: upload avatar.
- `api/manage_addresses.php`: address CRUD.
- `api/get_user_orders.php`: fetch order history.
- `api/get_products.php`: get product list.
- `api/get_product_details.php`: get one product.
- `api/add_product.php`: create product.
- `api/update_product.php`: update product.
- `api/delete_product.php`: delete product.
- `api/get_orders.php`: fetch orders.
- `api/update_order_status.php`: change order status.
- `api/get_payments.php`: fetch payments.
- `api/update_payment_status.php`: update payment records.
- `api/get_customers.php`: customer data.
- `api/get_admin_data.php`: admin user data.
- `api/update_user_role.php`, `api/update_user_status.php`: manage user role/status.
- `api/place_order.php`: place a customer order.
- `api/send_welcome_email.php`: send welcome email.
- `api/remove_profile_picture.php`: remove user avatar.
- `api/account_setup.php`: DB schema setup and migration helper.
- `api/get_categories.php`: product categories.
- `api/mail_config.example.php`: email configuration example.

### Dependency folder
- `vendor/`: Composer autoload and package metadata. It is generated code used by PHP dependencies.

---

## How to Use This Guide

- Read the first sections to understand the app's architecture and user flows.
- Use the file reference summary when asked about specific pages or endpoints.
- Review the glossary section to explain technical terms clearly.
- During defense, mention the separation of concerns between frontend, backend, and API layers.
- Highlight security features: sessions, CSRF tokens, prepared statements, and role-based redirection.

---

## Notes for Defense

- Emphasize that the app is built with reusable shared assets.
- Explain that `script.js` is the central interaction layer while `account-module.js` is specialized for account management.
- If asked about dynamic data, point to the API endpoints and how they return JSON.
- If asked about database structure, mention the use of `orders`, `order_items`, `products`, `users`, and `addresses` tables.
- If asked about design, explain the consistent color palette, spacing, and responsive navigation.

---

## Optional Next Step

If you want, I can also generate a `PROJECT_DEFENSE_GUIDE.docx` version from this markdown so you have a Word document ready to open.
