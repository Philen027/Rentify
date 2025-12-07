document.getElementById("register-btn").onclick = async () => {
    let email = reg-email.value;
    let pass = reg-pass.value;
    let name = reg-name.value;
    let city = reg-city.value;
    let state = reg-state.value;

    try {
        let result = await auth.createUserWithEmailAndPassword(email, pass);

        await db.collection("customers").doc(result.user.uid).set({
            email, name, city, state,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        await result.user.sendEmailVerification();

        alert("Verify your email to continue.");
    } catch (err) {
        alert(err.message);
    }
};
