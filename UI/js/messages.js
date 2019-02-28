let inbox = document.getElementById("inbox_content");
let sent = document.getElementById("sent_content");
let draft = document.getElementById("draft_content");
let inboxInitiated = false;
let sentInitiated = false;
inbox.style.display = "none";
sent.style.display = "none";
draft.style.display = "none";
let inboxBtn = document.getElementById("inbox");inboxBtn.addEventListener('click', function() {
    if (inbox.style.display === "none") {
        inboxBtn.className = "active";
        sentBtn.className -= "active";
        draftBtn.className -= "active";
        draft.style.display = "none";
        inbox.style.display = "block";
        sent.style.display = "none";
        initMessage();
    }
})
let sentBtn = document.getElementById("sent");sentBtn.addEventListener('click', function() {
    if (sent.style.display === "none") {
        sentBtn.className = "active";
        inboxBtn.className -= "active";
        draftBtn.className -= "active";
        sent.style.display = "block";
        inbox.style.display = "none";
        draft.style.display = "none";
        initSentMessage();
    }
})
let draftBtn = document.getElementById("draft");draftBtn.addEventListener('click', function() {
    if (draft.style.display === "none") {
        draft.style.display = "block";
        draftBtn.className = "active";
        sentBtn.className -= "active";
        inboxBtn.className -= "active";
        inbox.style.display = "none";
        sent.style.display = "none";
    }
})

function initMessage() {
    if (!inboxInitiated){
        for (let index = 0; index < 3; index++) {
            let messageContainer = document.createElement("div");
            let senderElement = document.createElement("div");
            let contentElement= document.createElement("div") ;
            let fromElement = document.createTextNode("from : ");
            senderElement.classList += "sender";
            contentElement.classList += "message";
            messageContainer.classList += "messageContainer";

            let s = "sender"+index+"@email.com";
            let c = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make ...";
            senderElement.appendChild(fromElement);
            senderElement.appendChild( document.createTextNode(s));
            if(index < 2){
            let p = 
            (document.createElement("p"));
            p.appendChild(document.createTextNode('unread'));
            senderElement.appendChild(p);
            }
            contentElement.appendChild(document.createTextNode(c));
            messageContainer.appendChild(senderElement);
            messageContainer.appendChild(contentElement);
            inbox.appendChild(messageContainer);  
        }
        inboxInitiated = true;
    }
    
}


function initSentMessage() {
    if (!sentInitiated){
        for (let index = 0; index < 3; index++) {
            let messageContainer = document.createElement("div");
            let senderElement = document.createElement("div");
            let contentElement= document.createElement("div");
            let fromElement = document.createTextNode("To : ");
            let dateElement = document.createElement("span");
            let retract = document.createElement("button");
            retract.innerHTML = "Rectract";
            let day = getRandomNumber(1,30);
            let month = getRandomNumber(1,12);
            let year = 2019;
            dateElement.innerHTML = "date : " +day+"/"+month+"/"+year;
            senderElement.classList += "sender";
            contentElement.classList += "message";
            messageContainer.classList += "messageContainer";

            let s = "receiver"+index+"@email.com";
            let c = "a type specimen book.  It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum ...";
            senderElement.appendChild(fromElement);
            senderElement.appendChild( document.createTextNode(s));
            senderElement.appendChild(dateElement);
            contentElement.appendChild(document.createTextNode(c));
            messageContainer.appendChild(senderElement);
            messageContainer.appendChild(contentElement);
            messageContainer.appendChild(retract);
            sent.appendChild(messageContainer);  
            retract.addEventListener('click', ()=>{
                sent.removeChild(retract.parentElement)
            })
        }
        sentInitiated = true;
    }
    
}

function getRandomNumber(min,max) {
    return Math.floor(Math.random() * (max - min) + min);
}
//