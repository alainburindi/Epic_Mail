let inbox = document.getElementById("inbox_content");
let sent = document.getElementById("sent_content");
let draft = document.getElementById("draft_content");
let newContent = document.getElementById("new_content");
let inboxInitiated = false;
let sentInitiated = false;
let draftInitiated = false;
let added = false;
inbox.style.display = "none";
sent.style.display = "none";
draft.style.display = "none";
newContent.style.display = "none";

let inboxBtn = document.getElementById("inbox");
inboxBtn.addEventListener('click', function() {
    if (inbox.style.display === "none") {
        inboxBtn.className = "active";
        sentBtn.className -= "active";
        draftBtn.className -= "active";
        newBtn.className -= "active";
        draft.style.display = "none";
        inbox.style.display = "block";
        sent.style.display = "none";
        newContent.style.display = "none";
        initMessage();
    }
})
inboxBtn.click();
let sentBtn = document.getElementById("sent");sentBtn.addEventListener('click', function() {
    if (sent.style.display === "none") {
        sentBtn.className = "active";
        inboxBtn.className -= "active";
        draftBtn.className -= "active";
        sent.style.display = "block";
        newBtn.className -= "active";
        inbox.style.display = "none";
        draft.style.display = "none";
        newContent.style.display = "none";
        initSentMessage();
    }
})
let draftBtn = document.getElementById("draft");draftBtn.addEventListener('click', function() {
    if (draft.style.display === "none") {
        draft.style.display = "block";
        draftBtn.className = "active";
        newBtn.className -= "active";
        sentBtn.className -= "active";
        inboxBtn.className -= "active";
        inbox.style.display = "none";
        sent.style.display = "none";
        newContent.style.display = "none";
        initDraftMessage();
    }
})

let newBtn = document.getElementById("new");
newBtn.addEventListener('click', function() {
    if (newContent.style.display === "none") {
        newContent.style.display = "block";
        newBtn.className = "active";
        sentBtn.className -= "active";
        inboxBtn.className -= "active";
        draftBtn.className -= "active";
        draft.style.display = "none";
        inbox.style.display = "none";
        sent.style.display = "none";
    }
})

function initMessage() {
    if (!inboxInitiated){
        while (inbox.hasChildNodes()) {
            inbox.removeChild(inbox.lastChild);
        }
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
            let respond = document.createElement('button');
            respond.innerHTML = "Respond";
            messageContainer.appendChild(respond);
            respond.style.display = "none";
            respond.addEventListener("click",()=>{
                if (!added) {
                    let edit = document.getElementById("message_input");
                let form = document.createElement("form");
                    form.appendChild(edit);
                    messageContainer.appendChild(form);
                    messageContainer.removeChild(respond);
                    added = true;
                }
                
            })
            inbox.appendChild(messageContainer);
            messageContainer.addEventListener('click', () => {
                while (inbox.hasChildNodes()) {
                    inbox.removeChild(inbox.lastChild);
                }
                contentElement.innerHTML = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.  It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum ";
                respond.style.display = "block";
                
                inbox.appendChild(messageContainer);
                inboxInitiated = false;
            });  
        }
        inboxInitiated = true;
    }
    
}

function initReadPane(){

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
            let c = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.  It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum ...";
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


function initDraftMessage() {
    if (!draftInitiated){
        for (let index = 0; index < 3; index++) {
            let messageContainer = document.createElement("div");
            let senderElement = document.createElement("div");
            let contentElement= document.createElement("div");
            let fromElement = document.createTextNode("To : ");
            let dateElement = document.createElement("span");
            let retract = document.createElement("button");
            retract.innerHTML = "Delete";
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
            draft.appendChild(messageContainer);  
            retract.addEventListener('click', ()=>{
                draft.removeChild(retract.parentElement)
            })
        }
        draftInitiated = true;
    }   
}

function getRandomNumber(min,max) {
    return Math.floor(Math.random() * (max - min) + min);
}
//
