document.addEventListener("DOMContentLoaded", () => {
  // ===================== HELPER SELECTORS =====================
  const qs = (sel, ctx = document) => (ctx && ctx.querySelector ? ctx.querySelector(sel) : null);
  const qsa = (sel, ctx = document) => (ctx && ctx.querySelectorAll ? Array.from(ctx.querySelectorAll(sel)) : []);

  // ===================== PROFILE PICTURE & USERNAME SYNC =====================
  (function syncProfileAndUsername() {
    const userIcon = qs(".CUSTOMER-USER-ICON");
    const userLabel = qs(".CUSTOMER-USER-LABEL");
    if (!userIcon || !userLabel) return;

    const syncUserData = async () => {
      // Always fetch fresh data from server to prevent showing cached/old data
      try {
        const response = await fetch('api/get_account_data.php');
        const data = await response.json();
        if (data.success && data.user) {
          const profilePic = data.user.profile_picture || null;
          const username = data.user.username;
          
          // Update localStorage with fresh data
          localStorage.setItem('userName', username);
          if (profilePic && !profilePic.includes('yas_logo.png')) {
            localStorage.setItem('userProfilePicture', profilePic);
          } else {
            localStorage.removeItem('userProfilePicture');
          }
          
          // Update UI immediately
          updateProfileUI(profilePic, username);
        }
      } catch (error) {
        console.log('Could not fetch user data:', error);
        // Fallback to localStorage if server fails
        const profilePic = localStorage.getItem('userProfilePicture');
        const username = localStorage.getItem('userName');
        updateProfileUI(profilePic, username);
      }
    };

    const updateProfileUI = (profilePic, username) => {
      // Update profile picture
      let icon = userIcon.querySelector('img');
      if (profilePic && !profilePic.includes('default')) {
        if (!icon) {
          icon = document.createElement('img');
          icon.alt = 'Profile';
          icon.style.cssText = 'width: 24px; height: 24px; border-radius: 50%; object-fit: cover;';
          userIcon.innerHTML = '';
          userIcon.appendChild(icon);
        }
        icon.src = profilePic;
      } else {
        if (icon) {
          userIcon.innerHTML = '';
        }
        if (!userIcon.querySelector('i')) {
          const faIcon = document.createElement('i');
          faIcon.className = 'fa-regular fa-user';
          userIcon.innerHTML = '';
          userIcon.appendChild(faIcon);
        }
      }

      // Update username
      if (username) {
        userLabel.textContent = username;
      } else {
        userLabel.textContent = 'user';
      }
    };

    // Clear any stale cached data on page load
    const clearStaleCache = () => {
      const cachedUserId = localStorage.getItem('userId');
      const cachedUsername = localStorage.getItem('userName');
      
      // If cache exists but doesn't match current session, clear it
      if (cachedUsername) {
        console.log('Clearing potentially stale user cache');
        localStorage.removeItem('userProfilePicture');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
      }
    };

    clearStaleCache();
    syncUserData();

    // Listen for storage changes across tabs/windows
    window.addEventListener('storage', (e) => {
      if (e.key === 'userProfilePicture' || e.key === 'userName') {
        syncUserData();
      }
    });
  })();

// ===================== MOBILE NAV MENU ======================
  (function initMobileToggle() {
    const menuToggle = qs(".menu-toggle");
    const navLinks = qs(".nav-links");




if (!menuToggle || !navLinks) return;




const toggleNav = () => navLinks.classList.toggle("show");
    window.toggleMenu = toggleNav;




menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleNav();
    });




document.addEventListener("click", (event) => {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        navLinks.classList.remove("show");
      }
    });
  })();




// ===================== USER DROPDOWN MENU ======================
  (function initUserDropdown() {
    const userMenuToggle = qs("#userMenuToggle");
    const userDropdown = qs("#userDropdown");


    if (!userMenuToggle || !userDropdown) return;


    const replaceLegacyAccountLinks = () => {
      const oldLinks = userDropdown.querySelectorAll('a[href="customerAccount.html"], a[href="customerAccount.htm"]');
      oldLinks.forEach(link => link.href = "customerAccount.php");
    };

    // Add session validation for account links
    const validateAccountAccess = async (event) => {
      const accountLink = event.target.closest('a[href="customerAccount.php"]');
      if (!accountLink) return;
      
      event.preventDefault();
      
      try {
        const response = await fetch('api/check_session.php');
        const data = await response.json();
        
        if (data.success) {
          // Session is valid, proceed to account page
          window.location.href = 'customerAccount.php';
        } else {
          // Session is invalid, redirect to login
          window.location.href = data.redirect || 'loginSignUp.html';
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        // Fallback to direct navigation
        window.location.href = 'customerAccount.php';
      }
    };

    replaceLegacyAccountLinks();

    const toggleDropdown = (event) => {
      event.preventDefault();
      event.stopPropagation();
      userDropdown.classList.toggle("show");
      userMenuToggle.classList.toggle("open");
    };


    userMenuToggle.addEventListener("click", toggleDropdown);
    
    // Add click listener for account links with session validation
    userDropdown.addEventListener("click", validateAccountAccess);


    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (!userDropdown.contains(event.target) && !userMenuToggle.contains(event.target)) {
        userDropdown.classList.remove("show");
        userMenuToggle.classList.remove("open");
      }
    });
  })();




// ===================== ADMIN USER DROPDOWN MENU ======================
  (function initAdminUserDropdown() {
    const adminUser = qs(".ADMIN-USER");
    const adminMenuToggle = qs(".ADMIN-DROPDOWN-BUTTON", adminUser);
    const adminDropdown = qs(".ADMIN-USER-DROPDOWN", adminUser);


    if (!adminUser || !adminMenuToggle || !adminDropdown) return;


    const toggleDropdown = (event) => {
      if (adminDropdown.contains(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      adminDropdown.classList.toggle("show");
      adminMenuToggle.classList.toggle("open");
    };


    adminUser.addEventListener("click", toggleDropdown);


    document.addEventListener("click", (event) => {
      if (!adminUser.contains(event.target)) {
        adminDropdown.classList.remove("show");
        adminMenuToggle.classList.remove("open");
      }
    });
  })();




// ===================== ADMIN DASHBOARD STATS ======================
  (function initAdminDashboardStats() {
    const customerCount = qs("#admin-dashboard-customer-count");
    const orderCount = qs("#admin-dashboard-order-count");
    const productCount = qs("#admin-dashboard-product-count");
    const activeProductCount = qs("#admin-dashboard-active-product-count");
    const archivedProductCount = qs("#admin-dashboard-archived-product-count");
    const recentOrdersBody = qs("#admin-dashboard-recent-orders-body");


    if (!customerCount && !orderCount && !productCount && !recentOrdersBody) return;

    const toPeso = (amount) => `₱${Number(amount || 0)}`;
    const formatOrderId = (orderId) => `#ORD-${String(Number(orderId || 0)).padStart(4, "0")}`;
    const normalizeStatusClass = (statusValue) => {
      const status = String(statusValue || "pending").toLowerCase().trim();
      if (status === "cancelled" || status === "canceled") return "canceled";
      return status;
    };
    const toTitleStatus = (statusValue) => {
      const status = String(statusValue || "pending").toLowerCase().trim();
      if (status === "cancelled") return "Canceled";
      return status.charAt(0).toUpperCase() + status.slice(1);
    };

    fetch("api/get_dashboard_stats.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load dashboard stats.");
        }

        return response.json();
      })
      .then((result) => {
        if (!result.success) {
          throw new Error(result.message || "Dashboard stats unavailable.");
        }

        if (customerCount) customerCount.textContent = result.customer_count ?? 0;
        if (orderCount) orderCount.textContent = result.total_orders ?? 0;
        if (productCount) productCount.textContent = result.product_count ?? 0;
        if (activeProductCount) activeProductCount.textContent = result.active_product_count ?? 0;
        if (archivedProductCount) archivedProductCount.textContent = result.archived_product_count ?? 0;

        if (recentOrdersBody) {
          const recentOrders = Array.isArray(result.recent_orders) ? result.recent_orders : [];

          if (!recentOrders.length) {
            recentOrdersBody.innerHTML = `
              <tr>
                <td colspan="5">No recent orders yet.</td>
              </tr>
            `;
            return;
          }

          recentOrdersBody.innerHTML = recentOrders
            .map((order) => {
              const statusClass = normalizeStatusClass(order.status);
              const statusLabel = toTitleStatus(order.status);
              return `
                <tr>
                  <td>${formatOrderId(order.order_id)}</td>
                  <td>${order.username || "Guest"}</td>
                  <td>${order.items || "No items"}</td>
                  <td>${toPeso(order.total_amount)}</td>
                  <td><span class="ADMIN-STATUS ${statusClass}">${statusLabel}</span></td>
                </tr>
              `;
            })
            .join("");
        }
      })
      .catch(() => {
        if (customerCount) customerCount.textContent = "--";
        if (orderCount) orderCount.textContent = "--";
        if (productCount) productCount.textContent = "--";
        if (activeProductCount) activeProductCount.textContent = "--";
        if (archivedProductCount) archivedProductCount.textContent = "--";
        if (recentOrdersBody) {
          recentOrdersBody.innerHTML = `
            <tr>
              <td colspan="5">Unable to load recent orders.</td>
            </tr>
          `;
        }
      });
  })();




// ===================== BACK TO TOP BTN ======================
  (function initBackToTop() {
    const backToTop = qs("#back-to-top");




if (!backToTop) return;




const heroSection = qs(".hero");
    const navbar = qs(".navbar");




const updateVisibility = () => {
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const trigger = heroSection
        ? Math.max(120, heroSection.offsetHeight - navHeight)
        : 320;




backToTop.classList.toggle("show", window.scrollY > trigger);
    };




const goTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };




backToTop.addEventListener("click", goTop);
    backToTop.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        goTop();
      }
    });




window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    updateVisibility();
  })();




// ===================== HOME NAVBAR LOGO ======================
  (function initHomeNavbarLogo() {
    const body = document.body;
    const navbar = qs(".navbar");




if ((!body.classList.contains("home-page") && !body.classList.contains("promotions-page")) || !navbar) return;




const updateNavbarState = () => {
      navbar.classList.toggle("scrolled", window.scrollY > 24);
    };




window.addEventListener("scroll", updateNavbarState, { passive: true });
    window.addEventListener("resize", updateNavbarState);
    updateNavbarState();
  })();




// ===================== CUSTOMER PROMO ROUTE ======================
  (function initCustomerPromoRoute() {
    const body = document.body;
    const path = window.location.pathname.toLowerCase();

    if (!body.classList.contains("home-page") || !path.endsWith("/customerhomepage.html")) return;

    qsa(".PROMO-BUTTON").forEach((button) => {
      button.setAttribute("href", "customerPromotions.html");
    });
  })();




  // ===================== PROMO UPDATE CTA ======================
  (function initPromoUpdateCTA() {
    const updatesButton = qs("#get-updates-btn");
    if (!updatesButton) return;

    const showPromoToast = (message) => {
      let toast = qs("#promo-toast");

      if (!toast) {
        toast = document.createElement("div");
        toast.id = "promo-toast";
        toast.className = "promo-toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        document.body.appendChild(toast);
      }

      toast.textContent = message;
      toast.classList.add("show");
      window.clearTimeout(showPromoToast.timer);
      showPromoToast.timer = window.setTimeout(() => {
        toast.classList.remove("show");
      }, 2800);
    };

    updatesButton.addEventListener("click", (event) => {
      event.preventDefault();
      showPromoToast("The updates feature is still a work in progress. Thanks for your patience!");
    });
  })();



