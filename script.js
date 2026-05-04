document.addEventListener("DOMContentLoaded", () => {
  // ===================== HELPER SELECTORS =====================
  const qs = (sel, ctx = document) => (ctx && ctx.querySelector ? ctx.querySelector(sel) : null);
  const qsa = (sel, ctx = document) => (ctx && ctx.querySelectorAll ? Array.from(ctx.querySelectorAll(sel)) : []);




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


    const insertAccountLink = () => {
      if (qs('a[href="customerAccount.html"]', userDropdown)) return;
      const logoutLink = qs('a[href="index.html"]', userDropdown);
      const accountLink = document.createElement("a");
      accountLink.href = "customerAccount.html";
      accountLink.textContent = "Account";
      if (logoutLink) {
        userDropdown.insertBefore(accountLink, logoutLink);
      } else {
        userDropdown.appendChild(accountLink);
      }
    };

    insertAccountLink();

    const toggleDropdown = (event) => {
      event.preventDefault();
      event.stopPropagation();
      userDropdown.classList.toggle("show");
      userMenuToggle.classList.toggle("open");
    };


    userMenuToggle.addEventListener("click", toggleDropdown);


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


    if (!customerCount) return;


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

        customerCount.textContent = result.customer_count;
      })
      .catch(() => {
        customerCount.textContent = "--";
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




    const adminProducts = [
      { id: 1, name: "Matcha", category: "Classic Milktea", price16: 90, price22: 110, description: "Smooth and earthy with a comforting green tea taste.", image: "images/mt_matcha.jpg" },
      { id: 2, name: "Okinawa", category: "Classic Milktea", price16: 90, price22: 110, description: "Caramel-like brown sugar milk tea that feels warm and cozy.", image: "images/mt_okinawa.jpg" },
      { id: 3, name: "Red Velvet", category: "Classic Milktea", price16: 90, price22: 110, description: "Sweet, creamy, and cake-like with a hint of cocoa.", image: "images/mt_redvelvet.jpg" },
      { id: 4, name: "Wintermelon", category: "Classic Milktea", price16: 90, price22: 110, description: "Light, sweet, and refreshing with a mellow honey vibe.", image: "images/mt_wintermelon.jpg" },
      { id: 5, name: "Taro", category: "Classic Milktea", price16: 90, price22: 110, description: "Soft, nutty, and sweet with that classic purple flavor.", image: "images/mt_taro.jpg" },
      { id: 6, name: "Hokkaido", category: "Classic Milktea", price16: 90, price22: 110, description: "Rich, creamy, and buttery with a deep caramel taste.", image: "images/mt_hokkaido.jpg" },
      { id: 7, name: "Black Sugar", category: "Premium Milktea", price16: 95, price22: 120, description: "Sweet, smoky caramel flavor with a rich milk base.", image: "images/pmt_blacksugar.jpg" },
      { id: 8, name: "Lava Latte", category: "Premium Milktea", price16: 95, price22: 120, description: "Bold coffee flavor with a creamy, milky finish.", image: "images/pmt_lavalatte.jpg" },
      { id: 9, name: "Cookies n' Cream", category: "Premium Milktea", price16: 95, price22: 120, description: "Creamy blend with crushed cookies in every sip.", image: "images/pmt_cookiesncream.jpg" },
      { id: 10, name: "Dark Chocolate", category: "Premium Milktea", price16: 95, price22: 120, description: "Deep, bittersweet cocoa for chocolate lovers.", image: "images/pmt_darkchoco.jpg" },
      { id: 11, name: "Nutella", category: "Premium Milktea", price16: 95, price22: 120, description: "Smooth chocolate-hazelnut drink that feels like dessert.", image: "images/pmt_nutella.jpg" },
      { id: 12, name: "Matcha Oreo", category: "Premium Milktea", price16: 95, price22: 120, description: "Earthy matcha mixed with crunchy, sweet Oreo goodness.", image: "images/pmt_matchaoreo.jpg" },
      { id: 13, name: "Black Forest", category: "Premium Milktea", price16: 95, price22: 120, description: "Chocolatey drink with a hint of cherry sweetness.", image: "images/pmt_blackforest.jpg" },
      { id: 14, name: "Choco Hazelnut", category: "Cream Cheese Series", price16: 99, price22: 130, description: "Creamy chocolate-hazelnut drink topped with silky cream cheese.", image: "images/cc_chocohazelnut.jpg" },
      { id: 15, name: "Matcha Cream Cheese", category: "Cream Cheese Series", price16: 99, price22: 130, description: "Earthy matcha paired with a salty-sweet cream cheese topping.", image: "images/cc_matcha.jpg" },
      { id: 16, name: "Fuji Chocolate", category: "Cream Cheese Series", price16: 95, price22: 125, description: "Smooth, premium chocolate flavor with a rich cream cheese finish.", image: "images/cc_fujichocolate.jpg" },
      { id: 17, name: "Okinawa Cream Cheese", category: "Cream Cheese Series", price16: 95, price22: 125, description: "Brown sugar milk tea topped with creamy, fluffy cheese foam.", image: "images/cc_okinawa.jpg" },
      { id: 18, name: "Red Velvet Royale", category: "Cream Cheese Series", price16: 95, price22: 125, description: "Sweet red velvet blend made extra luxurious with cream cheese foam.", image: "images/cc_redvelvetroyale.jpg" },
      { id: 19, name: "Oreo Cream Cheese", category: "Cream Cheese Series", price16: 99, price22: 130, description: "Crushed Oreo in a creamy drink finished with thick cream cheese.", image: "images/cc_oreo.jpg" },
      { id: 20, name: "Strawberry", category: "Fruit Milk", price16: 74, price22: 95, description: "Creamy milk with a fresh, juicy strawberry taste.", image: "images/fm_strawberry.jpg" },
      { id: 21, name: "Kiwi Fruit", category: "Fruit Milk", price16: 74, price22: 95, description: "Light, tangy kiwi mixed with smooth, sweet milk.", image: "images/fm_kiwi.jpg" },
      { id: 22, name: "Blueberry", category: "Fruit Milk", price16: 74, price22: 95, description: "Smooth and milky with a soft, berry sweetness.", image: "images/fm_blueberry.jpg" },
      { id: 23, name: "Honey Peach", category: "Fruit Milk", price16: 74, price22: 95, description: "Soft peach flavor with a gentle honey-like sweetness.", image: "images/fm_honeypeach.jpg" },
      { id: 24, name: "Mango", category: "Fruit Milk", price16: 74, price22: 95, description: "Rich, tropical mango flavor blended with creamy milk.", image: "images/fm_mango.jpg" },
      { id: 25, name: "Grape Fruit", category: "Fruit Milk", price16: 74, price22: 95, description: "Sweet, fruity grape taste blended into creamy milk.", image: "images/fm_grape.jpg" },
      { id: 26, name: "Blueberry", category: "Fruit Tea", price16: 65, price22: 90, description: "Bright, sweet blueberry flavor with a crisp tea base.", image: "images/ft_blueberry.jpg" },
      { id: 27, name: "Lychee", category: "Fruit Tea", price16: 65, price22: 90, description: "Soft, floral lychee flavor with a refreshing finish.", image: "images/ft_lychee.jpg" },
      { id: 28, name: "Blue Lemonade", category: "Fruit Tea", price16: 65, price22: 90, description: "Cool, citrusy blend with a splash of blue lemonade tang.", image: "images/ft_bluelemonade.jpg" },
      { id: 29, name: "Four Seasons", category: "Fruit Tea", price16: 65, price22: 90, description: "Fruity mix of citrus and tropical flavors in one cup.", image: "images/ft_fourseasons.jpg" },
      { id: 30, name: "Strawberry", category: "Fruit Tea", price16: 65, price22: 90, description: "Light tea mixed with fresh, juicy strawberry sweetness.", image: "images/ft_strawberry.jpg" },
      { id: 31, name: "Green Apple", category: "Fruit Tea", price16: 65, price22: 90, description: "Crisp, tart green apple blended with smooth tea.", image: "images/ft_greenapple.jpg" },
      { id: 32, name: "Takoyaki", category: "Takoyaki", price16: 60, price22: 120, description: "A snack favorite with crispy bites and savory toppings.", image: "images/takoyaki.jpg" },
      { id: 33, name: "Shawarma", category: "Shawarma", price16: 60, price22: 90, description: "Warm wraps with savory fillings and bold flavor.", image: "images/shawarma-original.png" },
      { id: 34, name: "Hickory Barbecue", category: "Chicken Wings + Fries", price16: 95, price22: 180, description: "Smoky chicken wings with fries.", image: "images/cwf-hickorybarbeque.png" },
      { id: 35, name: "Sriracha", category: "Chicken Wings + Fries", price16: 95, price22: 180, description: "Spicy wings and fries with a bold kick.", image: "images/cwf-sriracha.png" },
      { id: 36, name: "Yangneom (Korean Flavor)", category: "Chicken Wings + Fries", price16: 95, price22: 180, description: "Sweet and spicy Korean-style wings paired with fries.", image: "images/cwf-yangneom.png" },
      { id: 37, name: "Honey Mustard", category: "Chicken Wings + Fries", price16: 95, price22: 180, description: "Tangy-sweet wings with fries.", image: "images/cwf-honeymustard.png" },
      { id: 38, name: "Lemon Glazed", category: "Chicken Wings + Fries", price16: 95, price22: 180, description: "Zesty glazed wings with fries.", image: "images/cwf-lemonglazed.png" },
      { id: 39, name: "Buffalo", category: "Chicken Wings + Fries", price16: 95, price22: 180, description: "Classic buffalo wings and fries.", image: "images/cwf-buffalo.png" },
      { id: 40, name: "Soy Garlic", category: "Chicken Wings + Fries", price16: 95, price22: 180, description: "Garlicky glazed wings with fries.", image: "images/cwf-soygarlic.png" },
      { id: 41, name: "Plain Burger", category: "Burger", price16: 35, price22: null, description: "A simple savory burger.", image: "images/b-plain.png" },
      { id: 42, name: "Egg and Cheese Burger", category: "Burger", price16: 45, price22: null, description: "A richer burger combo.", image: "images/b-eggcheese.png" },
      { id: 43, name: "Double Burger", category: "Burger", price16: 75, price22: null, description: "A bigger burger option.", image: "images/b-double.png" },
      { id: 44, name: "Special Burger", category: "Burger", price16: 80, price22: null, description: "A loaded burger pick.", image: "images/b-special.png" },
      { id: 45, name: "Fries", category: "Fries", price16: 30, price22: 100, description: "Crispy fries ready for snacking.", image: "images/f-medium.png" },
    ];




    const formatPrice = (product) =>
      product.price22 ? `PHP ${product.price16} / PHP ${product.price22}` : `PHP ${product.price16}`;




    const categories = ["All Categories", ...new Set(adminProducts.map((product) => product.category))];
    categorySelect.innerHTML = categories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join("");
    formCategory.innerHTML = categories
      .filter((category) => category !== "All Categories")
      .map((category) => `<option value="${category}">${category}</option>`)
      .join("");




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
                      <button type="button" aria-label="Delete ${product.name}"><i class="fa-regular fa-trash-can"></i></button>
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




    productForm.addEventListener("submit", (event) => {
      event.preventDefault();




      const name = nameInput.value.trim();
      const category = formCategory.value;
      const price16 = price16Input.value ? Number(price16Input.value) : null;
      const price22 = price22Input.value ? Number(price22Input.value) : null;
      const description = descriptionInput.value.trim();
      const image = uploadedImageData || imageUrlInput.value.trim();




      if (!name || !category || !price16) return;




      if (activeEditId !== null) {
        const product = adminProducts.find((item) => item.id === activeEditId);
        if (product) {
          product.name = name;
          product.category = category;
          product.price16 = price16;
          product.price22 = price22;
          product.description = description;
          product.image = image || product.image;
        }
      } else {
        adminProducts.unshift({
          id: Date.now(),
          name,
          category,
          price16,
          price22,
          description,
          image: image || "images/footer_logo.png",
        });
      }




      categorySelect.innerHTML = ["All Categories", ...new Set(adminProducts.map((product) => product.category))]
        .map((categoryItem) => `<option value="${categoryItem}">${categoryItem}</option>`)
        .join("");
      formCategory.innerHTML = [...new Set(adminProducts.map((product) => product.category))]
        .map((categoryItem) => `<option value="${categoryItem}">${categoryItem}</option>`)
        .join("");




      currentPage = 1;
      closeModal();
      renderTable();
    });




    renderTable();
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




    const orders = [
      { id: "#ORD-1001", customer: "Juan Dela Cruz", items: "Matcha, Taro", total: 180, status: "Pending" },
      { id: "#ORD-1002", customer: "Maria Santos", items: "Brown Sugar, Fries", total: 250, status: "Preparing" },
      { id: "#ORD-1003", customer: "Kevin Reyes", items: "Mango Tea", total: 110, status: "Completed" },
      { id: "#ORD-1004", customer: "Angelica Lee", items: "Burger, Wings", total: 300, status: "Canceled" },
      { id: "#ORD-1005", customer: "John Paul", items: "Taro, Takoyaki", total: 190, status: "Pending" },
      { id: "#ORD-1006", customer: "Alyssa Cruz", items: "Blue Lemonade, Fries", total: 155, status: "Preparing" },
      { id: "#ORD-1007", customer: "Kris Aquino", items: "Nutella, Shawarma", total: 185, status: "Completed" },
      { id: "#ORD-1008", customer: "Mark Reyes", items: "Matcha Oreo, Burger", total: 195, status: "Pending" },
      { id: "#ORD-1009", customer: "Diana Lopez", items: "Hickory Barbecue, Fries", total: 210, status: "Completed" },
      { id: "#ORD-1010", customer: "Paolo Santos", items: "Strawberry, Takoyaki", total: 170, status: "Canceled" },
    ];




    const statuses = ["All Status", ...new Set(orders.map((order) => order.status))];
    statusSelect.innerHTML = statuses
      .map((status) => `<option value="${status}">${status}</option>`)
      .join("");




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
                  <td>PHP ${order.total}</td>
                  <td><span class="ADMIN-STATUS ${order.status.toLowerCase()}">${order.status}</span></td>
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




    renderTable();
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




    const customers = [
      { name: "Juan Dela Cruz", email: "juan@email.com", totalOrders: 12, status: "Active" },
      { name: "Maria Santos", email: "maria@email.com", totalOrders: 8, status: "Active" },
      { name: "Kevin Reyes", email: "kevin@email.com", totalOrders: 15, status: "Active" },
      { name: "Angelica Lee", email: "angel@email.com", totalOrders: 5, status: "Inactive" },
      { name: "John Paul", email: "john@email.com", totalOrders: 9, status: "Active" },
      { name: "Diana Lopez", email: "diana@email.com", totalOrders: 7, status: "Active" },
      { name: "Paolo Santos", email: "paolo@email.com", totalOrders: 11, status: "Inactive" },
      { name: "Alyssa Cruz", email: "alyssa@email.com", totalOrders: 14, status: "Active" },
      { name: "Mark Reyes", email: "mark@email.com", totalOrders: 6, status: "Active" },
      { name: "Sofia Lim", email: "sofia@email.com", totalOrders: 10, status: "Inactive" },
    ];




    const statuses = ["All Status", ...new Set(customers.map((customer) => customer.status))];
    statusSelect.innerHTML = statuses
      .map((status) => `<option value="${status}">${status}</option>`)
      .join("");




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
            { value: "all-meat", label: "All Meat", price: 90 },
            { value: "cheesy-wrap", label: "Cheesy Wrap", price: 60 },
          ],
        }),
      getBasePrice: () => {
        const flavor = getSelectedValue("shawarma-flavor") || "original";
        const prices = {
          original: 70,
          "all-meat": 90,
          "cheesy-wrap": 60,
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


    const getCheckedAddonLabels = () =>
      qsa("[data-addon-input]:checked", itemSection).map((input) => {
        const addonCard = input.closest(".addon-card");
        const addonName = addonCard ? qs(".addon-name", addonCard) : null;
        return addonName ? addonName.textContent.trim() : input.value;
      });


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
      const addons = getCheckedAddonLabels();
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
        addons: addons.length ? addons.join(", ") : "None",
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
        const addons = getCheckedAddonLabels();
        
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
          addons: addons.length ? addons.join(", ") : "None",
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


    // Check if coming from cart or direct checkout
    const params = new URLSearchParams(window.location.search);
    const hasUrlParams = params.has("item");
    
    let cart = [];
    let deliveryFee = 0;


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
      const location = (params.get("location") || "Delivery").trim();
      const sugar = (params.get("sugar") || "100%").trim();
      const addons = (params.get("addons") || "None").trim();
      deliveryFee = Number(params.get("deliveryFee") || 0);


      cart = [{
        name: itemName,
        category: itemCategory,
        image: itemImage,
        price: itemPrice,
        qty: quantity,
        size: size,
        location: location,
        sugarLevel: sugar !== "N/A" ? sugar : "",
        addons: addons,
        flavor: flavor !== "N/A" ? flavor : "",
        piecesPerBox: piecesPerBox !== "N/A" ? piecesPerBox : "",
        serving: serving !== "N/A" ? serving : ""
      }];
    } else {
      // Multiple items from cart
      cart = JSON.parse(localStorage.getItem('yasCart') || '[]');
      
      // Calculate total delivery fee from all items
      deliveryFee = 0;
      cart.forEach(item => {
        if (item.deliveryFee) {
          deliveryFee += item.deliveryFee;
        }
      });
    }


    const toPeso = (amount) => `₱${amount}`;
    const orderCountEl = qs("#order-count");
    const orderItemsContainer = qs("#order-items-container");
    const subtotalEl = qs("#confirm-item-subtotal");
    const deliveryFeeEl = qs("#confirm-item-delivery-fee");
    const totalEl = qs("#confirm-item-total");


    // Calculate totals
    let subtotal = 0;
    cart.forEach(item => {
      subtotal += item.price * item.qty;
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
        
        // Build detail lines based on category
        let detailLines = [];
        
        const categoryLinesMap = {
          'Takoyaki': [
            item.flavor ? `Flavor: ${item.flavor}` : '',
            item.location ? `Location: ${item.location}` : '',
            item.piecesPerBox ? `Pieces Per Box: ${item.piecesPerBox}` : '',
            item.addons && item.addons !== 'None' ? `Add-ons: ${item.addons}` : '',
          ],
          'Shawarma': [
            item.flavor ? `Flavor: ${item.flavor}` : '',
            item.location ? `Location: ${item.location}` : '',
          ],
          'Chicken Wings + Fries': [
            item.serving ? `Serving: ${item.serving}` : '',
            item.location ? `Location: ${item.location}` : '',
            item.addons && item.addons !== 'None' ? `Add-ons: ${item.addons}` : '',
          ],
          'Burger': [
            item.location ? `Location: ${item.location}` : '',
          ],
          'Fries': [
            item.size ? `Size: ${item.size}` : '',
            item.location ? `Location: ${item.location}` : '',
          ],
        };


        if (categoryLinesMap[item.category]) {
          detailLines = categoryLinesMap[item.category].filter(line => line);
        } else {
          // Default for drinks
          detailLines = [
            item.size ? `Size: ${item.size}` : '',
            item.location ? `Location: ${item.location}` : '',
            item.sugarLevel ? `Sugar Level: ${item.sugarLevel}` : '',
            item.addons && item.addons !== 'None' ? `Add-ons: ${item.addons}` : '',
          ].filter(line => line);
        }


        const detailHTML = detailLines.map(line => `<p>${line}</p>`).join('');
        const itemTotal = item.price * item.qty;


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
              ${detailHTML}
              <p>Quantity: ${item.qty}</p>
            </div>
          </div>
          <strong class="ORDER-ITEM-PRICE">${toPeso(itemTotal)}</strong>
        `;
        
        orderItemsContainer.appendChild(orderItemDiv);
      });
    }


    // Update totals
    if (subtotalEl) subtotalEl.textContent = toPeso(subtotal);
    if (deliveryFeeEl) deliveryFeeEl.textContent = toPeso(deliveryFee);
    if (totalEl) totalEl.textContent = toPeso(total);
  })();


});



