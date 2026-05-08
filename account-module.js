document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded - Starting account module initialization');
    
    // ==================== INITIALIZE PROFILE PICTURE & USERNAME ====================
    const profilePicPreview = document.getElementById('profilePicPreview');
    const navUsername = document.getElementById('navUsername');
    
    if (profilePicPreview && profilePicPreview.src) {
        // Store current profile picture in localStorage on page load
        const currentProfilePic = profilePicPreview.src;
        if (currentProfilePic && !currentProfilePic.includes('default-avatar.png') && !currentProfilePic.includes('yas_logo.png')) {
            localStorage.setItem('userProfilePicture', currentProfilePic);
        } else {
            localStorage.removeItem('userProfilePicture');
        }
    }
    
    if (navUsername && navUsername.textContent) {
        // Store current username in localStorage
        localStorage.setItem('userName', navUsername.textContent);
    }

    const profilePictureInput = document.getElementById('profilePictureInput');
    const navProfilePic = document.getElementById('navProfilePic');
    const overviewProfilePic = document.getElementById('overviewProfilePic');

    console.log('Body classes:', document.body.className);
    const isOrdersPage = document.body.classList.contains('account-orders-page');
    const isAddressesPage = document.body.classList.contains('account-addresses-page');
    console.log('Page detection:', { isOrdersPage, isAddressesPage });

    if (isOrdersPage) {
        console.log('Orders page detected');
        loadOrderHistory();
    }

    if (isAddressesPage) {
        console.log('Address page detected, calling loadAddresses...');
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            loadAddresses();
        }, 100);
    }

    // ==================== PROFILE PICTURE UPLOAD ====================

    if (profilePictureInput) {
        profilePictureInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('profile_picture', file);

            try {
                const response = await fetch('api/update_profile_picture.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    // Update all profile pictures
                    const newImagePath = data.profile_picture;
                    if (profilePicPreview) profilePicPreview.src = newImagePath;
                    if (navProfilePic) navProfilePic.src = newImagePath;
                    if (overviewProfilePic) overviewProfilePic.src = newImagePath;
                    
                    // Store in localStorage for sync across pages
                    localStorage.setItem('userProfilePicture', newImagePath);
                    
                    alert('Profile picture updated successfully!');
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                alert('Error uploading file: ' + error.message);
            }
        });
    }

    // ==================== REMOVE PROFILE PICTURE ====================
    document.addEventListener('click', async (e) => {
        if (e.target && e.target.id === 'removeProfilePicBtn') {
            if (!confirm('Are you sure you want to remove your profile picture?')) return;

            try {
                const response = await fetch('api/remove_profile_picture.php', {
                    method: 'POST'
                });

                const data = await response.json();

                if (data.success) {
                    // Reset to default/placeholder
                    const defaultPic = data.profile_picture;
                    if (profilePicPreview) profilePicPreview.src = defaultPic;
                    if (navProfilePic) navProfilePic.src = defaultPic;
                    if (overviewProfilePic) overviewProfilePic.src = defaultPic;
                    
                    // Update localStorage
                    localStorage.removeItem('userProfilePicture');
                    
                    alert('Profile picture removed successfully!');
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                alert('Error removing profile picture: ' + error.message);
            }
        }
    });

    // ==================== USERNAME UPDATE ====================
    const usernameForm = document.getElementById('usernameForm');
    if (usernameForm) {
        usernameForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newUsername = document.getElementById('username').value;

            try {
                const response = await fetch('api/update_account.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'update_username',
                        username: newUsername
                    })
                });

                const data = await response.json();

                if (data.success) {
                    // Update localStorage and UI
                    localStorage.setItem('userName', newUsername);
                    
                    // Update nav username
                    const navUsername = document.getElementById('navUsername');
                    if (navUsername) navUsername.textContent = newUsername;
                    
                    // Update overview username
                    const overviewUsername = document.getElementById('overviewUsername');
                    if (overviewUsername) overviewUsername.textContent = newUsername;
                    
                    alert('Username updated successfully! Note: You will need to use this new username when logging in again.');
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }

    // ==================== PASSWORD CHANGE ====================
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const oldPassword = document.getElementById('oldPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword !== confirmPassword) {
                alert('New passwords do not match!');
                return;
            }

            try {
                const response = await fetch('api/update_account.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'change_password',
                        old_password: oldPassword,
                        new_password: newPassword,
                        confirm_password: confirmPassword
                    })
                });

                const data = await response.json();

                if (data.success) {
                    alert('Password changed successfully!');
                    passwordForm.reset();
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }

    // ==================== PERSONAL DETAILS ====================
    const personalDetailsForm = document.getElementById('personalDetailsForm');
    if (personalDetailsForm) {
        personalDetailsForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const contactNumber = document.getElementById('contactNumber').value;
            const dateOfBirth = document.getElementById('dateOfBirth').value;

            try {
                // Update profile info
                let response = await fetch('api/update_account.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'update_profile',
                        full_name: fullName,
                        contact_number: contactNumber,
                        date_of_birth: dateOfBirth
                    })
                });

                let data = await response.json();
                if (!data.success) {
                    alert('Error updating profile: ' + data.message);
                    return;
                }

                // Update email if changed
                if (email !== document.getElementById('email').defaultValue) {
                    response = await fetch('api/update_account.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'update_email',
                            email: email
                        })
                    });

                    data = await response.json();
                    if (data.success) {
                        alert('Personal details updated! You will need to log in again with your new email if it was changed.');
                        window.location.href = 'index.html';
                        return;
                    } else {
                        alert('Error updating email: ' + data.message);
                    }
                }

                alert('Personal details updated successfully!');
                // Update overview section
                document.getElementById('overviewFullName').textContent = fullName || 'Not set';
                document.getElementById('overviewEmail').textContent = email;
                document.getElementById('overviewContact').textContent = contactNumber || 'Not set';
                if (dateOfBirth) {
                    const date = new Date(dateOfBirth);
                    document.getElementById('overviewDOB').textContent = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                }

            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }

    // ==================== ORDER HISTORY ====================
    async function loadOrderHistory() {
        const container = document.getElementById('ordersContainer');

        try {
            const response = await fetch('api/get_user_orders.php');
            const data = await response.json();

            if (!data.success) {
                container.innerHTML = '<div style="text-align: center; padding: 40px;"><p>Error loading orders</p></div>';
                return;
            }

            if (data.orders.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 40px;"><p>No orders found</p></div>';
                return;
            }

            let html = '<div class="ACCOUNT-ORDER-TABLE"><div class="ACCOUNT-ORDER-ROW ACCOUNT-ORDER-HEAD"><span>ORDER ID</span><span>DATE</span><span>ITEMS</span><span>TOTAL</span><span>STATUS</span></div>';

            data.orders.forEach(order => {
                if (!order.order_date || order.order_date === '0000-00-00 00:00:00') return;
                
                const statusClass = order.status.toLowerCase();
                html += `
                    <div class="ACCOUNT-ORDER-ROW">
                        <span>${order.order_display_id || order.order_id}</span>
                        <span>${order.formatted_date}</span>
                        <span>${order.items ? order.items.substring(0, 40) + (order.items.length > 40 ? '...' : '') : 'N/A'}</span>
                        <span>₱${parseFloat(order.total_amount).toFixed(2)}</span>
                        <span class="ACCOUNT-STATUS ${statusClass}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </div>
                `;
            });

            html += '</div>';
            container.innerHTML = html;

        } catch (error) {
            container.innerHTML = '<div style="text-align: center; padding: 40px;"><p>Error loading orders: ' + error.message + '</p></div>';
        }
    }

    // ==================== ADDRESSES ====================
    if (isAddressesPage) {
        let currentAddressId = null;

        const addressModal = document.getElementById('addressModal');
        const addressForm = document.getElementById('addressForm');
        const addAddressBtn = document.getElementById('addAddressBtn');
        const closeAddressModal = document.getElementById('closeAddressModal');
        const deleteAddressBtn = document.getElementById('deleteAddressBtn');
        const completeAddressInput = document.getElementById('completeAddress');

        // Function to format complete address from address object
        function formatCompleteAddress(address) {
            const houseNumber = address.house_no || '';
            const street = address.street || '';
            const barangay = address.barangay || '';
            const city = address.city || '';
            const province = address.province || '';

            let completeAddress = '';
            if (houseNumber) completeAddress += houseNumber;
            if (street) completeAddress += (completeAddress ? ' ' : '') + street + ' street';
            if (barangay) completeAddress += (completeAddress ? ', ' : '') + 'Barangay ' + barangay;
            if (city) completeAddress += (completeAddress ? ', ' : '') + city;
            if (province) completeAddress += (completeAddress ? ', ' : '') + province;

            return completeAddress;
        }

        // Function to update complete address display
        function updateCompleteAddress() {
            const houseNumber = document.getElementById('houseNumber').value.trim();
            const street = document.getElementById('street').value.trim();
            const barangay = document.getElementById('barangay').value.trim();
            const city = document.getElementById('city').value.trim();
            const province = document.getElementById('province').value.trim();

            let completeAddress = '';
            if (houseNumber) completeAddress += houseNumber;
            if (street) completeAddress += (completeAddress ? ' ' : '') + street + ' street';
            if (barangay) completeAddress += (completeAddress ? ', ' : '') + 'Barangay ' + barangay;
            if (city) completeAddress += (completeAddress ? ', ' : '') + city;
            if (province) completeAddress += (completeAddress ? ', ' : '') + province;

            if (completeAddressInput) completeAddressInput.value = completeAddress;
        }

        // Debug: Check if elements exist
        console.log('Checking for address elements...');
        console.log('Address elements:', {
            addressModal: !!addressModal,
            addressForm: !!addressForm,
            addAddressBtn: !!addAddressBtn,
            closeAddressModal: !!closeAddressModal,
            deleteAddressBtn: !!deleteAddressBtn
        });

        if (addAddressBtn && addressForm && addressModal && closeAddressModal && deleteAddressBtn) {
            console.log('All address elements found, setting up event listeners...');
            addAddressBtn.addEventListener('click', () => {
                console.log('Add address button clicked');
                currentAddressId = null;
                const modalTitle = document.getElementById('addressModalTitle');
                if (modalTitle) modalTitle.textContent = 'Add New Address';
                addressForm.reset();
                if (completeAddressInput) completeAddressInput.value = '';
                const addressIdInput = document.getElementById('addressId');
                if (addressIdInput) addressIdInput.value = '';
                deleteAddressBtn.style.display = 'none';
                addressModal.classList.add('show');
            });

            // Add real-time update listeners to address fields
            ['houseNumber', 'street', 'barangay', 'city', 'province'].forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.addEventListener('input', updateCompleteAddress);
                    field.addEventListener('change', updateCompleteAddress);
                }
            });

            closeAddressModal.addEventListener('click', () => {
                addressModal.classList.remove('show');
            });

            addressModal.addEventListener('click', (e) => {
                if (e.target === addressModal) {
                    addressModal.classList.remove('show');
                }
            });

            addressForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const addressId = document.getElementById('addressId').value;
                const action = addressId ? 'update' : 'add';

                const houseNumber = document.getElementById('houseNumber').value.trim();
                const street = document.getElementById('street').value.trim();
                const barangay = document.getElementById('barangay').value.trim();
                const city = document.getElementById('city').value.trim();
                const province = document.getElementById('province').value.trim();
                const compiledAddressLine = completeAddressInput ? completeAddressInput.value.trim() : [houseNumber, street, barangay, city, province].filter(Boolean).join(', ');

                const payload = {
                    action: action,
                    address_id: addressId,
                    address_type: document.getElementById('addressType').value,
                    house_no: houseNumber,
                    street: street,
                    barangay: barangay,
                    city: city,
                    province: province,
                    address_line: compiledAddressLine,
                    landmark: document.getElementById('landmark').value,
                    delivery_instructions: document.getElementById('deliveryInstructions').value,
                    is_primary: document.getElementById('isPrimary').checked ? 1 : 0
                };

                try {
                    const response = await fetch('api/manage_addresses.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const data = await response.json();

                    if (data.success) {
                        alert('Address ' + (action === 'add' ? 'added' : 'updated') + ' successfully!');
                        addressModal.classList.remove('show');
                        loadAddresses();
                        // If set as primary, update overview
                        if (document.getElementById('isPrimary').checked) {
                            const overviewAddress = document.getElementById('overviewAddress');
                            const overviewLandmark = document.getElementById('overviewLandmark');
                            const overviewInstructions = document.getElementById('overviewInstructions');
                            if (overviewAddress) overviewAddress.textContent = compiledAddressLine;
                            if (overviewLandmark) overviewLandmark.textContent = document.getElementById('landmark').value || 'Not set';
                            if (overviewInstructions) overviewInstructions.textContent = document.getElementById('deliveryInstructions').value || 'None';
                        }
                    } else {
                        alert('Error: ' + data.message);
                    }
                } catch (error) {
                    alert('Error: ' + error.message);
                }
            });

            deleteAddressBtn.addEventListener('click', async () => {
                if (!confirm('Are you sure you want to delete this address?')) return;

                try {
                    const response = await fetch('api/manage_addresses.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'delete',
                            address_id: document.getElementById('addressId').value
                        })
                    });

                    const data = await response.json();

                    if (data.success) {
                        alert('Address deleted successfully!');
                        addressModal.classList.remove('show');
                        loadAddresses();
                    } else {
                        alert('Error: ' + data.message);
                    }
                } catch (error) {
                    alert('Error: ' + error.message);
                }
            });
        }

        async function loadAddresses() {
            console.log('loadAddresses function called');
            const container = document.getElementById('addressesList');
            console.log('Container found:', !!container);

            try {
                console.log('Making API call to manage_addresses.php');
                const response = await fetch('api/manage_addresses.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'get_all' })
                });
                console.log('API response status:', response.status);

                if (!response.ok) {
                    console.error(`HTTP error loading addresses: ${response.status}`);
                    return;
                }

                const data = await response.json();

                if (!data.success) {
                    console.error('API Error:', data.message);
                    return;
                }

                if (data.addresses.length === 0) {
                    container.innerHTML = '<div style="text-align: center; padding: 40px;"><p>No addresses added yet. Click "Add New Address" to get started!</p></div>';
                    return;
                }

                let html = '';
                data.addresses.forEach(address => {
                    const completeAddressDisplay = formatCompleteAddress(address);
                    const isPrimaryBtn = address.is_primary ? '' : `<button type="button" class="btn outline small" onclick="setAsPrimary(${address.address_id})">SET AS PRIMARY</button>`;
                    
                    html += `
                        <article class="ACCOUNT-DETAIL-CARD">
                            <div class="ACCOUNT-CARD-HEADER">
                                <h4>${address.address_type.charAt(0).toUpperCase() + address.address_type.slice(1)}${address.is_primary ? ' <span style="color: #ff5eb3;">(Primary)</span>' : ''}</h4>
                                <div style="display: flex; gap: 10px;">
                                    <button class="btn outline small" onclick="editAddress(${address.address_id})">EDIT</button>
                                    ${isPrimaryBtn}
                                </div>
                            </div>
                            <div class="ACCOUNT-CARD-BODY">
                                <div><span>Address</span><strong>${completeAddressDisplay}</strong></div>
                                <div><span>Landmark</span><strong>${address.landmark || 'Not set'}</strong></div>
                                <div><span>Instructions</span><strong>${address.delivery_instructions || 'None'}</strong></div>
                            </div>
                        </article>
                    `;
                });

                container.innerHTML = html;

            } catch (error) {
                console.error('Error loading addresses:', error);
                // Keep server-rendered content if available instead of clearing it.
            }
        }

        window.editAddress = async (addressId) => {
            try {
                const response = await fetch('api/manage_addresses.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'get_all' })
                });

                const data = await response.json();
                const address = data.addresses.find(a => a.address_id == addressId);

                if (address) {
                    document.getElementById('addressModalTitle').textContent = 'Edit Address';
                    document.getElementById('addressId').value = address.address_id;
                    document.getElementById('addressType').value = address.address_type;
                    document.getElementById('houseNumber').value = address.house_no || '';
                    document.getElementById('street').value = address.street || '';
                    document.getElementById('barangay').value = address.barangay || '';
                    document.getElementById('city').value = address.city || '';
                    document.getElementById('province').value = address.province || '';
                    document.getElementById('landmark').value = address.landmark || '';
                    document.getElementById('deliveryInstructions').value = address.delivery_instructions || '';
                    document.getElementById('isPrimary').checked = address.is_primary;
                    updateCompleteAddress();
                    deleteAddressBtn.style.display = 'block';
                    addressModal.classList.add('show');
                }
            } catch (error) {
                alert('Error loading address: ' + error.message);
            }
        };

        window.setAsPrimary = async (addressId) => {
            try {
                const response = await fetch('api/manage_addresses.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'set_primary',
                        address_id: addressId
                    })
                });

                const data = await response.json();

                if (data.success) {
                    alert('Primary address updated!');
                    loadAddresses();
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        };

    } else {
        console.error('Some address elements are missing. Button functionality disabled.');
        // Fallback: Add basic click handler to add address button
        if (addAddressBtn) {
            console.log('Setting up fallback button handler');
            addAddressBtn.addEventListener('click', () => {
                console.log('Fallback button clicked');
                // Try to manually set up modal
                const modal = document.getElementById('addressModal');
                const form = document.getElementById('addressForm');
                if (modal && form) {
                    console.log('Modal and form found, showing modal');
                    form.reset();
                    modal.classList.add('show');
                } else {
                    alert('Address form elements are missing. Please refresh the page and try again.');
                }
            });
        }
    }

    // Also try to set up the button after a delay as a backup
    setTimeout(() => {
        const btn = document.getElementById('addAddressBtn');
        const modal = document.getElementById('addressModal');
        const form = document.getElementById('addressForm');
        if (btn && modal && form) {
            console.log('Backup button setup triggered');
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Backup button clicked');
                form.reset();
                modal.classList.add('show');
            });
        }
    }, 500);

    // ==================== CONTACT SUPPORT ====================
    const contactSupportBtn = document.getElementById('contactSupportBtn');
    if (contactSupportBtn) {
        contactSupportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://www.facebook.com/yas.elizalde.7', '_blank');
        });
    }

});