// ===================== PROMO SEARCH & FILTER ======================
  (function initPromoDirectory() {
    const filter = qs("#promo-filter");
    const filterLabel = qs("#promo-filter-label");
    const filterButtons = qsa(".promo-filter-menu button");
    const searchInput = qs("#promo-search");
    const promoCards = qsa(".promo-card");
    const emptyState = qs("#promo-empty-state");

    if (!filter || !filterLabel || !searchInput || !promoCards.length) return;

    let activeCategory = "all";

    const closeFilter = () => {
      filter.classList.remove("open");
      filter.setAttribute("aria-expanded", "false");
    };

    const toggleFilter = () => {
      const isOpen = filter.classList.toggle("open");
      filter.setAttribute("aria-expanded", String(isOpen));
    };

    const updateCards = () => {
      const query = searchInput.value.trim().toLowerCase();
      let visibleCount = 0;

      promoCards.forEach((card) => {
        const categories = (card.dataset.categories || card.dataset.category || "")
          .split(/\s+/)
          .filter(Boolean);
        const categoryMatches = activeCategory === "all" || categories.includes(activeCategory);

        const titleEl = qs("h2", card);
        const title = (titleEl?.textContent || "").trim().toLowerCase();
        const keywords = (card.dataset.keywords || "").toLowerCase();
        const body = (card.textContent || "").trim().toLowerCase();
        const haystack = `${title} ${keywords} ${body}`;
        const queryMatches = !query || haystack.includes(query);

        const isVisible = categoryMatches && queryMatches;
        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    };

    filter.addEventListener("click", (event) => {
      if (event.target.closest(".promo-filter-menu button")) return;
      event.stopPropagation();
      toggleFilter();
    });

    filter.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleFilter();
      }

      if (event.key === "Escape") {
        closeFilter();
      }
    });

    filterButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        activeCategory = button.dataset.category || "all";
        filterLabel.textContent = button.textContent;
        filterButtons.forEach((item) => item.classList.toggle("active", item === button));
        closeFilter();
        updateCards();
      });
    });

    searchInput.addEventListener("input", updateCards);

    document.addEventListener("click", (event) => {
      if (!filter.contains(event.target)) closeFilter();
    });

    updateCards();
  })();



// ===================== MENU PAGE LOGIC ======================
  (function initMenuPage() {
    // ====================== MENU SELECTORS ======================
    const selected = qs(".dropdown-selected");
    const selectedLabel = selected ? qs(".dropdown-label", selected) : null;
    const optionsContainer = qs(".dropdown-options");
    const options = optionsContainer ? qsa("li", optionsContainer) : [];
    const menuSections = qsa("[data-menu-section]");
    const groupHeaders = qsa("[data-group-header]");
    const menuCards = qsa(".menu-drink-card");
    const emptyState = qs("#menu-empty-state");
    const searchInput = qs("#menu-search");
    const sortButton = qs("#menu-sort");
    const sortLabel = sortButton ? qs("span", sortButton) : null;
    const sortIcon = sortButton ? qs("#FILTER-ICON", sortButton) : null;




if (!selected || !optionsContainer) return;




const sortIcons = {
      default: {
        src: "images/sort-solid.png",
        label: "Default",
        alt: "Default sort",
        title: "Sort",
      },
      az: {
        src: "images/sort-up-solid.png",
        label: "A-Z",
        alt: "Sort A to Z",
        title: "A-Z",
      },
      za: {
        src: "images/sort-down-solid.png",
        label: "Z-A",
        alt: "Sort Z to A",
        title: "Z-A",
      },
    };




const defaultSectionOrder = menuSections.map((section) => section.id);
    let activeCategory = "";
    let sortMode = "default";




const sectionCardsMap = new Map(
      menuSections.map((section) => [section.id, qsa(".menu-drink-card", section)])
    );




// ======================= MENU HELPERS =======================
    const updateSortButtonUI = () => {
      const current = sortIcons[sortMode];




if (sortLabel) {
        sortLabel.textContent = current.label;
      }




if (sortIcon) {
        sortIcon.src = current.src;
        sortIcon.alt = current.alt;
        sortIcon.title = current.title;
      }




sortButton.setAttribute("aria-label", `Sort menu cards: ${current.label}`);
    };




const getCardImagePath = (card) => {
      const pic = qs(".menu-card-pic", card);




if (!pic) return "";




const bg =
        pic.style.backgroundImage ||
        window.getComputedStyle(pic).backgroundImage ||
        "";
      const match = bg.match(/url\((['"]?)(.*?)\1\)/i);




return match ? match[2] : "";
    };




const makeMenuCardsClickable = () => {
      menuCards.forEach((card) => {
        if (card.dataset.clickBound === "1") return;




card.dataset.clickBound = "1";




const section = card.closest("[data-menu-section]");
        const category = section ? section.id : "";
        const titleEl = qs("h2", card);
        const itemName = titleEl ? titleEl.textContent.trim() : card.dataset.name || "item";




card.setAttribute("role", "link");
        card.setAttribute("tabindex", "0");




const goToItemPage = () => {
          const imagePath = getCardImagePath(card);
          const currentPage = window.location.pathname.split("/").pop().toLowerCase();
          const itemPage = currentPage === "customermenu.html" ? "customerItems.html" : "items.html";
          const targetUrl =
            `${itemPage}?item=${encodeURIComponent(itemName)}` +
            `&category=${encodeURIComponent(category)}` +
            `&image=${encodeURIComponent(imagePath)}`;




window.location.href = targetUrl;
        };




card.addEventListener("click", goToItemPage);
        card.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            goToItemPage();
          }
        });
      });
    };




const closeDropdown = () => {
      optionsContainer.classList.remove("dropdown-open");
      selected.classList.remove("open");
      selected.setAttribute("aria-expanded", "false");
    };




const getVisibleSectionIds = () => {
      if (activeCategory === "all" || activeCategory === "all-categories") {
        return defaultSectionOrder;
      }




if (!activeCategory) return [];




return defaultSectionOrder.filter((sectionId) => sectionId === activeCategory);
    };




const scrollToCategory = (category) => {
      const targetId =
        category === "all" || category === "all-categories"
          ? defaultSectionOrder[0]
          : category;




if (!targetId) return;




const target = qs(`#${targetId}`);
      if (!target) return;




setTimeout(() => {
        const navbarEl = qs(".navbar");
        const navbarHeight = navbarEl ? navbarEl.offsetHeight : 0;
        const top =
          target.getBoundingClientRect().top +
          window.scrollY -
          (navbarHeight + 28);




window.scrollTo({ top, behavior: "smooth" });
      }, 80);
    };




const applySort = () => {
      sectionCardsMap.forEach((cards, sectionId) => {
        const section = qs(`#${sectionId}`);
        if (!section) return;




const grid = qs(".menu-cards-grid", section);
        if (!grid) return;




const nextCards = [...cards];




if (sortMode === "az") {
          nextCards.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
        } else if (sortMode === "za") {
          nextCards.sort((a, b) => b.dataset.name.localeCompare(a.dataset.name));
        }




nextCards.forEach((card) => grid.appendChild(card));
      });
    };




const applySearch = () => {
      const query = searchInput ? searchInput.value.trim().toLowerCase() : "";




menuCards.forEach((card) => {
        const name = (card.dataset.name || "").toLowerCase();
        const text = card.textContent.toLowerCase();
        const isMatch = !query || name.includes(query) || text.includes(query);




card.classList.toggle("menu-card-hidden", !isMatch);
      });




};




const syncSections = () => {
      if (!menuSections.length) return;




const visibleIds = new Set(getVisibleSectionIds());
      applySearch();
      let shownSections = 0;




menuSections.forEach((section) => {
        const cards = sectionCardsMap.get(section.id) || [];
        const hasVisibleCards = cards.some(
          (card) => !card.classList.contains("menu-card-hidden")
        );
        const shouldShowSection = visibleIds.has(section.id) && hasVisibleCards;




section.classList.toggle("show", shouldShowSection);
        if (shouldShowSection) {
          shownSections += 1;
        }
      });




groupHeaders.forEach((header) => {
        const groupName = header.dataset.groupHeader;
        const hasVisibleGroupSection = menuSections.some(
          (section) =>
            section.dataset.menuGroup === groupName &&
            section.classList.contains("show")
        );




header.hidden = !hasVisibleGroupSection;
      });




if (emptyState) {
        emptyState.hidden = shownSections !== 0;
      }




applySort();
    };




const setCategory = (category, labelText, options = {}) => {
      const { updateHash = true } = options;
      activeCategory = category;




if (selectedLabel) {
        selectedLabel.textContent = labelText;
      } else {
        selected.textContent = labelText;
      }




syncSections();




if (updateHash) {
        try {
          history.replaceState(null, "", `#${category}`);
        } catch (error) {
          // Ignore hash update errors.
        }
      }
    };




// ===================== MENU INTERACTIONS ====================
    selected.addEventListener("click", (event) => {
      event.stopPropagation();
      optionsContainer.classList.toggle("dropdown-open");
      selected.classList.toggle("open");
      selected.setAttribute(
        "aria-expanded",
        selected.classList.contains("open") ? "true" : "false"
      );
    });




selected.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        optionsContainer.classList.toggle("dropdown-open");
        selected.classList.toggle("open");
        selected.setAttribute(
          "aria-expanded",
          selected.classList.contains("open") ? "true" : "false"
        );
      }




if (event.key === "Escape") {
        closeDropdown();
      }
    });




options.forEach((option) => {
      option.addEventListener("click", (event) => {
        event.stopPropagation();




const category = option.dataset.category;
        if (!category) return;




setCategory(category, option.textContent.trim());
        closeDropdown();
        scrollToCategory(category);
      });
    });




document.addEventListener("click", (event) => {
      if (!selected.contains(event.target) && !optionsContainer.contains(event.target)) {
        closeDropdown();
      }
    });




if (searchInput) {
      searchInput.addEventListener("input", syncSections);
    }




if (sortButton) {
      updateSortButtonUI();




sortButton.addEventListener("click", () => {
        sortMode =
          sortMode === "default"
            ? "az"
            : sortMode === "az"
              ? "za"
              : "default";




updateSortButtonUI();
        applySort();
      });
    }




// ===================== MENU INITIAL STATE ===================
    makeMenuCardsClickable();




const hash = window.location.hash.replace("#", "");
    const matchingOption = options.find((option) => option.dataset.category === hash);




