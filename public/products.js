db.collection("products")
  .where("status", "==", "published")
  .onSnapshot(res => {
      list.innerHTML = "";
      res.forEach(doc => {
          let p = doc.data();
          list.innerHTML += `
              <div class="product">
                  <img src="${p.image}">
                  <h3>${p.name}</h3>
                  <p>${p.price}</p>
              </div>
          `;
      });
  });
auth.onAuthStateChanged(user => {
    if (!user) return window.location.href = "login.html";

    document.getElementById("save-btn").onclick = () => saveProduct(user.uid);
});

async function saveProduct(uid) {
    let name = p-name.value;
    let price = p-price.value;
    let desc = p-desc.value;
    let file = p-image.files[0];

    if (!name || !price || !file) {
        return alert("Fill all fields and choose image");
    }

    // Upload image
    let ref = storage.ref("products/" + Date.now() + "-" + file.name);
    await ref.put(file);
    let url = await ref.getDownloadURL();

    await db.collection("products").add({
        partnerId: uid,
        name,
        price,
        desc,
        imageURL: url,
        status: "unpublished",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Product added successfully");
    window.location.href = "partner-dashboard.html";
}
