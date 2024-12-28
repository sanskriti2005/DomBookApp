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

availabeBtn.addEventListener("click", async () => {
    const cont = document.getElementById("books-cont")
    cont.innerHTML = ""
    try {
        let data = await getData()
        data.forEach((ele,i) => {
            if(ele.isAvailable){
                cont.innerHTML += ` <div class="book" id="${ele.id}">
            <img src="${ele.imageUrl}" alt="book cover">
            <h4>${ele.title}</h4>
            <p>${ele.author}</p>
            <button type="button" onclick="borrowBook(this)">Borrow Book</button>
        </div>`     
            }  
        })

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
                        data = await getData()
                        cont.innerHTML = ""
                        data.forEach((ele,i) => {
                            if(ele.isAvailable){
                                cont.innerHTML += ` <div class="book" id="${ele.id}">
                            <img src="${ele.imageUrl}" alt="book cover">
                            <h4>${ele.title}</h4>
                            <p>${ele.author}</p>
                            <button type="button" onclick="borrowBook(this)">Borrow Book</button>
                        </div>`     
                            }  
                        })
                    }
                } catch (error) {
                    
                }
            } else{
                alert("You can't borrow a book for that many days")
            }
        }
    } catch (error) {
     
    }
})

borrowedBtn.addEventListener("click", async () => {
    const cont = document.getElementById("books-cont")
    cont.innerHTML = ""
    try {
        let data = await getData()
        data.forEach((ele,i) => {
            if(!ele.isAvailable){
                cont.innerHTML += ` <div class="book" id="${ele.id}">
            <img src="${ele.imageUrl}" alt="book cover">
            <h4>${ele.title}</h4>
            <p>${ele.author}</p>
            <p>Borrowed Days: ${ele.borrowedDays}</p>
            <button type="button" onclick="returnBook(this)">Return</button>
        </div>`     
            }  
        })

        window.returnBook = async (buttonEl) => {
            let id = buttonEl.parentElement.id
            const confirmReturn = confirm("Are you sure on returning this?")
            if(confirmReturn === true){
                try {
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
                            <button type="button" onclick="borrowBook(this)">Borrow Book</button>
                        </div>`     
                            }  
                        })
                    }
                } catch (error) {
                    
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

