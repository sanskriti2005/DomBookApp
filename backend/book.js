import { endpoint } from "./endpoint.js";

// first get teh login data from the local storage
const loginData = JSON.parse(localStorage.getItem("loginData")) || [];

// if the user is admin, let them in, if they are not, take them back to the login page
if(loginData != []){
    if(loginData.email !== "user@empher.com"){
        alert("User not logged in")
        window.location.href = "index.html"
    }
}else {
    alert("User not logged in")
    window.location.href = "index.html"
}

// Now onto the main fucntionality of the page
const availabeBtn = document.getElementById("available-btn");
const borrowedBtn = document.getElementById("borrowed-btn");

// functionality to check the available books
availabeBtn.addEventListener("click", async () => {
    // catching relevant elements
    const cont = document.getElementById("books-cont")
    // emptying the displaying container on every click to avoid chaotic displaying
    cont.innerHTML = ""
    try {
        // getting data from the endpoint and displaying it filtered off of books that aren't available
        let data = await getData()
        data.forEach((ele,i) => {
            if(ele.isAvailable){
                cont.innerHTML += ` <div class="book" id="${ele.id}">
            <img src="${ele.imageUrl}" alt="book cover">
            <h4>${ele.title}</h4>
            <p>${ele.author}</p>
            <p>Category: ${ele.category}</p>
            <button type="button" onclick="borrowBook(this)">Borrow Book</button>
        </div>`     
            }  
        })

        // functionality to borrow the book
        window.borrowBook = async (buttonEl) => {
            let id = buttonEl.parentElement.id
            let userInput = prompt("Enter the number of days you will be borrowing the book for. (Max 10)")
            if(userInput <= 10){
                try {
                    let req = await fetch(`${endpoint}/${id}`, {
                        method:"PATCH",
                        headers:{
                            "Content-type":"application/json"
                        },
                        body: JSON.stringify({isAvailable:false, borrowedDays: userInput})
                    })
                    if(req.ok){
                        alert("Book Borrowed")
                        // updating the ui after borrowing books
                        data = await getData()
                        cont.innerHTML = ""
                        data.forEach((ele,i) => {
                            if(ele.isAvailable){
                                cont.innerHTML += ` <div class="book" id="${ele.id}">
                            <img src="${ele.imageUrl}" alt="book cover">
                            <h4>${ele.title}</h4>
                            <p>${ele.author}</p>
                            <p>Category: ${ele.category}</p>
                            <button type="button" onclick="borrowBook(this)">Borrow Book</button>
                        </div>`     
                            }  
                        })
                    }
                } catch (error) {
                    alert("Error in displaying available books")
                }
            } else{
                alert("You can't borrow a book for that many days")
            }
        }
    } catch (error) {
     
    }
})


// functionality to check the borrowed books
borrowedBtn.addEventListener("click", async () => {
    // catching relevant elements
    const cont = document.getElementById("books-cont")
    // emptying the displaying container on every click to avoid chaotic displaying
    cont.innerHTML = ""
    // getting data from the endpoint and displaying it filtered off of books that aren't available
    try {
        let data = await getData()
        data.forEach((ele,i) => {
            if(!ele.isAvailable){
                cont.innerHTML += ` <div class="book" id="${ele.id}">
            <img src="${ele.imageUrl}" alt="book cover">
            <h4>${ele.title}</h4>
            <p>${ele.author}</p>
            <p>Category: ${ele.category}</p>
            <p>Borrowed Days: ${ele.borrowedDays}</p>
            <button type="button" onclick="returnBook(this)">Return</button>
        </div>`     
            }  
        })

        // functionality for returning books
        window.returnBook = async (buttonEl) => {
            let id = buttonEl.parentElement.id
            const confirmReturn = confirm("Are you sure on returning this?")
            if(confirmReturn === true){
                try {
                    // PATCHES the data for a certain book at the endpoint, updates availability and borrowed days
                    let req = await fetch(`${endpoint}/${id}`, {
                        method:"PATCH",
                        headers:{
                            "Content-type":"application/json"
                        },
                        body: JSON.stringify({isAvailable:true, borrowedDays: null})
                    })
                    if(req.ok){
                        alert("Book returned successfully!")
                        data = await getData()
                        cont.innerHTML = ""
                        data.forEach((ele,i) => {
                            if(ele.isAvailable){
                                cont.innerHTML += ` <div class="book" id="${ele.id}">
                            <img src="${ele.imageUrl}" alt="book cover">
                            <h4>${ele.title}</h4>
                            <p>${ele.author}</p>
                            <p>Category: ${ele.category}</p>
                            <button type="button" onclick="borrowBook(this)">Borrow Book</button>
                        </div>`     
                            }  
                        })
                    }
                } catch (error) {
                    alert("Could not return book, please try after some time")
                }
            }
            
        }
    } catch (error) {
     
    }
})

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