if (matchingOption) {
      setCategory(hash, matchingOption.textContent.trim());
      scrollToCategory(hash);
    } else {
      setCategory("all-categories", "All Categories", { updateHash: false });
    }
  })();




  // ================== ADMIN PRODUCTS PAGE LOGIC ==================
  (function initAdminProductsPage() {
    const tableBody = qs("#admin-products-body");
    const pagination = qs("#admin-pagination");
    const searchInput = qs("#admin-product-search");
    const categorySelect = qs("#admin-product-category");
    const addButton = qs(".ADMIN-ADD-BUTTON");
    const modal = qs("#admin-product-modal");
    const modalTitle = qs("#admin-product-modal-title");
    const modalClose = qs("#admin-modal-close");
    const modalCancel = qs("#admin-modal-cancel");
    const modalSubmit = qs("#admin-modal-submit");
    const productForm = qs("#admin-product-form");
    const formCategory = qs("#admin-product-form-category");
    const nameInput = qs("#admin-product-name");
    const price16Input = qs("#admin-product-price-16");
    const price22Input = qs("#admin-product-price-22");
    const descriptionInput = qs("#admin-product-description");
    const imageUrlInput = qs("#admin-product-image-url");
    const imageFileInput = qs("#admin-product-image-file");
    const imagePreview = qs("#admin-image-preview");




    if (
      !tableBody ||
      !pagination ||
      !searchInput ||
      !categorySelect ||
      !addButton ||
      !modal ||
      !modalTitle ||
      !modalClose ||
      !modalCancel ||
      !modalSubmit ||
      !productForm ||
      !formCategory ||
      !nameInput ||
      !price16Input ||
      !price22Input ||
      !descriptionInput ||
      !imageUrlInput ||
      !imageFileInput ||
      !imagePreview
    ) return;




    const PRODUCTS_PER_PAGE = 8;
    let currentPage = 1;
    let activeEditId = null;
    let uploadedImageData = "";




    let adminProducts = [];
    let categories = ["All Categories"];

    // Fetch products and categories from database
    const fetchProducts = async () => {
      try {
        const response = await fetch('api/get_products.php');
        const data = await response.json();
        if (data.success) {
          adminProducts = data.products.map(product => ({
            id: product.product_id,
            name: product.product_name,
            category: product.category_name,
            price16: parseFloat(product.price_16) || 0,
            price22: parseFloat(product.price_22) || null,
            description: product.description || '',
            image: product.image || 'images/default-product.jpg'
          }));
          
          // Update categories after products are loaded
          categories = ["All Categories", ...new Set(adminProducts.map((product) => product.category))];
          updateCategoryDropdowns();
          
          // Render products after loading
          renderTable();
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('api/get_categories.php');
        const data = await response.json();
        if (data.success) {
          categories = ["All Categories", ...data.data.map(cat => cat.category_name)];
          updateCategoryDropdowns();
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const updateCategoryDropdowns = () => {
      categorySelect.innerHTML = categories
        .map((category) => `<option value="${category}">${category}</option>`)
        .join("");
      formCategory.innerHTML = categories
        .filter((category) => category !== "All Categories")
        .map((category) => `<option value="${category}">${category}</option>`)
        .join("");
    };

    // Initialize data fetching
    fetchProducts();
    fetchCategories();




    const formatPrice = (product) =>
      product.price22 ? `PHP ${product.price16} / PHP ${product.price22}` : `PHP ${product.price16}`;




    



    const setImagePreview = (imageSrc = "") => {
      if (imageSrc) {
        imagePreview.classList.add("has-image");
        imagePreview.innerHTML = `<img src="${imageSrc}" alt="Selected product image">`;
      } else {
        imagePreview.classList.remove("has-image");
        imagePreview.innerHTML = `<i class="fa-regular fa-image"></i>`;
      }
    };




    const resetForm = () => {
      activeEditId = null;
      uploadedImageData = "";
      productForm.reset();
      formCategory.selectedIndex = 0;
      setImagePreview("");
      modalTitle.textContent = "Add Product";
      modalSubmit.textContent = "Save Product";
    };




    const openModal = () => {
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    };




    const closeModal = () => {
      modal.hidden = true;
      document.body.style.overflow = "";
    };




    const openAddModal = () => {
      resetForm();
      modalTitle.textContent = "Add Product";
      modalSubmit.textContent = "Save Product";
      openModal();
    };




    const openEditModal = (productId) => {
      const product = adminProducts.find((item) => item.id === productId);
      if (!product) return;




      activeEditId = productId;
      uploadedImageData = "";
      modalTitle.textContent = "Edit Product";
      modalSubmit.textContent = "Save Product";
      nameInput.value = product.name;
      formCategory.value = product.category;
      price16Input.value = product.price16 ?? "";
      price22Input.value = product.price22 ?? "";
      descriptionInput.value = product.description || "";
      imageUrlInput.value = product.image || "";
      imageFileInput.value = "";
      setImagePreview(product.image);
      openModal();
    };




    const getFilteredProducts = () => {
      const query = searchInput.value.trim().toLowerCase();
      const selectedCategory = categorySelect.value;




      return adminProducts.filter((product) => {
        const matchesQuery =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          formatPrice(product).toLowerCase().includes(query);
        const matchesCategory =
          selectedCategory === "All Categories" || product.category === selectedCategory;




        return matchesQuery && matchesCategory;
      });
    };




    const renderTable = () => {
      const filteredProducts = getFilteredProducts();
      const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));




      if (currentPage > totalPages) {
        currentPage = totalPages;
      }




      const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
      const currentProducts = filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);




      tableBody.innerHTML = currentProducts.length
        ? currentProducts
            .map(
              (product) => `
                <tr>
                  <td>
                    <div class="ADMIN-PRODUCT-THUMB">
                      <img src="${product.image}" alt="${product.name}">
                    </div>
                  </td>
                  <td>${product.name}</td>
                  <td>${product.category}</td>
                  <td>${formatPrice(product)}</td>
                  <td>
                    <div class="ADMIN-TABLE-ACTIONS">
                      <button type="button" data-edit-id="${product.id}" aria-label="Edit ${product.name}"><i class="fa-solid fa-pen"></i></button>
                      <button type="button" data-archive-id="${product.id}" aria-label="Archive ${product.name}"><i class="fa-solid fa-archive"></i></button>
                    </div>
                  </td>
                </tr>
              `
            )
            .join("")
        : `
            <tr>
              <td colspan="5" class="ADMIN-NO-DATA">No products matched your search.</td>
            </tr>
          `;




      renderPagination(totalPages);




      qsa("[data-edit-id]", tableBody).forEach((button) => {
        button.addEventListener("click", () => {
          openEditModal(Number(button.dataset.editId));
        });
      });

      // Add delete button event listeners
      qsa("[data-archive-id]", tableBody).forEach((button) => {
        button.addEventListener("click", () => {
          const productId = Number(button.dataset.archiveId);
          const productName = adminProducts.find((item) => item.id === productId)?.name || 'product';
          archiveProduct(productId, productName);
        });
      });
    };




    const createPageButton = (label, page, isActive = false, isDisabled = false, icon = "") => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `ADMIN-PAGE-BUTTON${isActive ? " active" : ""}`;
      button.disabled = isDisabled;
      button.innerHTML = icon || label;




      if (!isDisabled) {
        button.addEventListener("click", () => {
          currentPage = page;
          renderTable();
        });
      }




      return button;
    };




    const renderPagination = (totalPages) => {
      pagination.innerHTML = "";




      const prevButton = createPageButton(
        "",
        Math.max(1, currentPage - 1),
        false,
        currentPage === 1,
        '<i class="fa-solid fa-chevron-left"></i>'
      );
      pagination.appendChild(prevButton);




      const pagesToShow = [];
      for (let page = 1; page <= totalPages; page += 1) {
        if (
          page === 1 ||
          page === totalPages ||
          Math.abs(page - currentPage) <= 1
        ) {
          pagesToShow.push(page);
        }
      }




      pagesToShow.forEach((page, index) => {
        const previousPage = pagesToShow[index - 1];
        if (previousPage && page - previousPage > 1) {
          const ellipsis = document.createElement("span");
          ellipsis.className = "ADMIN-PAGE-ELLIPSIS";
          ellipsis.textContent = "...";
          pagination.appendChild(ellipsis);
        }




        pagination.appendChild(createPageButton(String(page), page, page === currentPage));
      });




      const nextButton = createPageButton(
        "",
        Math.min(totalPages, currentPage + 1),
        false,
        currentPage === totalPages,
        '<i class="fa-solid fa-chevron-right"></i>'
      );
      pagination.appendChild(nextButton);
    };




    searchInput.addEventListener("input", () => {
      currentPage = 1;
      renderTable();
    });




    categorySelect.addEventListener("change", () => {
      currentPage = 1;
      renderTable();
    });




    addButton.addEventListener("click", openAddModal);
    modalClose.addEventListener("click", closeModal);
    modalCancel.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });




    imageUrlInput.addEventListener("input", () => {
      if (uploadedImageData) return;
      setImagePreview(imageUrlInput.value.trim());
    });




    imageFileInput.addEventListener("change", () => {
      const [file] = imageFileInput.files || [];
      if (!file) {
        uploadedImageData = "";
        setImagePreview(imageUrlInput.value.trim());
        return;
      }




      const reader = new FileReader();
      reader.onload = () => {
        uploadedImageData = String(reader.result || "");
        setImagePreview(uploadedImageData);
      };
      reader.readAsDataURL(file);
    });

    const saveProduct = async (productData) => {
      const isEdit = activeEditId !== null;
      const url = isEdit ? 'api/update_product.php' : 'api/add_product.php';
      const method = isEdit ? 'PUT' : 'POST';

      if (isEdit) {
        productData.product_id = activeEditId;
      }

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData)
        });

        const result = await response.json();

        if (result.success) {
          alert(`Product ${isEdit ? 'updated' : 'added'} successfully!`);
          await fetchProducts();
          closeModal();
        } else {
          alert(`Error ${isEdit ? 'updating' : 'adding'} product: ${result.message}`);
        }
      } catch (error) {
        console.error('Error saving product:', error);
        alert(`Failed to ${isEdit ? 'update' : 'add'} product. Please try again.`);
      }
    };

    productForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = nameInput.value.trim();
      const category = formCategory.value;
      const price16 = price16Input.value ? Number(price16Input.value) : null;
      const price22 = price22Input.value ? Number(price22Input.value) : null;
      const description = descriptionInput.value.trim();
      const image = uploadedImageData || imageUrlInput.value.trim();

      if (!name || !category || !price16) {
        alert('Please fill in all required fields.');
        return;
      }

      const categoryData = await fetch('api/get_categories.php').then(res => res.json());
      const categoryObj = categoryData.data.find(cat => cat.category_name === category);
      const categoryId = categoryObj ? categoryObj.category_id : 0;

      const productData = {
        category_id: categoryId,
        product_name: name,
        description: description,
        price_16: price16,
        price_22: price22 || null,
        stock: 100,
        image: image || 'images/default-product.jpg'
      };

      await saveProduct(productData);
    });

    const archiveProduct = async (productId, productName) => {
      if (!confirm(`Are you sure you want to archive "${productName}"? This can be restored later.`)) {
        return;
      }

      try {
        const response = await fetch('api/delete_product.php', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: productId, status: 'archive' })
        });

        const result = await response.json();

        if (result.success) {
          alert(`"${productName}" has been archived successfully.`);
          await fetchProducts();
        } else {
          alert(`Error archiving product: ${result.message}`);
        }
      } catch (error) {
        console.error('Error archiving product:', error);
        alert('Failed to archive product. Please try again.');
      }
    };

    renderTable();
  })();

  // =================== ADMIN ARCHIVE PAGE LOGIC ==================
  const restoreProduct = async (productId, productName) => {
    if (!confirm(`Restore "${productName}" to the active storefront?`)) {
      return;
    }

    try {
      const response = await fetch('api/delete_product.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId, status: 'active' })
      });

      const result = await response.json();
      if (result.success) {
        alert(`"${productName}" was restored successfully.`);
        await window.fetchArchivedProducts();
      } else {
        alert(`Error restoring product: ${result.message}`);
      }
    } catch (error) {
      console.error('Error restoring product:', error);
      alert('Failed to restore product. Please try again.');
    }
  };

  (function initAdminArchivePage() {
    const tableBody = qs("#admin-archive-products-body");
    const pagination = qs("#admin-archive-pagination");
    const searchInput = qs("#admin-archive-product-search");
    const categorySelect = qs("#admin-archive-product-category");

    if (!tableBody || !pagination || !searchInput || !categorySelect) return;

    const PRODUCTS_PER_PAGE = 8;
    let currentPage = 1;
    let archivedProducts = [];
    let categories = ["All Categories"];

    const formatPrice = (product) =>
      product.price22 ? `PHP ${product.price16} / PHP ${product.price22}` : `PHP ${product.price16}`;

    const updateCategoryDropdowns = () => {
      categorySelect.innerHTML = categories
        .map((category) => `<option value="${category}">${category}</option>`)
        .join("");
    };

    const fetchArchivedProducts = async () => {
      tableBody.innerHTML = `<tr><td colspan="5">Loading archived products...</td></tr>`;
      try {
        const response = await fetch('api/get_products.php?status=archive');
        const data = await response.json();
        if (data.success) {
          archivedProducts = (data.products || []).map((product) => ({
            id: product.product_id,
            name: product.product_name,
            category: product.category_name,
            price16: parseFloat(product.price_16) || 0,
            price22: parseFloat(product.price_22) > 0 ? parseFloat(product.price_22) : null,
            image: product.image || 'images/default-product.jpg',
          }));

          categories = ["All Categories", ...new Set(archivedProducts.map((product) => product.category))];
          updateCategoryDropdowns();
          renderTable();
        } else {
          tableBody.innerHTML = `<tr><td colspan="5">Unable to load archived products: ${data.message || 'Unknown error'}</td></tr>`;
        }
      } catch (error) {
        console.error('Error fetching archived products:', error);
        tableBody.innerHTML = `<tr><td colspan="5">Unable to load archived products.</td></tr>`;
      }
    };

    window.fetchArchivedProducts = fetchArchivedProducts;

    const getFilteredProducts = () => {
      const query = searchInput.value.trim().toLowerCase();
      const selectedCategory = categorySelect.value;

      return archivedProducts.filter((product) => {
        const matchesQuery =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          formatPrice(product).toLowerCase().includes(query);
        const matchesCategory =
          selectedCategory === "All Categories" || product.category === selectedCategory;

        return matchesQuery && matchesCategory;
      });
    };

    const createPageButton = (label, page, isActive = false, isDisabled = false, icon = "") => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `ADMIN-PAGE-BUTTON${isActive ? " active" : ""}`;
      button.disabled = isDisabled;
      button.innerHTML = icon || label;

      if (!isDisabled) {
        button.addEventListener("click", () => {
          currentPage = page;
          renderTable();
        });
      }

      return button;
    };

    const renderPagination = (totalPages) => {
      pagination.innerHTML = "";

      pagination.appendChild(createPageButton("", Math.max(1, currentPage - 1), false, currentPage === 1, '<i class="fa-solid fa-chevron-left"></i>'));

      const pagesToShow = [];
      for (let page = 1; page <= totalPages; page += 1) {
        if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
          pagesToShow.push(page);
        }
      }

      pagesToShow.forEach((page, index) => {
        const previousPage = pagesToShow[index - 1];
        if (previousPage && page - previousPage > 1) {
          const ellipsis = document.createElement("span");
          ellipsis.className = "ADMIN-PAGE-ELLIPSIS";
          ellipsis.textContent = "...";
          pagination.appendChild(ellipsis);
        }
        pagination.appendChild(createPageButton(String(page), page, page === currentPage));
      });

      pagination.appendChild(createPageButton("", Math.min(totalPages, currentPage + 1), false, currentPage === totalPages, '<i class="fa-solid fa-chevron-right"></i>'));
    };

    const renderTable = () => {
      const filteredProducts = getFilteredProducts();
      const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));

      if (currentPage > totalPages) {
        currentPage = totalPages;
      }

      const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
      const currentProducts = filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);

      tableBody.innerHTML = currentProducts.length
        ? currentProducts
            .map(
              (product) => `
                <tr>
                  <td>
                    <div class="ADMIN-PRODUCT-THUMB">
                      <img src="${product.image}" alt="${product.name}">
                    </div>
                  </td>
                  <td>${product.name}</td>
                  <td>${product.category}</td>
                  <td>${formatPrice(product)}</td>
                  <td>
                    <div class="ADMIN-TABLE-ACTIONS">
                      <button type="button" data-restore-id="${product.id}" aria-label="Restore ${product.name}"><i class="fa-solid fa-rotate-left"></i></button>
                    </div>
                  </td>
                </tr>
              `
            )
            .join("")
        : `
            <tr>
              <td colspan="5" class="ADMIN-NO-DATA">No archived products found.</td>
            </tr>
          `;

      renderPagination(totalPages);

      qsa("[data-restore-id]", tableBody).forEach((button) => {
        button.addEventListener("click", () => {
          const productId = Number(button.dataset.restoreId);
          const productName = archivedProducts.find((item) => item.id === productId)?.name || 'product';
          restoreProduct(productId, productName);
        });
      });
    };

    searchInput.addEventListener("input", () => {
      currentPage = 1;
      renderTable();
    });

    categorySelect.addEventListener("change", () => {
      currentPage = 1;
      renderTable();
    });

    fetchArchivedProducts();
  })();

  // =================== ADMIN ORDERS PAGE LOGIC ===================
  (function initAdminOrdersPage() {
    const tableBody = qs("#admin-orders-body");
    const pagination = qs("#admin-orders-pagination");
    const searchInput = qs("#admin-order-search");
    const statusSelect = qs("#admin-order-status");




    if (!tableBody || !pagination || !searchInput || !statusSelect) return;




    const ORDERS_PER_PAGE = 8;
    let currentPage = 1;
    let orders = [];

    const formatOrderId = (id) => `#ORD-${String(Number(id || 0)).padStart(4, "0")}`;
    const toPeso = (amount) => `₱${Number(amount || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
    const normalizeStatusClass = (statusValue) => {
      const s = String(statusValue || "pending").toLowerCase().trim();
      if (s === "cancelled" || s === "canceled") return "canceled";
      return s;
    };
    const toTitleStatus = (statusValue) => {
      const s = String(statusValue || "pending").toLowerCase().trim();
      if (s === "cancelled") return "Canceled";
      return s.charAt(0).toUpperCase() + s.slice(1);
    };

    const populateStatusFilter = () => {
      const unique = ["All Status", ...new Set(orders.map((o) => toTitleStatus(o.status)))];
      statusSelect.innerHTML = unique
        .map((s) => `<option value="${s}">${s}</option>`)
        .join("");
    };

    tableBody.innerHTML = `<tr><td colspan="6">Loading orders...</td></tr>`;

    fetch("api/get_orders.php")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load orders.");
        return res.json();
      })
      .then((result) => {
        if (!result.success) throw new Error(result.message || "Could not fetch orders.");
        orders = (result.data || []).map((o) => ({
          id: formatOrderId(o.order_id),
          customer: o.username || "Guest",
          items: o.items || "No items",
          total: toPeso(o.total_amount),
          status: toTitleStatus(o.status),
          statusClass: normalizeStatusClass(o.status),
        }));
        populateStatusFilter();
        renderTable();
      })
      .catch(() => {
        tableBody.innerHTML = `<tr><td colspan="6">Unable to load orders.</td></tr>`;
      });




    const getFilteredOrders = () => {
      const query = searchInput.value.trim().toLowerCase();
      const selectedStatus = statusSelect.value;




      return orders.filter((order) => {
        const matchesQuery =
          !query ||
          order.id.toLowerCase().includes(query) ||
          order.customer.toLowerCase().includes(query) ||
          order.items.toLowerCase().includes(query) ||
          order.status.toLowerCase().includes(query);
        const matchesStatus =
          selectedStatus === "All Status" || order.status === selectedStatus;




        return matchesQuery && matchesStatus;
      });
    };




    const createPageButton = (label, page, isActive = false, isDisabled = false, icon = "") => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `ADMIN-PAGE-BUTTON${isActive ? " active" : ""}`;
      button.disabled = isDisabled;
      button.innerHTML = icon || label;




      if (!isDisabled) {
        button.addEventListener("click", () => {
          currentPage = page;
          renderTable();
        });
      }




      return button;
    };




    const renderPagination = (totalPages) => {
      pagination.innerHTML = "";




      pagination.appendChild(
        createPageButton(
          "",
          Math.max(1, currentPage - 1),
          false,
          currentPage === 1,
          '<i class="fa-solid fa-chevron-left"></i>'
        )
      );




      const pagesToShow = [];
      for (let page = 1; page <= totalPages; page += 1) {
        if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
          pagesToShow.push(page);
        }
      }




      pagesToShow.forEach((page, index) => {
        const previousPage = pagesToShow[index - 1];
        if (previousPage && page - previousPage > 1) {
          const ellipsis = document.createElement("span");
          ellipsis.className = "ADMIN-PAGE-ELLIPSIS";
          ellipsis.textContent = "...";
          pagination.appendChild(ellipsis);
        }




        pagination.appendChild(createPageButton(String(page), page, page === currentPage));
      });




      pagination.appendChild(
        createPageButton(
          "",
          Math.min(totalPages, currentPage + 1),
          false,
          currentPage === totalPages,
          '<i class="fa-solid fa-chevron-right"></i>'
        )
      );
    };




    const renderTable = () => {
      const filteredOrders = getFilteredOrders();
      const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));




      if (currentPage > totalPages) {
        currentPage = totalPages;
      }




      const start = (currentPage - 1) * ORDERS_PER_PAGE;
      const currentOrders = filteredOrders.slice(start, start + ORDERS_PER_PAGE);




      tableBody.innerHTML = currentOrders.length
        ? currentOrders
            .map(
              (order) => `
                <tr>
                  <td>${order.id}</td>
                  <td>${order.customer}</td>
                  <td>${order.items}</td>
                  <td>${order.total}</td>
                  <td><span class="ADMIN-STATUS ${order.statusClass}">${order.status}</span></td>
                  <td>
                    <div class="ADMIN-TABLE-ACTIONS">
                      <button type="button" aria-label="View ${order.id}">
                        <i class="fa-regular fa-eye"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `
            )
            .join("")
        : `
            <tr>
              <td colspan="6" class="ADMIN-NO-DATA">No orders matched your search.</td>
            </tr>
          `;




      renderPagination(totalPages);
    };




    searchInput.addEventListener("input", () => {
      currentPage = 1;
      renderTable();
    });




    statusSelect.addEventListener("change", () => {
      currentPage = 1;
      renderTable();
    });
  })();




  // ================= ADMIN CUSTOMERS PAGE LOGIC =================
  (function initAdminCustomersPage() {
    const tableBody = qs("#admin-customers-body");
    const pagination = qs("#admin-customers-pagination");
    const searchInput = qs("#admin-customer-search");
    const statusSelect = qs("#admin-customer-status");




    if (!tableBody || !pagination || !searchInput || !statusSelect) return;




    const CUSTOMERS_PER_PAGE = 8;
    let currentPage = 1;
    let customers = [];




    // Fetch customers from the database
    const fetchCustomers = async () => {
      try {
        const response = await fetch("api/get_customers.php");
        if (!response.ok) throw new Error("Failed to fetch customers");
        
        const data = await response.json();
        if (data.success && Array.isArray(data.customers)) {
          // Map database fields to expected properties
          customers = data.customers.map((customer) => ({
            name: customer.full_name || "N/A",
            email: customer.email,
            totalOrders: parseInt(customer.total_orders) || 0,
            status: customer.status.charAt(0).toUpperCase() + customer.status.slice(1),
          }));
          
          // Update status select options
          const statuses = ["All Status", ...new Set(customers.map((customer) => customer.status))];
          statusSelect.innerHTML = statuses
            .map((status) => `<option value="${status}">${status}</option>`)
            .join("");
          
          renderTable();
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        tableBody.innerHTML = `
          <tr>
            <td colspan="5" class="ADMIN-NO-DATA">Error loading customers. Please try again.</td>
          </tr>
        `;
      }
    };




    // Initial fetch
    fetchCustomers();




    const getFilteredCustomers = () => {
      const query = searchInput.value.trim().toLowerCase();
      const selectedStatus = statusSelect.value;




      return customers.filter((customer) => {
        const matchesQuery =
          !query ||
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          String(customer.totalOrders).includes(query) ||
          customer.status.toLowerCase().includes(query);
        const matchesStatus =
          selectedStatus === "All Status" || customer.status === selectedStatus;




        return matchesQuery && matchesStatus;
      });
    };




    const createPageButton = (label, page, isActive = false, isDisabled = false, icon = "") => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `ADMIN-PAGE-BUTTON${isActive ? " active" : ""}`;
      button.disabled = isDisabled;
      button.innerHTML = icon || label;




      if (!isDisabled) {
        button.addEventListener("click", () => {
          currentPage = page;
          renderTable();
        });
      }




      return button;
    };




    const renderPagination = (totalPages) => {
      pagination.innerHTML = "";




      pagination.appendChild(
        createPageButton(
          "",
          Math.max(1, currentPage - 1),
          false,
          currentPage === 1,
          '<i class="fa-solid fa-chevron-left"></i>'
        )
      );




      const pagesToShow = [];
      for (let page = 1; page <= totalPages; page += 1) {
        if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
          pagesToShow.push(page);
        }
      }




      pagesToShow.forEach((page, index) => {
        const previousPage = pagesToShow[index - 1];
        if (previousPage && page - previousPage > 1) {
          const ellipsis = document.createElement("span");
          ellipsis.className = "ADMIN-PAGE-ELLIPSIS";
          ellipsis.textContent = "...";
          pagination.appendChild(ellipsis);
        }




        pagination.appendChild(createPageButton(String(page), page, page === currentPage));
      });




      pagination.appendChild(
        createPageButton(
          "",
          Math.min(totalPages, currentPage + 1),
          false,
          currentPage === totalPages,
          '<i class="fa-solid fa-chevron-right"></i>'
        )
      );
    };




    const renderTable = () => {
      const filteredCustomers = getFilteredCustomers();
      const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / CUSTOMERS_PER_PAGE));




      if (currentPage > totalPages) {
        currentPage = totalPages;
      }




      const start = (currentPage - 1) * CUSTOMERS_PER_PAGE;
      const currentCustomers = filteredCustomers.slice(start, start + CUSTOMERS_PER_PAGE);




      tableBody.innerHTML = currentCustomers.length
        ? currentCustomers
            .map(
              (customer) => `
                <tr>
                  <td>${customer.name}</td>
                  <td>${customer.email}</td>
                  <td>${customer.totalOrders}</td>
                  <td><span class="ADMIN-STATUS ${customer.status.toLowerCase()}">${customer.status}</span></td>
                  <td>
                    <div class="ADMIN-TABLE-ACTIONS">
                      <button type="button" aria-label="View ${customer.name}">
                        <i class="fa-regular fa-eye"></i>
                      </button>
                      <button type="button" aria-label="Delete ${customer.name}">
                        <i class="fa-regular fa-circle-xmark"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `
            )
            .join("")
        : `
            <tr>
              <td colspan="5" class="ADMIN-NO-DATA">No customers matched your search.</td>
            </tr>
          `;




      renderPagination(totalPages);
    };




    searchInput.addEventListener("input", () => {
      currentPage = 1;
      renderTable();
    });




    statusSelect.addEventListener("change", () => {
      currentPage = 1;
      renderTable();
    });




    renderTable();
  })();




  // ================= ADMIN PAYMENTS PAGE LOGIC =================
  (function initAdminPaymentsPage() {
    const tableBody = qs("#admin-payments-body");
    const pagination = qs("#admin-payments-pagination");
    const searchInput = qs("#admin-payment-search");
    const statusSelect = qs("#admin-payment-status");




    if (!tableBody || !pagination || !searchInput || !statusSelect) return;




    const PAYMENTS_PER_PAGE = 8;
    let currentPage = 1;




    const payments = [
      { paymentId: "#PAY-2001", orderId: "#ORD-1001", amount: 180, method: "Cash on Delivery", status: "Paid" },
      { paymentId: "#PAY-2002", orderId: "#ORD-1002", amount: 250, method: "Online Payment", status: "Paid" },
      { paymentId: "#PAY-2003", orderId: "#ORD-1003", amount: 110, method: "Cash on Delivery", status: "Paid" },
      { paymentId: "#PAY-2004", orderId: "#ORD-1004", amount: 300, method: "Online Payment", status: "Refunded" },
      { paymentId: "#PAY-2005", orderId: "#ORD-1005", amount: 190, method: "Cash on Delivery", status: "Paid" },
      { paymentId: "#PAY-2006", orderId: "#ORD-1006", amount: 155, method: "Online Payment", status: "Paid" },
      { paymentId: "#PAY-2007", orderId: "#ORD-1007", amount: 185, method: "Cash on Delivery", status: "Pending" },
      { paymentId: "#PAY-2008", orderId: "#ORD-1008", amount: 195, method: "Online Payment", status: "Paid" },
      { paymentId: "#PAY-2009", orderId: "#ORD-1009", amount: 210, method: "Cash on Delivery", status: "Paid" },
      { paymentId: "#PAY-2010", orderId: "#ORD-1010", amount: 170, method: "Online Payment", status: "Refunded" },
    ];




    const statuses = ["All Status", ...new Set(payments.map((payment) => payment.status))];
    statusSelect.innerHTML = statuses
      .map((status) => `<option value="${status}">${status}</option>`)
      .join("");




    const getFilteredPayments = () => {
      const query = searchInput.value.trim().toLowerCase();
      const selectedStatus = statusSelect.value;




      return payments.filter((payment) => {
        const matchesQuery =
          !query ||
          payment.paymentId.toLowerCase().includes(query) ||
          payment.orderId.toLowerCase().includes(query) ||
          payment.method.toLowerCase().includes(query) ||
          payment.status.toLowerCase().includes(query) ||
          String(payment.amount).includes(query);
        const matchesStatus =
          selectedStatus === "All Status" || payment.status === selectedStatus;




        return matchesQuery && matchesStatus;
      });
    };




    const createPageButton = (label, page, isActive = false, isDisabled = false, icon = "") => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `ADMIN-PAGE-BUTTON${isActive ? " active" : ""}`;
      button.disabled = isDisabled;
      button.innerHTML = icon || label;




      if (!isDisabled) {
        button.addEventListener("click", () => {
          currentPage = page;
          renderTable();
        });
      }




      return button;
    };




    const renderPagination = (totalPages) => {
      pagination.innerHTML = "";




      pagination.appendChild(
        createPageButton(
          "",
          Math.max(1, currentPage - 1),
          false,
          currentPage === 1,
          '<i class="fa-solid fa-chevron-left"></i>'
        )
      );




      const pagesToShow = [];
      for (let page = 1; page <= totalPages; page += 1) {
        if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
          pagesToShow.push(page);
        }
      }




      pagesToShow.forEach((page, index) => {
        const previousPage = pagesToShow[index - 1];
        if (previousPage && page - previousPage > 1) {
          const ellipsis = document.createElement("span");
          ellipsis.className = "ADMIN-PAGE-ELLIPSIS";
          ellipsis.textContent = "...";
          pagination.appendChild(ellipsis);
        }




        pagination.appendChild(createPageButton(String(page), page, page === currentPage));
      });




      pagination.appendChild(
        createPageButton(
          "",
          Math.min(totalPages, currentPage + 1),
          false,
          currentPage === totalPages,
          '<i class="fa-solid fa-chevron-right"></i>'
        )
      );
    };




    const renderTable = () => {
      const filteredPayments = getFilteredPayments();
      const totalPages = Math.max(1, Math.ceil(filteredPayments.length / PAYMENTS_PER_PAGE));




      if (currentPage > totalPages) {
        currentPage = totalPages;
      }




      const start = (currentPage - 1) * PAYMENTS_PER_PAGE;
      const currentPayments = filteredPayments.slice(start, start + PAYMENTS_PER_PAGE);




      tableBody.innerHTML = currentPayments.length
        ? currentPayments
            .map(
              (payment) => `
                <tr>
                  <td>${payment.paymentId}</td>
                  <td>${payment.orderId}</td>
                  <td>PHP ${payment.amount}</td>
                  <td>${payment.method}</td>
                  <td><span class="ADMIN-STATUS ${payment.status.toLowerCase()}">${payment.status}</span></td>
                </tr>
              `
            )
            .join("")
        : `
            <tr>
              <td colspan="5" class="ADMIN-NO-DATA">No payments matched your search.</td>
            </tr>
          `;




      renderPagination(totalPages);
    };




    searchInput.addEventListener("input", () => {
      currentPage = 1;
      renderTable();
    });




    statusSelect.addEventListener("change", () => {
      currentPage = 1;
      renderTable();
    });




    renderTable();
  })();




  // ================== ADMIN PROMOS PAGE LOGIC ==================
  (function initAdminPromosPage() {
    const tableBody = qs("#admin-promos-body");
    const pagination = qs("#admin-promos-pagination");
    const searchInput = qs("#admin-promo-search");
    const statusSelect = qs("#admin-promo-status");




    if (!tableBody || !pagination || !searchInput || !statusSelect) return;




    const PROMOS_PER_PAGE = 8;
    let currentPage = 1;




    const promos = [
      { name: "Summer Treats", discount: "10% OFF", validUntil: "May 31, 2025", status: "Active" },
      { name: "Buy 1 Take 1", discount: "BOGO", validUntil: "June 15, 2025", status: "Active" },
      { name: "Student Friday", discount: "15% OFF", validUntil: "June 30, 2025", status: "Inactive" },
      { name: "New Year Special", discount: "20% OFF", validUntil: "Jan 01, 2026", status: "Scheduled" },
      { name: "Weekend Cravings", discount: "Free Add-on", validUntil: "July 05, 2025", status: "Active" },
      { name: "Milktea Madness", discount: "12% OFF", validUntil: "July 18, 2025", status: "Scheduled" },
      { name: "Snack Combo Deal", discount: "PHP 50 OFF", validUntil: "Aug 10, 2025", status: "Active" },
      { name: "Holiday Bundle", discount: "18% OFF", validUntil: "Dec 20, 2025", status: "Scheduled" },
      { name: "Rainy Day Promo", discount: "Free Delivery", validUntil: "Sept 02, 2025", status: "Inactive" },
      { name: "Loyalty Treat", discount: "10% OFF", validUntil: "Oct 12, 2025", status: "Active" },
    ];




    const statuses = ["All Status", ...new Set(promos.map((promo) => promo.status))];
    statusSelect.innerHTML = statuses
      .map((status) => `<option value="${status}">${status}</option>`)
      .join("");




    const getFilteredPromos = () => {
      const query = searchInput.value.trim().toLowerCase();
      const selectedStatus = statusSelect.value;




      return promos.filter((promo) => {
        const matchesQuery = (
          !query ||
          promo.name.toLowerCase().includes(query) ||
          promo.discount.toLowerCase().includes(query) ||
          promo.validUntil.toLowerCase().includes(query) ||
          promo.status.toLowerCase().includes(query)
        );
        const matchesStatus =
          selectedStatus === "All Status" || promo.status === selectedStatus;




        return matchesQuery && matchesStatus;
      });
    };




    const createPageButton = (label, page, isActive = false, isDisabled = false, icon = "") => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `ADMIN-PAGE-BUTTON${isActive ? " active" : ""}`;
      button.disabled = isDisabled;
      button.innerHTML = icon || label;




      if (!isDisabled) {
        button.addEventListener("click", () => {
          currentPage = page;
          renderTable();
        });
      }




      return button;
    };




    const renderPagination = (totalPages) => {
      pagination.innerHTML = "";




      pagination.appendChild(
        createPageButton(
          "",
          Math.max(1, currentPage - 1),
          false,
          currentPage === 1,
          '<i class="fa-solid fa-chevron-left"></i>'
        )
      );




      const pagesToShow = [];
      for (let page = 1; page <= totalPages; page += 1) {
        if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
          pagesToShow.push(page);
        }
      }




      pagesToShow.forEach((page, index) => {
        const previousPage = pagesToShow[index - 1];
        if (previousPage && page - previousPage > 1) {
          const ellipsis = document.createElement("span");
          ellipsis.className = "ADMIN-PAGE-ELLIPSIS";
          ellipsis.textContent = "...";
          pagination.appendChild(ellipsis);
        }




        pagination.appendChild(createPageButton(String(page), page, page === currentPage));
      });




      pagination.appendChild(
        createPageButton(
          "",
          Math.min(totalPages, currentPage + 1),
          false,
          currentPage === totalPages,
          '<i class="fa-solid fa-chevron-right"></i>'
        )
      );
    };




    const renderTable = () => {
      const filteredPromos = getFilteredPromos();
      const totalPages = Math.max(1, Math.ceil(filteredPromos.length / PROMOS_PER_PAGE));




      if (currentPage > totalPages) {
        currentPage = totalPages;
      }




      const start = (currentPage - 1) * PROMOS_PER_PAGE;
      const currentPromos = filteredPromos.slice(start, start + PROMOS_PER_PAGE);




      tableBody.innerHTML = currentPromos.length
        ? currentPromos
            .map(
              (promo) => `
                <tr>
                  <td>${promo.name}</td>
                  <td>${promo.discount}</td>
                  <td>${promo.validUntil}</td>
                  <td><span class="ADMIN-STATUS ${promo.status.toLowerCase()}">${promo.status}</span></td>
                  <td>
                    <div class="ADMIN-TABLE-ACTIONS">
                      <button type="button" aria-label="Edit ${promo.name}">
                        <i class="fa-solid fa-pen"></i>
                      </button>
                      <button type="button" aria-label="Delete ${promo.name}">
                        <i class="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `
            )
            .join("")
        : `
            <tr>
              <td colspan="5" class="ADMIN-NO-DATA">No promos matched your search.</td>
            </tr>
          `;




      renderPagination(totalPages);
    };




    searchInput.addEventListener("input", () => {
      currentPage = 1;
      renderTable();
    });




    statusSelect.addEventListener("change", () => {
      currentPage = 1;
      renderTable();
    });




    renderTable();
  })();




  // ================== ADMIN REWARDS PAGE LOGIC ==================
  (function initAdminRewardsPage() {
    const tableBody = qs("#admin-rewards-body");
    const pagination = qs("#admin-rewards-pagination");
    const searchInput = qs("#admin-reward-search");
    const statusSelect = qs("#admin-reward-status");




    if (!tableBody || !pagination || !searchInput || !statusSelect) return;




    const REWARDS_PER_PAGE = 8;
    let currentPage = 1;




    const rewards = [
      { name: "Free Milk Tea (16oz)", points: "100 pts", status: "Active" },
      { name: "PHP 20 Off Discount", points: "50 pts", status: "Active" },
      { name: "Free Takoyaki (6pcs)", points: "120 pts", status: "Active" },
      { name: "Free Burger", points: "200 pts", status: "Inactive" },
      { name: "Free Fries", points: "80 pts", status: "Active" },
      { name: "Fruit Tea Upgrade", points: "90 pts", status: "Active" },
      { name: "Snack Combo Reward", points: "160 pts", status: "Inactive" },
      { name: "Premium Drink Reward", points: "180 pts", status: "Active" },
      { name: "Cream Cheese Upgrade", points: "140 pts", status: "Active" },
      { name: "Burger Meal Reward", points: "220 pts", status: "Inactive" },
    ];




    const statuses = ["All Status", ...new Set(rewards.map((reward) => reward.status))];
    statusSelect.innerHTML = statuses
      .map((status) => `<option value="${status}">${status}</option>`)
      .join("");




    const getFilteredRewards = () => {
      const query = searchInput.value.trim().toLowerCase();
      const selectedStatus = statusSelect.value;




      return rewards.filter((reward) => {
        const matchesQuery = (
          !query ||
          reward.name.toLowerCase().includes(query) ||
          reward.points.toLowerCase().includes(query) ||
          reward.status.toLowerCase().includes(query)
        );
        const matchesStatus =
          selectedStatus === "All Status" || reward.status === selectedStatus;




        return matchesQuery && matchesStatus;
      });
    };




    const createPageButton = (label, page, isActive = false, isDisabled = false, icon = "") => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `ADMIN-PAGE-BUTTON${isActive ? " active" : ""}`;
      button.disabled = isDisabled;
      button.innerHTML = icon || label;




      if (!isDisabled) {
        button.addEventListener("click", () => {
          currentPage = page;
          renderTable();
        });
      }




      return button;
    };




    const renderPagination = (totalPages) => {
      pagination.innerHTML = "";




      pagination.appendChild(
        createPageButton(
          "",
          Math.max(1, currentPage - 1),
          false,
          currentPage === 1,
          '<i class="fa-solid fa-chevron-left"></i>'
        )
      );




      const pagesToShow = [];
      for (let page = 1; page <= totalPages; page += 1) {
        if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
          pagesToShow.push(page);
        }
      }




      pagesToShow.forEach((page, index) => {
        const previousPage = pagesToShow[index - 1];
        if (previousPage && page - previousPage > 1) {
          const ellipsis = document.createElement("span");
          ellipsis.className = "ADMIN-PAGE-ELLIPSIS";
          ellipsis.textContent = "...";
          pagination.appendChild(ellipsis);
        }




        pagination.appendChild(createPageButton(String(page), page, page === currentPage));
      });




      pagination.appendChild(
        createPageButton(
          "",
          Math.min(totalPages, currentPage + 1),
          false,
          currentPage === totalPages,
          '<i class="fa-solid fa-chevron-right"></i>'
        )
      );
    };




    const renderTable = () => {
      const filteredRewards = getFilteredRewards();
      const totalPages = Math.max(1, Math.ceil(filteredRewards.length / REWARDS_PER_PAGE));




      if (currentPage > totalPages) {
        currentPage = totalPages;
      }




      const start = (currentPage - 1) * REWARDS_PER_PAGE;
      const currentRewards = filteredRewards.slice(start, start + REWARDS_PER_PAGE);




      tableBody.innerHTML = currentRewards.length
        ? currentRewards
            .map(
              (reward) => `
                <tr>
                  <td>${reward.name}</td>
                  <td>${reward.points}</td>
                  <td><span class="ADMIN-STATUS ${reward.status.toLowerCase()}">${reward.status}</span></td>
                  <td>
                    <div class="ADMIN-TABLE-ACTIONS">
                      <button type="button" aria-label="Edit ${reward.name}">
                        <i class="fa-solid fa-pen"></i>
                      </button>
                      <button type="button" aria-label="Delete ${reward.name}">
                        <i class="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `
            )
            .join("")
        : `
            <tr>
              <td colspan="4" class="ADMIN-NO-DATA">No rewards matched your search.</td>
            </tr>
          `;




      renderPagination(totalPages);
    };




    searchInput.addEventListener("input", () => {
      currentPage = 1;
      renderTable();
    });




    statusSelect.addEventListener("change", () => {
      currentPage = 1;
      renderTable();
    });




    renderTable();
  })();




  // ===================== ITEM PAGE LOGIC ======================
  (function initItemPage() {
    // ====================== ITEM SELECTORS ======================
    const itemSection = qs(".ITEMS-SECTION");
    const itemTitle = qs("#item-title");
    const itemCategory = qs("#item-category");
    const itemPic = qs(".ITEM-PIC");
    const optionsHost = qs("#item-options");




if (!itemSection || !itemTitle || !itemPic || !optionsHost) return;




const params = new URLSearchParams(window.location.search);
    const itemName = (params.get("item") || "Matcha").trim();
    const categoryKey = (params.get("category") || "classic-milktea").trim();
    const imagePath = (params.get("image") || "").trim();




const DRINK_PRICE_DATA = {
      "classic-milktea": {
        "16oz": 90,
        "22oz": 110,
      },
      "premium-milktea": {
        "16oz": 95,
        "22oz": 120,
      },
      "fruit-milk": {
        "16oz": 74,
        "22oz": 95,
      },
      "fruit-tea": {
        "16oz": 65,
        "22oz": 90,
      },
      "cream-cheese": {
        "Choco Hazelnut": { "16oz": 99, "22oz": 130 },
        "Fuji Chocolate": { "16oz": 95, "22oz": 125 },
        "Red Velvet Royale": { "16oz": 95, "22oz": 125 },
        "Matcha Cream Cheese": { "16oz": 99, "22oz": 130 },
        "Okinawa Cream Cheese": { "16oz": 95, "22oz": 125 },
        "Oreo Cream Cheese": { "16oz": 99, "22oz": 130 },
      },
    };




const categoryLabels = {
      "classic-milktea": "Classic Milktea",
      "premium-milktea": "Premium Milktea",
      "cream-cheese": "Cream Cheese Series",
      "fruit-milk": "Fruit Milk",
      "fruit-tea": "Fruit Tea",
      takoyaki: "Takoyaki",
      shawarma: "Shawarma",
      "chicken-wings-fries": "Chicken Wings + Fries",
      burger: "Burger",
      fries: "Fries",
      "all-categories": "All Categories",
      all: "All Categories",
    };




// ======================= ITEM HELPERS =======================
    const normalizeCategory = (raw) => {
      if (!raw) return "Menu";
      if (categoryLabels[raw]) return categoryLabels[raw];




return raw
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };




const toCurrency = (amount) => `PHP ${amount}`;
    const getSelectedValue = (name) =>
      qs(`input[name='${name}']:checked`, itemSection)?.value || "";




const renderSegmentedGroup = ({ label, name, options, defaultValue, wrap = false }) => {
      const classes = wrap ? "segmented-control segmented-wrap" : "segmented-control";




return `
        <div class="option-group">
          <p>${label}:</p>
          <div class="${classes}">
            ${options
              .map((option, index) => {
                const optionId = `${name}-${index}`;
                const checked = option.value === defaultValue ? "checked" : "";
                const priceMarkup = option.price
                  ? `<span class="option-price">${toCurrency(option.price)}</span>`
                  : "";




return `
                  <input type="radio" name="${name}" id="${optionId}" value="${option.value}" ${checked}>
                  <label for="${optionId}">
                    <span class="option-label">${option.label}</span>
                    ${priceMarkup}
                  </label>
                `;
              })
              .join("")}
          </div>
        </div>
      `;
    };




const renderAddonGroup = ({ label, name, options }) => `
      <div class="option-group addons-group">
        <p>${label}:</p>
        <div class="addons">
          ${options
            .map(
              (option, index) => `
                <label class="addon-card">
                  <input type="checkbox" name="${name}" value="${option.value}" data-price="${option.price}" data-addon-input>
                  <span class="addon-check">&#10003;</span>
                  <span class="addon-name">${option.label}</span>
                  <span class="addon-price">+${toCurrency(option.price)}</span>
                </label>
              `
            )
            .join("")}
        </div>
      </div>
    `;




const drinkAddons = [
      { value: "boba", label: "Boba", price: 15 },
      { value: "oreo", label: "Oreo", price: 20 },
      { value: "whip", label: "Whip", price: 25 },
      { value: "nata", label: "Nata", price: 15 },
      { value: "coffee-jelly", label: "Coffee Jelly", price: 15 },
      { value: "white-pearl", label: "White Pearl", price: 20 },
      { value: "fruit-jelly", label: "Fruit Jelly", price: 15 },
    ];




const fallbackImageByItem = {
      matcha: "images/mt_matcha.jpg",
      "red velvet": "images/mt_redvelvet.jpg",
      taro: "images/mt_taro.jpg",
      okinawa: "images/mt_okinawa.jpg",
      wintermelon: "images/mt_wintermelon.jpg",
      hokkaido: "images/mt_hokkaido.jpg",
      "black sugar": "images/pmt_blacksugar.jpg",
      "lava latte": "images/pmt_lavalatte.jpg",
      "cookies n' cream": "images/pmt_cookiesncream.jpg",
      "dark chocolate": "images/pmt_darkchoco.jpg",
      nutella: "images/pmt_nutella.jpg",
      "matcha oreo": "images/pmt_matchaoreo.jpg",
      "black forest": "images/pmt_blackforest.jpg",
      "choco hazelnut": "images/cc_chocohazelnut.jpg",
      "fuji chocolate": "images/cc_fujichocolate.jpg",
      "red velvet royale": "images/cc_redvelvetroyale.jpg",
      "matcha cream cheese": "images/cc_matcha.jpg",
      "okinawa cream cheese": "images/cc_okinawa.jpg",
      "oreo cream cheese": "images/cc_oreo.jpg",
      strawberry: "images/fm_strawberry.jpg",
      blueberry: "images/fm_blueberry.jpg",
      mango: "images/fm_mango.jpg",
      "kiwi fruit": "images/fm_kiwi.jpg",
      "honey peach": "images/fm_honeypeach.jpg",
      "grape fruit": "images/fm_grape.jpg",
      "blue lemonade": "images/ft_bluelemonade.jpg",
      lychee: "images/ft_lychee.jpg",
      "four seasons": "images/ft_fourseasons.jpg",
      "green apple": "images/ft_greenapple.jpg",
      takoyaki: "images/takoyaki.jpg",
      shawarma: "images/shawarma-original.png",
      "hickory barbecue": "images/cwf-hickorybarbeque.png",
      sriracha: "images/cwf-sriracha.png",
      "yangneom (korean flavor)": "images/cwf-yangneom.png",
      "honey mustard": "images/cwf-honeymustard.png",
      "lemon glazed": "images/cwf-lemonglazed.png",
      buffalo: "images/cwf-buffalo.png",
      "soy garlic": "images/cwf-soygarlic.png",
      "plain burger": "images/b-plain.png",
      "egg and cheese burger": "images/b-eggcheese.png",
      "double burger": "images/b-double.png",
      "special burger": "images/b-special.png",
      fries: "images/f-medium.png",
    };




const normalizedItem = itemName.toLowerCase();
    const defaultImage = imagePath || fallbackImageByItem[normalizedItem] || "images/mt_matcha.jpg";




const takoyakiConfig = {
      title: "Takoyaki",
      categoryLabel: "Takoyaki",
      defaultImage,
      renderOptions: () =>
        renderSegmentedGroup({
          label: "Flavor",
          name: "takoyaki-flavor",
          defaultValue: "original",
          options: [
            { value: "original", label: "Original" },
            { value: "cheesy", label: "Cheesy" },
          ],
        }) +
        renderSegmentedGroup({
          label: "Pieces Per Box",
          name: "takoyaki-box",
          defaultValue: "5-pieces",
          options: [
            { value: "5-pieces", label: "5 Pieces" },
            { value: "10-pieces", label: "10 Pieces" },
          ],
        }) +
        renderAddonGroup({
          label: "Add-ons",
          name: "takoyaki-addon",
          options: [
            { value: "katsubushi", label: "Katsubushi", price: 20 },
            { value: "nori", label: "Nori", price: 10 },
            { value: "cheese-slice", label: "Cheese Slice", price: 15 },
            { value: "togarashi", label: "Togarashi (Chili)", price: 10 },
          ],
        }),
      getBasePrice: () => {
        const flavor = getSelectedValue("takoyaki-flavor") || "original";
        const box = getSelectedValue("takoyaki-box") || "5-pieces";
        const priceMatrix = {
          original: { "5-pieces": 60, "10-pieces": 120 },
          cheesy: { "5-pieces": 75, "10-pieces": 150 },
        };




return priceMatrix[flavor]?.[box] || 0;
      },
      getImage: () => {
        const flavor = getSelectedValue("takoyaki-flavor") || "original";
        const imageByFlavor = {
          original: defaultImage,
          cheesy: "images/snacks_menu.jpg",
        };




return imageByFlavor[flavor] || defaultImage;
      },
    };




const shawarmaConfig = {
      title: "Shawarma",
      categoryLabel: "Shawarma",
      defaultImage,
      renderOptions: () =>
        renderSegmentedGroup({
          label: "Flavor",
          name: "shawarma-flavor",
          defaultValue: "original",
          wrap: true,
          options: [
            { value: "original", label: "Original", price: 70 },
            { value: "all-meat", label: "All Meat", price: 80 },
            { value: "cheesy-wrap", label: "Cheesy Wrap", price: 80 },
          ],
        }),
      getBasePrice: () => {
        const flavor = getSelectedValue("shawarma-flavor") || "original";
        const prices = {
          original: 70,
          "all-meat": 80,
          "cheesy-wrap": 80,
        };




return prices[flavor] || 0;
      },
      getImage: () => {
        const flavor = getSelectedValue("shawarma-flavor") || "original";
        const imageByFlavor = {
          original: "images/shawarma-original.png",
          "all-meat": "images/shawarma-allmeat.png",
          "cheesy-wrap": "images/shawarma-cheesywrap.png",
        };




return imageByFlavor[flavor] || defaultImage;
      },
    };




const chickenWingsConfig = {
      title: itemName,
      categoryLabel: "Chicken Wings + Fries",
      defaultImage,
      renderOptions: () =>
        renderSegmentedGroup({
          label: "Serving",
          name: "wings-serving",
          defaultValue: "solo",
          options: [
            { value: "solo", label: "Solo", price: 95 },
            { value: "duo", label: "Duo", price: 180 },
          ],
        }) +
        renderAddonGroup({
          label: "Add-ons",
          name: "wings-addon",
          options: [{ value: "rice", label: "Rice", price: 20 }],
        }),
      getBasePrice: () => {
        const serving = getSelectedValue("wings-serving") || "solo";
        const prices = { solo: 95, duo: 180 };




return prices[serving] || 0;
      },
      getImage: () => defaultImage,
    };




const burgerConfig = {
      title: itemName,
      categoryLabel: "Burger",
      defaultImage,
      renderOptions: () => "",
      getBasePrice: () => {
        const prices = {
          "Plain Burger": 35,
          "Egg and Cheese Burger": 45,
          "Double Burger": 75,
          "Special Burger": 80,
        };




return prices[itemName] || 0;
      },
      getImage: () => defaultImage,
    };




const friesConfig = {
      title: "Fries",
      categoryLabel: "Fries",
      defaultImage,
      renderOptions: () =>
        renderSegmentedGroup({
          label: "Size",
          name: "fries-size",
          defaultValue: "medium",
          options: [
            { value: "medium", label: "Medium", price: 30 },
            { value: "large", label: "Large", price: 60 },
            { value: "jumbo", label: "Jumbo", price: 100 },
          ],
        }),
      getBasePrice: () => {
        const size = getSelectedValue("fries-size") || "medium";
        const prices = { medium: 30, large: 60, jumbo: 100 };




return prices[size] || 0;
      },
      getImage: () => {
        const size = getSelectedValue("fries-size") || "medium";
        const imageBySize = {
          medium: "images/f-medium.png",
          large: "images/f-large.png",
          jumbo: "images/f-jumbo.png",
        };




return imageBySize[size] || defaultImage;
      },
    };




const getDrinkConfig = () => ({
      title: itemName,
      categoryLabel: normalizeCategory(categoryKey),
      defaultImage,
      renderOptions: () =>
        renderSegmentedGroup({
          label: "Size",
          name: "drink-size",
          defaultValue: "16oz",
          options: [
            { value: "16oz", label: "16oz" },
            { value: "22oz", label: "22oz" },
          ],
        }) +
        renderSegmentedGroup({
          label: "Sugar Level",
          name: "drink-sugar",
          defaultValue: "25%",
          options: [
            { value: "25%", label: "25%" },
            { value: "50%", label: "50%" },
            { value: "75%", label: "75%" },
            { value: "100%", label: "100%" },
          ],
        }) +
        renderAddonGroup({
          label: "Add-ons",
          name: "drink-addon",
          options: drinkAddons,
        }),
      getBasePrice: () => {
        const size = getSelectedValue("drink-size") || "16oz";




if (categoryKey === "cream-cheese") {
          return DRINK_PRICE_DATA["cream-cheese"][itemName]?.[size] || 0;
        }




return DRINK_PRICE_DATA[categoryKey]?.[size] || 0;
      },
      getImage: () => defaultImage,
    });




const productConfig =
      categoryKey === "takoyaki"
        ? takoyakiConfig
        : categoryKey === "shawarma"
          ? shawarmaConfig
          : categoryKey === "chicken-wings-fries"
            ? chickenWingsConfig
            : categoryKey === "burger"
              ? burgerConfig
              : categoryKey === "fries"
                ? friesConfig
                : getDrinkConfig();




itemTitle.textContent = productConfig.title;




if (itemCategory) {
      itemCategory.textContent = productConfig.categoryLabel;
    }




optionsHost.innerHTML = productConfig.renderOptions();




// ====================== PRICE LOGIC =======================
    let quantity = 1;




const qtyEl = qs("#qty");
    const totalEl = qs("#total");
    const plusBtn = qs("#plus");
    const minusBtn = qs("#minus");




const updateTotal = () => {
      const basePrice = productConfig.getBasePrice();
      const locationPrice = Number(
        qs("input[name='location']:checked", itemSection)?.dataset.price || 0
      );
      const addonsTotal = qsa("[data-addon-input]:checked", itemSection).reduce(
        (sum, addon) => sum + Number(addon.dataset.price || 0),
        0
      );
      const total = (basePrice + locationPrice + addonsTotal) * quantity;




totalEl.textContent = total;




const nextImage = productConfig.getImage();
      if (nextImage) {
        itemPic.style.backgroundImage = `url('${nextImage}')`;
      }
    };


    const getSelectedLabel = (name) => {
      const selectedInput = qs(`input[name='${name}']:checked`, itemSection);
      if (!selectedInput) return "";
      const label = selectedInput.id ? document.querySelector(`label[for='${selectedInput.id}']`) : null;
      const optionLabel = label ? label.querySelector(".option-label") : null;
      return optionLabel ? optionLabel.textContent.trim() : label ? label.textContent.trim() : selectedInput.value || "";
    };


    const getCheckedAddonEntries = () =>
      qsa("[data-addon-input]:checked", itemSection).map((input) => {
        const addonCard = input.closest(".addon-card");
        const addonName = addonCard ? qs(".addon-name", addonCard) : null;
        return {
          name: addonName ? addonName.textContent.trim() : input.value,
          price: Number(input.dataset.price || 0),
        };
      });


    const getCheckedAddonLabels = () => getCheckedAddonEntries().map((addon) => addon.name);


    const formatAddonEntries = (addonEntries) =>
      addonEntries.map((addon) => `${addon.name} (₱${addon.price})`).join(", ");


    const resolveSizeLabel = () => {
      return (
        getSelectedLabel("drink-size") ||
        getSelectedLabel("fries-size") ||
        getSelectedLabel("wings-serving") ||
        getSelectedLabel("takoyaki-box") ||
        getSelectedLabel("shawarma-flavor") ||
        "N/A"
      );
    };


    const buildCheckoutUrl = () => {
      const basePrice = productConfig.getBasePrice();
      const locationLabel = getSelectedLabel("location") || "Dine In";
      const deliveryFee = Number(
        qs("input[name='location']:checked", itemSection)?.dataset.price || 0
      );
      const sugarLevel = getSelectedLabel("drink-sugar") || "N/A";
      const addonEntries = getCheckedAddonEntries();
      const checkoutParams = new URLSearchParams({
        item: productConfig.title,
        category: productConfig.categoryLabel,
        image: productConfig.getImage() || defaultImage,
        price: String(basePrice),
        quantity: String(quantity),
        size: resolveSizeLabel(),
        flavor:
          getSelectedLabel("takoyaki-flavor") ||
          getSelectedLabel("shawarma-flavor") ||
          "N/A",
        piecesPerBox: getSelectedLabel("takoyaki-box") || "N/A",
        serving: getSelectedLabel("wings-serving") || "N/A",
        location: locationLabel,
        sugar: sugarLevel,
        addons: addonEntries.length ? formatAddonEntries(addonEntries) : "None",
        deliveryFee: String(deliveryFee),
      });


      return `confirmOrder.html?${checkoutParams.toString()}`;
    };




// =================== ITEM INTERACTIONS ====================
    if (plusBtn && qtyEl) {
      plusBtn.addEventListener("click", () => {
        quantity += 1;
        qtyEl.textContent = quantity;
        updateTotal();
      });
    }




if (minusBtn && qtyEl) {
      minusBtn.addEventListener("click", () => {
        if (quantity > 1) {
          quantity -= 1;
        }




qtyEl.textContent = quantity;
        updateTotal();
      });
    }




qsa("input", itemSection).forEach((input) => {
      input.addEventListener("change", updateTotal);
    });




updateTotal();


    const checkoutBtn = qs(".CHECKOUT-BUTTON", itemSection);
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = buildCheckoutUrl();
      });
    }


    // =================== ADD TO CART FUNCTIONALITY ===================
    const addToCartBtn = qs(".ADD-CART-BUTTON", itemSection);
    if (addToCartBtn) {
      const normalizeCartText = (value) => String(value || "").trim().toLowerCase();
      const normalizeAddonsForCart = (value) => {
        const addonsText = normalizeCartText(value);
        if (!addonsText || addonsText === "none" || addonsText === "n/a") return "none";

        return addonsText
          .split(",")
          .map((addon) => addon.trim())
          .filter(Boolean)
          .sort()
          .join("|");
      };
      const getCartItemSignature = (item) =>
        [
          normalizeCartText(item.name),
          normalizeCartText(item.size),
          normalizeCartText(item.location),
          normalizeCartText(item.sugarLevel),
          normalizeAddonsForCart(item.addons),
          normalizeCartText(item.flavor),
          normalizeCartText(item.piecesPerBox),
          normalizeCartText(item.serving),
        ].join("::");

      addToCartBtn.addEventListener("click", (event) => {
        event.preventDefault();
        
        // Check if we're on items.html (non-customer page)
        const isCustomerPage = window.location.pathname.toLowerCase().includes('customeritems.html');
        
        // If on items.html, redirect to login page
        if (!isCustomerPage) {
          window.location.href = 'loginSignUp.html';
          return;
        }
        
        // Get current cart from localStorage
        const cart = JSON.parse(localStorage.getItem('yasCart') || '[]');
        
        // Build cart item with all details
        const basePrice = productConfig.getBasePrice();
        const locationLabel = getSelectedLabel("location") || "Dine In";
        const locationInput = qs("input[name='location']:checked", itemSection);
        const deliveryFee = Number(locationInput?.dataset.price || 0);
        const sugarLevel = getSelectedLabel("drink-sugar") || "N/A";
        const addonEntries = getCheckedAddonEntries();
        
        const cartItem = {
          id: Date.now(),
          name: productConfig.title,
          category: productConfig.categoryLabel,
          image: productConfig.getImage() || defaultImage,
          price: basePrice,
          qty: quantity,
          size: resolveSizeLabel(),
          location: locationLabel,
          deliveryFee: deliveryFee,
          sugarLevel: sugarLevel !== "N/A" ? sugarLevel : "",
          addons: addonEntries.length ? formatAddonEntries(addonEntries) : "None",
          flavor: getSelectedLabel("takoyaki-flavor") || getSelectedLabel("shawarma-flavor") || "",
          piecesPerBox: getSelectedLabel("takoyaki-box") || "",
          serving: getSelectedLabel("wings-serving") || ""
        };
        
        const matchingItemIndex = cart.findIndex(
          (item) => getCartItemSignature(item) === getCartItemSignature(cartItem)
        );
        
        if (matchingItemIndex !== -1) {
          cart[matchingItemIndex] = {
            ...cart[matchingItemIndex],
            ...cartItem,
            id: cart[matchingItemIndex].id,
            qty: cartItem.qty,
          };
          alert('Cart item quantity updated!');
        } else {
          cart.unshift(cartItem);
          alert('Item added to cart!');
        }
        
        // Save updated cart
        localStorage.setItem('yasCart', JSON.stringify(cart));
      });
    }
  })();




  const panel = document.getElementById("panel");
  const goLogin = document.getElementById("goLogin");
  const goSignup = document.getElementById("goSignup");


  if (panel && goLogin && goSignup) {
    goLogin.onclick = () => {
      panel.classList.add("active");
    };


    goSignup.onclick = () => {
      panel.classList.remove("active");
    };
  }


  // ===================== CONFIRM ORDER LOGIC ======================
  (function initConfirmOrderPage() {
    const orderSummary = qs(".ORDER-SUMMARY");
    if (!orderSummary) return;


    // Checkout source rules:
    // - If URL has item params, this is direct checkout from customerItems.html
    //   and should NOT include cart items.
    // - If URL has no item params, this is checkout from cart page.
    const params = new URLSearchParams(window.location.search);
    const hasUrlParams = params.has("item");
    const storedCart = JSON.parse(localStorage.getItem('yasCart') || '[]');
    const hasStoredCart = Array.isArray(storedCart) && storedCart.length > 0;
    
    let cart = [];
    let deliveryFee = 0;

    const selectedLocationInput = () => document.querySelector("input[name='order_location']:checked");
    const getSelectedLocation = () => selectedLocationInput()?.value || "dine_in";
    const getSelectedLocationLabel = () => {
      const location = getSelectedLocation();
      if (location === "delivery") return "Delivery";
      if (location === "to_go") return "To Go";
      return "Dine In";
    };
    const getOrderDeliveryFee = () => (getSelectedLocation() === "delivery" ? 25 : 0);
    const updateOrderTotals = () => {
      deliveryFee = getOrderDeliveryFee();
      const total = subtotal + deliveryFee;
      const deliveryFeeRow = qs("#delivery-fee-row");
      if (deliveryFeeRow) {
        deliveryFeeRow.style.display = getSelectedLocation() === "delivery" ? "flex" : "none";
      }
      if (deliveryFeeEl) deliveryFeeEl.textContent = toPeso(deliveryFee);
      if (totalEl) totalEl.textContent = toPeso(total);
    };


    if (hasUrlParams) {
      // Single item checkout from items page
      const itemName = (params.get("item") || "Matcha").trim();
      const itemCategory = (params.get("category") || "Classic Milktea").trim();
      const itemImage = (params.get("image") || "images/mt_matcha.jpg").trim();
      const itemPrice = Number(params.get("price") || 90);
      const quantity = Math.max(1, Number(params.get("quantity") || 1));
      const size = (params.get("size") || "16oz").trim();
      const flavor = (params.get("flavor") || "N/A").trim();
      const piecesPerBox = (params.get("piecesPerBox") || "N/A").trim();
      const serving = (params.get("serving") || "N/A").trim();
      const sugar = (params.get("sugar") || "100%").trim();
      const addons = (params.get("addons") || "None").trim();


      cart = [{
        name: itemName,
        category: itemCategory,
        image: itemImage,
        price: itemPrice,
        qty: quantity,
        size: size,
        location: "",
        sugarLevel: sugar !== "N/A" ? sugar : "",
        addons: addons,
        flavor: flavor !== "N/A" ? flavor : "",
        piecesPerBox: piecesPerBox !== "N/A" ? piecesPerBox : "",
        serving: serving !== "N/A" ? serving : ""
      }];
    } else if (hasStoredCart) {
      cart = storedCart;
      deliveryFee = 0;
    } else {
      cart = [];
    }


    const toPeso = (amount) => `₱${amount}`;
    const orderCountEl = qs("#order-count");
    const orderItemsContainer = qs("#order-items-container");
    const subtotalEl = qs("#confirm-item-subtotal");
    const deliveryFeeEl = qs("#confirm-item-delivery-fee");
    const totalEl = qs("#confirm-item-total");
    const locationInputs = qsa("input[name='order_location']");


    const parseAddonEntries = (addonsValue) => {
      const addonsText = String(addonsValue || "").trim();
      if (!addonsText || addonsText.toLowerCase() === "none") return [];

      return addonsText
        .split(",")
        .map((addon) => addon.trim())
        .filter(Boolean)
        .map((addon) => {
          const pricedAddon = addon.match(/^(.*?)(?:\s*\((?:₱|php|p)?\s*([\d.]+)\))?$/i);
          const addonName = (pricedAddon?.[1] || addon).trim();
          const addonPrice = Number(pricedAddon?.[2] || 0);
          return { name: addonName, price: addonPrice };
        });
    };

    const getItemQty = (item) => Math.max(1, Number(item.qty || item.quantity || 1));
    const getItemUnitTotal = (item) => {
      const basePrice = Number(item.price || 0);
      const addonsTotal = parseAddonEntries(item.addons).reduce(
        (sum, addon) => sum + Number(addon.price || 0),
        0
      );
      return basePrice + addonsTotal;
    };


    // Calculate totals
    let subtotal = 0;
    cart.forEach(item => {
      subtotal += getItemUnitTotal(item) * getItemQty(item);
    });
    const total = subtotal + deliveryFee;


    // Update order count
    if (orderCountEl) {
      orderCountEl.textContent = cart.length === 1 ? '1 Item' : `${cart.length} Items`;
    }


    // Render cart items
    if (orderItemsContainer) {
      orderItemsContainer.innerHTML = '';

      cart.forEach(item => {
        const orderItemDiv = document.createElement('div');
        orderItemDiv.className = 'ORDER-ITEM';
        const itemSizePrice = Number(item.price || 0);
        const itemCategory = String(item.category || "").trim();
        const itemSize = item.size || "N/A";
        const itemLocation = getSelectedLocationLabel();
        const itemSugarLevel = item.sugarLevel || "N/A";
        const sugarFee = "";
        const itemFlavor = item.flavor || "N/A";
        const itemPieces = item.piecesPerBox || "N/A";
        const itemServing = item.serving || "N/A";
        const addonEntries = parseAddonEntries(item.addons);
        const addonsTotal = addonEntries.reduce((sum, addon) => sum + Number(addon.price || 0), 0);
        const itemQty = getItemQty(item);
        const itemTotal = getItemUnitTotal(item) * itemQty;
        const addonRows = addonEntries.length
          ? addonEntries
              .map(
                (addon) => `
                  <div class="ORDER-ITEM-BREAKDOWN-ROW ORDER-ITEM-BREAKDOWN-ADDON">
                    <span>${addon.name}</span>
                    <span>${toPeso(addon.price)}</span>
                  </div>
                `
              )
              .join("")
          : `
              <div class="ORDER-ITEM-BREAKDOWN-ROW ORDER-ITEM-BREAKDOWN-ADDON">
                <span>None</span>
                <span>${toPeso(0)}</span>
              </div>
            `;
        let optionRowsHTML = "";
        const normalizedCategory = itemCategory.toLowerCase();

        if (normalizedCategory === "takoyaki") {
          optionRowsHTML = `
              <div class="ORDER-ITEM-BREAKDOWN-ROW">
                <span>Flavor: ${itemFlavor}</span>
                <span></span>
              </div>
              <div class="ORDER-ITEM-BREAKDOWN-ROW">
                <span>Pieces Per Box: ${itemPieces}</span>
                <span>${toPeso(itemSizePrice)}</span>
              </div>
          `;
        } else if (normalizedCategory === "shawarma") {
          optionRowsHTML = `
              <div class="ORDER-ITEM-BREAKDOWN-ROW">
                <span>Flavor: ${itemFlavor}</span>
                <span>${toPeso(itemSizePrice)}</span>
              </div>
          `;
        } else if (normalizedCategory === "chicken wings + fries") {
          optionRowsHTML = `
              <div class="ORDER-ITEM-BREAKDOWN-ROW">
                <span>Serving: ${itemServing}</span>
                <span>${toPeso(itemSizePrice)}</span>
              </div>
          `;
        } else if (normalizedCategory === "burger") {
          optionRowsHTML = `
              <div class="ORDER-ITEM-BREAKDOWN-ROW">
                <span>Burger: ${item.name || "N/A"}</span>
                <span>${toPeso(itemSizePrice)}</span>
              </div>
          `;
        } else if (normalizedCategory === "fries") {
          optionRowsHTML = `
              <div class="ORDER-ITEM-BREAKDOWN-ROW">
                <span>Size: ${itemSize}</span>
                <span>${toPeso(itemSizePrice)}</span>
              </div>
          `;
        } else {
          // Drinks
          optionRowsHTML = `
              <div class="ORDER-ITEM-BREAKDOWN-ROW">
                <span>Size: ${itemSize}</span>
                <span>${toPeso(itemSizePrice)}</span>
              </div>
              <div class="ORDER-ITEM-BREAKDOWN-ROW">
                <span>Sugar Level: ${itemSugarLevel}</span>
                <span>${sugarFee}</span>
              </div>
          `;
        }


        orderItemDiv.innerHTML = `
          <div class="ORDER-ITEM-IMAGE">
            <img src="${item.image || 'images/yas_logo.png'}" alt="${item.name}">
          </div>
          <div class="ORDER-ITEM-DETAILS">
            <div class="ORDER-ITEM-HEADING">
              <h3>${item.name}</h3>
              <span class="ORDER-ITEM-CATEGORY">${item.category || ''}</span>
            </div>
            <div class="ORDER-ITEM-META">
              ${optionRowsHTML}
              <div class="ORDER-ITEM-BREAKDOWN-ROW">
                <span>Add-on:</span>
                <span>${toPeso(addonsTotal)}</span>
              </div>
              ${addonRows}
              <div class="ORDER-ITEM-BREAKDOWN-ROW">
                <span>Quantity:</span>
                <span>${itemQty}x</span>
              </div>
              <div class="ORDER-ITEM-BREAKDOWN-ROW ORDER-ITEM-BREAKDOWN-TOTAL">
                <span>Total</span>
                <span>${toPeso(itemTotal)}</span>
              </div>
            </div>
          </div>
          <strong class="ORDER-ITEM-PRICE"></strong>
        `;
        
        orderItemsContainer.appendChild(orderItemDiv);
      });
    }


    // Update totals
    if (subtotalEl) subtotalEl.textContent = toPeso(subtotal);
    updateOrderTotals();

    if (locationInputs.length) {
      locationInputs.forEach((radio) => radio.addEventListener("change", updateOrderTotals));
    }

    const placeOrderBtn = qs(".PLACE-ORDER-BUTTON");
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        if (!cart.length) {
          alert("Your order is empty.");
          return;
        }

        const selectedPaymentInput = document.querySelector("input[name='payment_method']:checked");
        const paymentMethod = selectedPaymentInput?.value || "cash_on_delivery";
        const selectedLocation = getSelectedLocation();
        const locationLabel = getSelectedLocationLabel();
        const orderType = selectedLocation === "delivery" ? "delivery" : selectedLocation === "to_go" ? "to-go" : "dine-in";

        const payloadItems = cart.map((item) => ({
          product_id: item.product_id || item.productId || null,
          product_name: item.name || "",
          category: item.category || "",
          location: locationLabel,
          size: item.size || null,
          sugar_level: item.sugarLevel || null,
          addons: item.addons || "None",
          flavor: item.flavor || null,
          pieces_per_box: item.piecesPerBox || null,
          serving: item.serving || null,
          quantity: getItemQty(item),
          price: getItemUnitTotal(item),
        }));

        try {
          placeOrderBtn.classList.add("is-loading");
          placeOrderBtn.style.pointerEvents = "none";

          const response = await fetch("api/place_order.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_type: orderType,
              payment_method: paymentMethod,
              delivery_fee: deliveryFee,
              items: payloadItems,
            }),
          });

          const result = await response.json();
          if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to place order.");
          }

          const orderId = Number(result.order_id || 0);
          if (!orderId) {
            throw new Error("Order created but no order ID was returned.");
          }

          if (!hasUrlParams) {
            localStorage.removeItem("yasCart");
          }
          localStorage.setItem("yasLastOrderId", String(orderId));
          window.location.href = `OrderSuccessful.html?orderId=${encodeURIComponent(orderId)}`;
        } catch (error) {
          alert(error.message || "Failed to place order. Please try again.");
        } finally {
          placeOrderBtn.classList.remove("is-loading");
          placeOrderBtn.style.pointerEvents = "";
        }
      });
    }
  })();


});



