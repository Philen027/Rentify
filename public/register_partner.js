document.getElementById("partner-reg-btn").onclick = async () => {
    let email = pemail.value;
    let pass = ppass.value;
    let name = pname.value;
    let phone = pphone.value;

    try {
        let result = await auth.createUserWithEmailAndPassword(email, pass);

        await db.collection("partners").doc(result.user.uid).set({
            email, name, phone,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        await result.user.sendEmailVerification();

        alert("Verification email sent!");
    } catch (err) {
        alert(err.message);
    }
};
