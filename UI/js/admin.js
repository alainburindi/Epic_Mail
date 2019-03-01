let user = document.getElementById("user_content");
let group = document.getElementById("group_content");
let newContent = document.getElementById("new_content");
let userInitiated = false;
let groupInitiated = false;
let added = false;
let userTable = document.getElementById("userTable");
let saveUser = document.getElementById("saveUser");
let nameInput = document.getElementById("nameInput");
let emailInput = document.getElementById("emailInput");

user.style.display = "none";
group.style.display = "none";
newContent.style.display = "none";
let userBtn = document.getElementById("user");
userBtn.addEventListener('click', function() {
    if (user.style.display === "none") {
        userBtn.className = "active";
        groupBtn.className -= "active";
        user.style.display = "block";
        group.style.display = "none";
        newContent.style.display = "none";
        initMessage();
    }
})
userBtn.click();

let groupBtn = document.getElementById("group");groupBtn.addEventListener('click', function() {
    if (group.style.display === "none") {
        groupBtn.className = "active";
        userBtn.className -= "active";
        group.style.display = "block";
        user.style.display = "none";
        newContent.style.display = "none";
        initGroupMessage();
    }
})

saveUser.addEventListener('click', ()=>{
    let name = nameInput.value;
    let email = emailInput.value;
    let error = document.getElementById('erorr');
    if (name && email){
        error.style.display = "none";
        let row = userTable.insertRow(1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.innerHTML = nameInput.value;
        cell2.innerHTML = emailInput.value;
    }else{
        error.style.display = "block";
    }
    
})

function initMessage() {
    if (!userInitiated){
        
        userInitiated = true;
    }
    
}

function initGroupMessage() {
    if (!groupInitiated){
        groupInitiated = true;
    }    
}

function getRandomNumber(min,max) {
    return Math.floor(Math.random() * (max - min) + min);
}
//