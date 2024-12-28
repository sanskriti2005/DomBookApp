function loadNavbar() {
    // catch nav element div
    const nav = document.getElementById("nav")

    nav.innerHTML = `<div id="navbar">
            <div><a href="index.html">Home</a></div>
            <div><a href="admin.html">Admin</a></div>
            <div><a href="books.html">Books</a></div>
        </div>`;
}
loadNavbar()