document.getElementById("btn-show-customer").onclick = () => {
    document.getElementById("customer-login").classList.remove("hidden");
    document.getElementById("partner-login").classList.add("hidden");
};

document.getElementById("btn-show-partner").onclick = () => {
    document.getElementById("partner-login").classList.remove("hidden");
    document.getElementById("customer-login").classList.add("hidden");
};

// ---------------- CUSTOMER LOGIN ----------------
document.getElementById("cust-login-btn").onclick = async () => {
    let email = cust-email.value;
    let pass = cust-pass.value;

    try {
        let user = await auth.signInWithEmailAndPassword(email, pass);

        if (!user.user.emailVerified) {
            alert("Verify your email first!");
            await user.user.sendEmailVerification();
            return;
        }

        window.location.href = "customer-products.html";
    } catch (err) {
        alert(err.message);
    }
};

document.getElementById("cust-google-btn").onclick = async () => {
    try {
        let provider = new firebase.auth.GoogleAuthProvider();
        let result = await auth.signInWithPopup(provider);

        window.location.href = "customer-products.html";
    } catch (err) {
        alert(err.message);
    }
};

// ---------------- PARTNER LOGIN ----------------
document.getElementById("part-login-btn").onclick = async () => {
    let email = part-email.value;
    let pass = part-pass.value;

    try {
        let user = await auth.signInWithEmailAndPassword(email, pass);

        if (!user.user.emailVerified) {
            alert("Verify your partner email first!");
            await user.user.sendEmailVerification();
            return;
        }

        window.location.href = "partner-dashboard.html";
    } catch (err) {
        alert(err.message);
    }
};

document.getElementById("part-google-btn").onclick = async () => {
    try {
        let provider = new firebase.auth.GoogleAuthProvider();
        let result = await auth.signInWithPopup(provider);

        window.location.href = "partner-dashboard.html";
    } catch (err) {
        alert(err.message);
    }
};
