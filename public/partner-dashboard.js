// public/js/partner-dashboard.js
// Uses global `auth` and `db` from firebase.js (compat SDK)

// Simple helper for nav
function go(url) {
  window.location.href = url;
}

const Dashboard = {
  user: null,
  partner: null,
  store: null,

  init() {
    // mobile nav
    const mobileToggle = document.getElementById("mobile-menu-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    if (mobileToggle && mobileNav) {
      mobileToggle.addEventListener("click", () => {
        mobileNav.classList.toggle("-translate-x-full");
      });
    }

    // auth guard
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        go("loginpage.html?role=partner");
        return;
      }
      if (!user.emailVerified) {
        alert("Your email is not verified yet. Please verify and login again.");
        await auth.signOut();
        go("loginpage.html?role=partner");
        return;
      }

      this.user = user;
      await this.loadPartner();
      await this.loadStore();
      await this.fillHeader();
      await this.loadStats();
      this.wireButtons();
    });
  },

  async loadPartner() {
    try {
      const snap = await db.collection("partners").doc(this.user.uid).get();
      this.partner = snap.exists ? snap.data() : {};
    } catch (e) {
      console.error("loadPartner error", e);
      this.partner = {};
    }
  },

  async loadStore() {
    try {
      const storeSnap = await db
        .collection("stores")
        .where("partnerId", "==", this.user.uid)
        .limit(1)
        .get();

      if (!storeSnap.empty) {
        const doc = storeSnap.docs[0];
        this.store = { id: doc.id, ...doc.data() };
      } else {
        this.store = null;
      }
    } catch (e) {
      console.error("loadStore error", e);
      this.store = null;
    }
  },

  async fillHeader() {
    const name =
      this.partner.fullname ||
      this.partner.name ||
      this.user.displayName ||
      this.user.email ||
      "Partner";

    const email = this.partner.email || this.user.email || "";

    const partnerNameEl = document.getElementById("partner-name");
    const partnerEmailEl = document.getElementById("partner-email");
    const avatarInitialsEl = document.getElementById("partner-avatar-initials");
    const overviewPartnerNameEl = document.getElementById("overview-partner-name");
    const storeNameHeaderEl = document.getElementById("store-name");
    const storeNameOverviewEl = document.getElementById("overview-store-name");
    const storeLocationEl = document.getElementById("store-location");
    const sidebarStoreIdEl = document.getElementById("sidebar-store-id");
    const currentPlanEl = document.getElementById("current-plan");
    const sidebarPlanLabelEl = document.getElementById("sidebar-plan-label");
    const mobilePlanLabelEl = document.getElementById("mobile-plan-label");
    const planDescEl = document.getElementById("plan-description");

    const plan = this.partner.plan || "Free";

    if (partnerNameEl) partnerNameEl.textContent = name;
    if (partnerEmailEl) partnerEmailEl.textContent = email;
    if (overviewPartnerNameEl) overviewPartnerNameEl.textContent = name;

    if (avatarInitialsEl) {
      avatarInitialsEl.textContent = (name || "?").charAt(0).toUpperCase();
    }

    if (this.store) {
      const sname = this.store.name || this.store.storeName || "Your store";
      if (storeNameHeaderEl) storeNameHeaderEl.textContent = sname;
      if (storeNameOverviewEl) storeNameOverviewEl.textContent = sname;
      if (storeLocationEl) {
        const city = this.store.city || "";
        const state = this.store.state || "";
        storeLocationEl.textContent = city || state ? `${city}, ${state}` : "Location not set";
      }
      if (sidebarStoreIdEl) sidebarStoreIdEl.textContent = this.store.id;
    } else {
      if (storeNameHeaderEl) storeNameHeaderEl.textContent = "Create your first store";
      if (storeNameOverviewEl) storeNameOverviewEl.textContent = "No store yet";
      if (storeLocationEl) storeLocationEl.textContent = "Location not set";
      if (sidebarStoreIdEl) sidebarStoreIdEl.textContent = "—";
    }

    if (currentPlanEl) currentPlanEl.textContent = plan;
    if (sidebarPlanLabelEl) sidebarPlanLabelEl.textContent = plan;
    if (mobilePlanLabelEl) mobilePlanLabelEl.textContent = plan;

    if (planDescEl) {
      if (plan === "Free") {
        planDescEl.textContent = "Good for testing and small rental shops.";
      } else if (plan === "Growth") {
        planDescEl.textContent = "Extra listings, analytics and staff seats for growing partners.";
      } else {
        planDescEl.textContent = "Advanced plan with additional features.";
      }
    }
  },

  async loadStats() {
    // products
    try {
      const prodSnap = await db
        .collection("products")
        .where("partnerId", "==", this.user.uid)
        .get();

      let totalProducts = 0;
      let publishedProducts = 0;

      prodSnap.forEach((doc) => {
        totalProducts++;
        const p = doc.data();
        if (p.status === "published") publishedProducts++;
      });

      const prodEl = document.getElementById("stat-products");
      if (prodEl) prodEl.textContent = String(publishedProducts);

      // you could also display totalProducts somewhere if you want
    } catch (e) {
      console.error("loadStats products error", e);
    }

    // bookings snapshot (optional, safe if collection missing)
    try {
      const bookSnap = await db
        .collection("bookings")
        .where("partnerId", "==", this.user.uid)
        .get();

      let newRequests = 0;
      let active = 0;

      bookSnap.forEach((doc) => {
        const b = doc.data();
        const status = (b.status || "").toLowerCase();
        if (status === "requested" || status === "request") newRequests++;
        if (["active", "pickup", "return"].includes(status)) active++;
      });

      const reqEl = document.getElementById("stat-new-requests");
      const activeEl = document.getElementById("stat-active-rentals");
      if (reqEl) reqEl.textContent = String(newRequests);
      if (activeEl) activeEl.textContent = String(active);
    } catch (e) {
      console.warn("bookings stats skipped (collection may not exist yet)", e);
    }

    // issues snapshot (optional)
    try {
      const issuesSnap = await db
        .collection("issues")
        .where("partnerId", "==", this.user.uid)
        .get();
      const issuesEl = document.getElementById("stat-issues");
      if (issuesEl) issuesEl.textContent = String(issuesSnap.size);
    } catch (e) {
      console.warn("issues stats skipped", e);
    }

    // simple checklist “2 of 4 steps”
    const checklistEl = document.getElementById("checklist-progress");
    if (checklistEl) checklistEl.textContent = "2 of 4 steps completed";
  },

  wireButtons() {
    // logout
    const logoutButtons = [
      document.getElementById("btn-logout"),
      document.getElementById("btn-logout-mobile"),
    ];
    logoutButtons.forEach((btn) => {
      if (!btn) return;
      btn.addEventListener("click", async () => {
        try {
          await auth.signOut();
          go("loginpage.html?role=partner");
        } catch (e) {
          console.error(e);
          alert("Logout failed: " + e.message);
        }
      });
    });

    // sidebar / mobile nav
    const mapNav = (id, mobileId, target) => {
      const el = document.getElementById(id);
      const mel = document.getElementById(mobileId);
      const handler = () => go(target);
      if (el) el.addEventListener("click", handler);
      if (mel) mel.addEventListener("click", handler);
    };

    mapNav("nav-products",  "mnav-products",  "products.html");
    mapNav("nav-bookings",  "mnav-bookings",  "bookings.html");
    mapNav("nav-customers", "mnav-customers", "customers.html");
    mapNav("nav-analytics", "mnav-analytics", "analytics.html");
    mapNav("nav-settings",  "mnav-settings",  "settings.html");
    // home just reloads dashboard
    mapNav("nav-home", "mnav-home", "partner-dashboard.html");

    // top buttons
    const goProductPage = () => go("products.html");
    const addProductButtons = [
      document.getElementById("btn-dashboard-add-product"),
      document.getElementById("btn-card-add-product"),
    ];
    const goMgmtButtons = [document.getElementById("btn-go-product-management")];

    addProductButtons.forEach((b) => b && b.addEventListener("click", goProductPage));
    goMgmtButtons.forEach((b) => b && b.addEventListener("click", goProductPage));

    // Plan buttons – only update partner.plan in Firestore
    const planButtons = {
      "btn-plan-free": "Free",
      "btn-plan-growth": "Growth",
    };
    Object.keys(planButtons).forEach((id) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener("click", async () => {
        const newPlan = planButtons[id];
        try {
          await db.collection("partners").doc(this.user.uid).set(
            { plan: newPlan },
            { merge: true }
          );
          this.partner.plan = newPlan;
          await this.fillHeader();
          alert(`Plan updated to ${newPlan}. (Payment integration can be added later.)`);
        } catch (e) {
          console.error(e);
          alert("Failed to update plan: " + e.message);
        }
      });
    });

    // View limits / view plans / Razorpay buttons – for now just info to user
    const simpleInfo = (id, msg) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener("click", () => alert(msg));
    };

    simpleInfo("btn-view-limits", "Plan limits view is not implemented yet.");
    simpleInfo("btn-upgrade-plan", "Upgrade flow will use Razorpay. For now just change plan below.");
    simpleInfo("btn-connect-razorpay", "Here you can later integrate Razorpay payouts.");
    simpleInfo("btn-view-plans", "Opens a page with detailed plan comparison (to be built).");
    simpleInfo("btn-plan-business", "Business Pro: open a marketing / sales page.");
    simpleInfo("btn-plan-enterprise", "Enterprise: open a contact / sales page.");
    simpleInfo("btn-view-audit", "Audit log full view page can be added later.");
    simpleInfo("btn-customize-storefront", "You can route this to a storefront designer page.");
    simpleInfo("btn-edit-store", "You can route this to store settings page.");
  },
};

document.addEventListener("DOMContentLoaded", () => Dashboard.init());
