import { endpoint } from "./endpoint.js";

// first get teh login data from the local storage
const loginData = JSON.parse(localStorage.getItem("loginData")) || [];

// if the user is admin, let them in, if they are not, take them back to the login page
if (loginData != []) {
    if (loginData.email !== "admin@empher.com") {
        alert("Admin not logged in")
        window.location.href = "index.html"
    }
} else {
    alert("Admin not logged in")
    window.location.href = "index.html"
}

displayBooks()
// THE MAIN FUNCTIONALITY OF THE ADMIN PAGE
// the add new books form
const bookForm = document.getElementById("book-form")

// Functionality to create and add books into the database
bookForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    // get the information from the form
    let title = bookForm.title.value
    let author = bookForm.author.value
    let category = bookForm.category.value
    let isAvailable = true;
    let isVerified = false;
    let borrowedDays = null;
    let imageUrl = "https://m.media-amazon.com/images/I/71ZB18P3inL._SY522_.jpg"

    const bookData = { title, author, category, isAvailable, isVerified, borrowedDays, imageUrl }

    // then posts the information to the endpoint to add the book into the database
    try {
        let res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(bookData)
        })
        if (res.ok) {
            alert("Book added successfully!")
            bookForm.title.value = "";
            bookForm.author.value = "";
            bookForm.category.value = "";
            displayBooks()
        }
    } catch (error) {

    }
})

// fucntion to do GET requests
async function getData() {
    try {
        let res = await fetch(endpoint);
        let data = await res.json()
        return data
    } catch (error) {
        console.log(error)
        alert("Had trouble fetching the data")
    }
}

// Fucntion to display all the books in the database
async function displayBooks() {
    const cont = document.getElementById("books-cont")
    try {
        let data = await getData()
        data.forEach((ele, i) => {
            if (ele.isAvailable == false) {
                if (!ele.isVerified) {
                    cont.innerHTML += ` <div class="book" id="${ele.id}">
                <img src="${ele.imageUrl}" alt="book cover">
                <h4>${ele.title}</h4>
                <p>${ele.author}</p>
                <p>Category: ${ele.category}</p>
                <p>Avaialbility Status: Is Not Available</p>
                <p>Days borrowed for: ${ele.borrowedDays}</p>
                <button type="button" onclick="verifyBook(this)">Verify Book</button>
                <button type="button" onclick="deleteBook(this)">Delete Book</button>
                </div>`
                } else {
                    cont.innerHTML += ` <div class="book" id="${ele.id}">
                <img src="${ele.imageUrl}" alt="book cover">
                <h4>${ele.title}</h4>
                <p>${ele.author}</p>
                <p>Category: ${ele.category}</p>
                <p>Avaialbility Status: Is Not Available</p>
                <p>Days borrowed for: ${ele.borrowedDays}</p>
                <p>Book is verified</p>
                <button type="button" onclick="deleteBook(this)">Delete Book</button>
                </div>`
                }

            } else {
                if (!ele.isVerified) {
                    cont.innerHTML += ` <div class="book available" id="${ele.id}">
                <img src="${ele.imageUrl}" alt="book cover">
                <h4>${ele.title}</h4>
                <p>${ele.author}</p>
                <p>Category: ${ele.category}</p>
                <p>Avaialbility Status: Is Available</p>
                <button type="button" onclick="verifyBook(this)">Verify Book</button>
                <button type="button" onclick="deleteBook(this)">Delete Book</button>
                </div>`
                } else {
                    cont.innerHTML += ` <div class="book available" id="${ele.id}">
                <img src="${ele.imageUrl}" alt="book cover">
                <h4>${ele.title}</h4>
                <p>${ele.author}</p>
                <p>Category: ${ele.category}</p>
                <p>Avaialbility Status: Is Available</p>
                <p>Book is verified</p>
                <button type="button" onclick="deleteBook(this)">Delete Book</button>
                </div>`
                }

            }

        })

        // functionality to verify the book
        window.verifyBook = async (buttonEl) => {
            let id = buttonEl.parentElement.id
            let confirmVerfifcation = confirm("Are you sure to verify? ")
            if (confirmVerfifcation) {
                try {
                    let req = await fetch(`${endpoint}/${id}`, {
                        method: "PATCH",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({ isVerified: true })
                    })
                    if (req.ok) {
                        alert("Verification successful!")
                        buttonEl.disabled = true;
                    }
                } catch (error) {
                    alert("Could not verify, please try again later")
                }
            }
        }

        // functionality to delete the book
        window.deleteBook = async (buttonEl) => {
            let id = buttonEl.parentElement.id
            const confirmDelete = confirm("Are you sure on deleting this?")
            if (confirmDelete === true) {
                try {
                    let req = await fetch(`${endpoint}/${id}`, {
                        method: "DELETE",
                    })
                    if (req.ok) {
                        alert("Book Successfully Deleted")
                        buttonEl.disabled = true;
                        displayBooks()
                    }
                } catch (error) {
                    alert("Could not delete book, please try again later")
                }
            }

        }
    } catch (error) {

    }
}




