db.collection("products")
  .where("status", "==", "published")
  .onSnapshot(snapshot => {
      grid.innerHTML = "";
      snapshot.forEach(doc => {
          let p = doc.data();
          grid.innerHTML += `
            <div class="product">
                <img src="${p.imageURL}">
                <h3>${p.name}</h3>
                <p>₹${p.price}/day</p>
            </div>
          `;
      });
  });
// public/customer-products.js

document.addEventListener("DOMContentLoaded", () => {
    const db = window.firebaseDb; // Assuming the config exposes this
    const helpers = window.firebaseHelpers;
    const productsContainer = document.getElementById('products-container');

    // Simple URL parameter reader for the Partner ID
    const urlParams = new URLSearchParams(window.location.search);
    const partnerId = urlParams.get('partnerId') || "DEFAULT_PARTNER_ID"; // Use a real ID or placeholder

    async function loadStoreTheme() {
        try {
            const storeRef = helpers.doc(db, "stores", partnerId);
            const storeSnap = await helpers.getDoc(storeRef);

            let themeName = 'minimal-light'; // Default fixed theme for safety
            if (storeSnap.exists()) {
                themeName = storeSnap.data().theme || 'minimal-light';
            }

            // Apply Theme to Body/Wrapper
            applyTheme(themeName);
            document.title = `${storeSnap.data().storeName || "Rentify Partner"} Store`;
        } catch (error) {
            console.error("Error loading store theme:", error);
            applyTheme('minimal-light'); 
        }
    }

    function applyTheme(themeName) {
        // Remove existing theme classes (if any)
        document.body.classList.remove('theme-minimal-light', 'theme-dark-space', 'theme-urban-glass', 'theme-vibrant-blue');
        
        // Add the new theme class
        document.body.classList.add(`theme-${themeName}`);
        console.log(`Applying theme: ${themeName}`);
        
        // --- IMPORTANT ---
        // You MUST define the CSS for these classes in your products.html <style> block or an external CSS file.
        /* Example CSS (for demonstration):
        .theme-minimal-light { background-color: #f0f4f8; color: #333; }
        .theme-dark-space { background-color: #0f172a; color: #e2e8f0; }
        */
    }

    async function loadProducts() {
        // ... (Your existing logic to load products based on partnerId)
        // Ensure the query filters by partnerId
        const q = helpers.query(
            helpers.collection(db, "products"),
            helpers.where("partnerId", "==", partnerId),
            helpers.where("status", "==", "published")
        );
        const snap = await helpers.getDocs(q);

        // ... (Your existing rendering logic using productsContainer.innerHTML = ...)
        // This part is crucial: if snap.empty, show a friendly "No Products" message.

        if (snap.empty) {
            productsContainer.innerHTML = `<p class="text-center text-lg text-gray-500 py-10">This partner currently has no products listed.</p>`;
            return;
        }
        
        let html = '';
        snap.forEach(doc => {
            const product = doc.data();
            // This needs to match the structure expected by products.html
            html += `
                <div class="product-card bg-white p-4 rounded-lg shadow-lg transition-all hover:shadow-xl">
                    <img src="${product.imageUrl || 'https://via.placeholder.com/400x300'}" alt="${product.name}" class="w-full h-48 object-cover rounded-md mb-3">
                    <h4 class="font-bold text-lg truncate">${product.name}</h4>
                    <p class="text-sm text-gray-600 mb-2">${product.category}</p>
                    <p class="font-bold text-blue-600">₹${product.rentPerDay} / Day</p>
                    <button class="mt-3 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">View Details</button>
                </div>
            `;
        });
        productsContainer.innerHTML = html;
    }

    // Initialize the page
    loadStoreTheme();
    loadProducts();
});