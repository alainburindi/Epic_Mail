let inbox = document.getElementById("inbox_content");
let sent = document.getElementById("sent_content");
let draft = document.getElementById("draft_content");
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
    for (let index = 0; index < 2; index++) {
        let s = "sender@email.com";
        let c = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";
        inbox.innerHTML = c;   
    }
}