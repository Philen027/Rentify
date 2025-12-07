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
