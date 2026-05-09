// ===================== ADMIN PROFILE MODULE =====================
// Shared across all admin pages to dynamically display admin data

const AdminProfile = (() => {
  'use strict';

  // -------- helpers --------
  const qs = (sel, ctx = document) => ctx?.querySelector(sel) ?? null;
  const qsa = (sel, ctx = document) => ctx ? Array.from(ctx.querySelectorAll(sel)) : [];

  // -------- DOM references (populated on init) --------
  let elements = {};

  // -------- cached admin data --------
  let adminData = null;

  /**
   * Fetch the logged-in admin's data from the server.
   * Falls back to a minimal cached version if available.
   */
  const fetchAdminData = async () => {
    try {
      console.log('Fetching admin data from server...');
      const resp = await fetch('api/get_admin_data.php');
      console.log('Response status:', resp.status);
      
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
      
      const data = await resp.json();
      console.log('Server response:', data);

      if (data.success && data.user) {
        console.log('Admin data loaded successfully:', data.user);
        adminData = data.user;
        localStorage.setItem('adminData', JSON.stringify(data.user));
        return data.user;
      } else {
        console.log('Server returned error:', data.message || 'Unknown error');
      }
      
      // fallback
      const cached = localStorage.getItem('adminData');
      if (cached) {
        console.log('Using cached data as fallback');
        adminData = JSON.parse(cached);
        return adminData;
      }
      console.log('No cached data available');
      return null;
    } catch (err) {
      console.error('Error fetching admin data:', err);
      const cached = localStorage.getItem('adminData');
      if (cached) {
        console.log('Using cached data due to error');
        adminData = JSON.parse(cached);
        return adminData;
      }
      console.log('No cached data available and error occurred');
      return null;
    }
  };

  /**
   * Get session data via API call as emergency fallback.
   */
  const getSessionFromAPI = async () => {
    try {
      console.log('Fetching session data from session_check.php...');
      const resp = await fetch('session_check.php');
      const data = await resp.json();
      
      if (data.success && data.user) {
        console.log('Session data fetched successfully:', data.user);
        return data.user;
      } else {
        console.log('Session API returned error:', data.message);
        return null;
      }
    } catch (err) {
      console.error('Error fetching session data from API:', err);
      return null;
    }
  };

  /**
   * Fetch admin data from session as fallback when API fails.
   */
  const fetchSessionData = async () => {
    try {
      const resp = await fetch('api/get_admin_data.php');
      const data = await resp.json();
      
      if (data.success && data.user) {
        return data.user;
      }
      return null;
    } catch (err) {
      console.error('Session data fetch failed:', err);
      return null;
    }
  };

  /**
   * Update all DOM elements that display admin info.
   */
  const updateUI = (user) => {
    if (!user) return;

    console.log('Updating UI with user data:', user);
    console.log('Elements found:', {
      adminUserName: elements.adminUserName?.length || 0,
      welcomeMsg: elements.welcomeMsg?.length || 0,
      sidebarName: elements.sidebarName?.length || 0,
      sidebarRole: elements.sidebarRole?.length || 0,
      adminAvatar: elements.adminAvatar?.length || 0
    });

    const username = user.username || 'Admin';
    const fullName = user.full_name && user.full_name !== 'null' ? user.full_name : username;
    const role     = (user.role || 'admin').toUpperCase();
    const profilePic = user.profile_picture || null;

    // --- Top bar username (ADMIN-USER span) ---
    elements.adminUserName.forEach(el => { 
      console.log('Updating username element:', el, 'to:', username);
      el.textContent = username; 
    });

    // --- Welcome message (ADMIN-INTRO p) ---
    elements.welcomeMsg.forEach(el => { el.textContent = `Welcome back, ${fullName}!`; });

    // --- Sidebar name & role (ADMIN-BRAND-TEXT) ---
    elements.sidebarName.forEach(el => { el.textContent = fullName; });
    elements.sidebarRole.forEach(el => { el.textContent = role; });

    // --- Profile picture in top bar ---
    elements.adminAvatar.forEach(el => {
      const existingImg = qs('img', el);
      if (profilePic && !profilePic.includes('yas_logo.png')) {
        if (!existingImg) {
          el.innerHTML = '';
          const img = document.createElement('img');
          img.alt = username;
          img.style.cssText = 'width: 32px; height: 32px; border-radius: 50%; object-fit: cover;';
          el.appendChild(img);
        }
        qs('img', el).src = profilePic;
      } else {
        if (existingImg) {
          existingImg.remove();
        }
        if (!qs('i', el)) {
          const icon = document.createElement('i');
          icon.className = 'fa-regular fa-user';
          el.innerHTML = '';
          el.appendChild(icon);
        }
      }
    });

    // --- Account modal form fields ---
    if (elements.accountUsername) {
      elements.accountUsername.value = user.username || '';
    }
    if (elements.accountFullName) {
      elements.accountFullName.value = user.full_name || '';
    }
    if (elements.accountPreviewImg && profilePic && !profilePic.includes('yas_logo.png')) {
      elements.accountPreviewImg.src = profilePic;
      elements.accountPreviewImg.style.display = 'block';
      if (elements.accountPreviewPlaceholder) {
        elements.accountPreviewPlaceholder.style.display = 'none';
      }
    } else if (elements.accountPreviewImg) {
      elements.accountPreviewImg.style.display = 'none';
      if (elements.accountPreviewPlaceholder) {
        elements.accountPreviewPlaceholder.style.display = 'flex';
      }
    }
  };

  /**
   * Open the account settings modal.
   */
  const openAccountModal = () => {
    const modal = qs('#admin-account-modal');
    if (!modal) return;

    // Refresh data into the form
    const user = adminData || JSON.parse(localStorage.getItem('adminData') || 'null');
    if (user) {
      if (elements.accountUsername) elements.accountUsername.value = user.username || '';
      if (elements.accountFullName) elements.accountFullName.value = user.full_name || '';
      if (elements.accountPreviewImg && user.profile_picture && !user.profile_picture.includes('yas_logo.png')) {
        elements.accountPreviewImg.src = user.profile_picture;
        elements.accountPreviewImg.style.display = 'block';
        if (elements.accountPreviewPlaceholder) elements.accountPreviewPlaceholder.style.display = 'none';
      } else if (elements.accountPreviewImg) {
        elements.accountPreviewImg.style.display = 'none';
        if (elements.accountPreviewPlaceholder) elements.accountPreviewPlaceholder.style.display = 'flex';
      }
    }

    modal.hidden = false;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  /**
   * Close the account settings modal.
   */
  const closeAccountModal = () => {
    const modal = qs('#admin-account-modal');
    if (!modal) return;
    modal.hidden = true;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  /**
   * Validate and submit the account update form.
   */
  const handleAccountFormSubmit = async (event) => {
    event.preventDefault();

    const submitBtn = qs('#admin-account-submit');
    if (!submitBtn) return;

    const origText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    try {
      // Update username
      const newUsername = elements.accountUsername ? elements.accountUsername.value.trim() : '';
      if (newUsername && adminData && newUsername !== adminData.username) {
        const resp = await fetch('api/update_account.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'update_username', username: newUsername })
        });
        const data = await resp.json();
        if (!data.success) {
          alert(data.message || 'Failed to update username');
          submitBtn.disabled = false;
          submitBtn.textContent = origText;
          return;
        }
      }

      // Update full name
      const newFullName = elements.accountFullName ? elements.accountFullName.value.trim() : '';
      if (adminData) {
        const resp = await fetch('api/update_account.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_profile',
            full_name: newFullName || null,
            contact_number: adminData.contact_number || null,
            date_of_birth: null
          })
        });
        const data = await resp.json();
        if (!data.success) {
          alert(data.message || 'Failed to update profile');
          submitBtn.disabled = false;
          submitBtn.textContent = origText;
          return;
        }
      }

      // Upload profile picture if changed
      const fileInput = qs('#admin-account-picture-file');
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const formData = new FormData();
        formData.append('profile_picture', fileInput.files[0]);
        const resp = await fetch('api/update_profile_picture.php', {
          method: 'POST',
          body: formData
        });
        const data = await resp.json();
        if (!data.success) {
          alert(data.message || 'Failed to update profile picture');
          submitBtn.disabled = false;
          submitBtn.textContent = origText;
          return;
        }
      }

      // Refresh admin data
      const freshData = await fetchAdminData();
      if (freshData) {
        updateUI(freshData);
      }
      closeAccountModal();
      alert('Profile updated successfully!');
    } catch (err) {
      alert('An error occurred while saving. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = origText;
    }
  };

  /**
   * Preview selected profile picture in the modal.
   */
  const handlePicturePreview = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (elements.accountPreviewImg) {
        elements.accountPreviewImg.src = e.target.result;
        elements.accountPreviewImg.style.display = 'block';
        if (elements.accountPreviewPlaceholder) {
          elements.accountPreviewPlaceholder.style.display = 'none';
        }
      }
    };
    reader.readAsDataURL(file);
  };

  /**
   * Initialize the module: grab DOM refs, fetch data, update UI, set up events.
   */
  const init = () => {
    // Cache DOM references
    elements = {
      // Top bar
      adminUserName:       qsa('.ADMIN-USER > span'),
      adminAvatar:         qsa('.ADMIN-USER-AVATAR'),
      welcomeMsg:          qsa('.ADMIN-INTRO p'),

      // Sidebar
      sidebarName:         qsa('.ADMIN-BRAND-NAME'),
      sidebarRole:         qsa('.ADMIN-BRAND-ROLE'),

      // Account modal
      accountUsername:     qs('#admin-account-username'),
      accountFullName:     qs('#admin-account-fullname'),
      accountPreviewImg:   qs('#admin-account-preview-img'),
      accountPreviewPlaceholder: qs('#admin-account-preview-placeholder'),
    };

    // Add sidebar name/role elements if they don't exist
    const brandTexts = qsa('.ADMIN-BRAND-TEXT');
    brandTexts.forEach(el => {
      if (!qs('.ADMIN-BRAND-NAME', el)) {
        const nameEl = document.createElement('p');
        nameEl.className = 'ADMIN-BRAND-NAME';
        nameEl.style.cssText = 'font-size: 14px; font-weight: 600; color: #fff; line-height: 1.2;';
        el.insertBefore(nameEl, el.querySelector('p'));
      }
      if (!qs('.ADMIN-BRAND-ROLE', el)) {
        const roleEl = el.querySelector('p:last-child');
        if (roleEl) {
          roleEl.className = 'ADMIN-BRAND-ROLE';
          roleEl.style.cssText = 'font-size: 11px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px;';
        }
      }
      // Re-select after creating
      elements.sidebarName = qsa('.ADMIN-BRAND-NAME');
      elements.sidebarRole = qsa('.ADMIN-BRAND-ROLE');
    });

    // --- Fetch and display ---
    fetchAdminData().then(async user => {
      console.log('Admin data fetched:', user);
      if (user) {
        updateUI(user);
      } else {
        console.error('No admin data found, trying session API');
        // Fallback: Try to get session data from API
        const sessionData = await getSessionFromAPI();
        if (sessionData) {
          updateUI(sessionData);
        } else {
          console.error('No session data available either');
          // Check if we're on an admin page and redirect to login
          if (window.location.pathname.includes('admin')) {
            console.log('Redirecting to login due to no session');
            window.location.href = 'loginSignUp.html';
          } else {
            // Show error state
            updateUI({ username: 'Error', full_name: 'Session Error', role: 'error' });
          }
        }
      }
    });

    // --- Wire up "Account" button in user dropdown ---
    const accountBtns = qsa('.ADMIN-USER-DROPDOWN button');
    accountBtns.forEach(btn => {
      if (btn.textContent.trim() === 'Account' || btn.classList.contains('ADMIN-ACCOUNT-BTN')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openAccountModal();
        });
      }
    });

    // --- Account modal events ---
    const modal = qs('#admin-account-modal');
    if (modal) {
      // Close buttons
      qsa('[data-close-account-modal]', modal).forEach(el => {
        el.addEventListener('click', closeAccountModal);
      });
      // Click backdrop to close
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAccountModal();
      });
      // ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) closeAccountModal();
      });

      // Form submit
      const form = qs('#admin-account-form');
      if (form) {
        form.addEventListener('submit', handleAccountFormSubmit);
      }

      // File upload preview
      const fileInput = qs('#admin-account-picture-file');
      if (fileInput) {
        fileInput.addEventListener('change', handlePicturePreview);
      }

      // Upload button trigger
      const uploadBtn = qs('#admin-account-upload-btn');
      if (uploadBtn) {
        uploadBtn.addEventListener('click', () => fileInput?.click());
      }
    }

    // --- Listen for storage changes across tabs ---
    window.addEventListener('storage', (e) => {
      if (e.key === 'adminData') {
        adminData = JSON.parse(e.newValue || 'null');
        if (adminData) updateUI(adminData);
      }
    });
  };

  // Public API
  return { init, fetchAdminData, updateUI, openAccountModal, closeAccountModal };
})();

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => AdminProfile.init());