// catch the form
const loginForm = document.getElementById("login-form")

// Functionality to verify the person's identity, they could be a user or an admin
loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let email = loginForm.email.value
    let password = loginForm.password.value
    const userData = {email, password}

    // take them to the relevant location and save their data in local storage 
    // depending on whether the person loggin in is a user or an admin
    if (email === "admin@empher.com") {
        if (password === "empher@123") {
            alert("Logged in as Admin.")
            loginForm.email.value = "";
            localStorage.setItem("loginData",JSON.stringify(userData))
            window.location.href = "admin.html"
        } else {
            alert("Wrong Admin Password")
        }
    } else if (email === "user@empher.com") {
        if (password === "user@123") {
            alert("Logged in as User.");
            loginForm.email.value = "";
            localStorage.setItem("loginData",JSON.stringify(userData))
            window.location.href = "books.html"
        } else {
            alert("Wrong Password")
        }
    } else {
        alert("User not found")
    }
    })