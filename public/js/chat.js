import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form")
if(formSendData){
    formSendData.addEventListener("submit", (e) =>{
        e.preventDefault()
        const content = e.target.elements.content.value
        
        if(content){
            socket.emit("CLIENT_SEND_MESSAGE", content)
            e.target.elements.content.value = ""
        }
    })
}
// END_CLIENT_SEND_MESSAGE

// SERVER_RETURN_MASSAGE
socket.on("SERVER_RETURN_MASSAGE", (data)=>{
    const body = document.querySelector(".chat .inner-body")
    const myId = document.querySelector("[my-id]").getAttribute("my-id")

    const div = document.createElement("div")

    let htmlFullName = ""

    if(myId == data.userId){
        div.classList.add("inner-outgoing")
    }else{
        div.classList.add("inner-incoming")
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`
    }

    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `
    body.appendChild(div)
    body.scrollTop = body.scrollHeight
})
// END_SERVER_RETURN_MASSAGE

// Scroll Chat to button
const bodyChat = document.querySelector(".chat .inner-body")
if(bodyChat){
    bodyChat.scrollTop = bodyChat.scrollHeight
}

//emoji-picker
//Shown popper
const buttonIcon = document.querySelector(".button-icon")
if(buttonIcon){
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip)

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}
//insert icon
const emojiClick = document.querySelector('emoji-picker')
if(emojiClick){
    const inputChat = document.querySelector(".chat .inner-form input[name='content']")

    emojiClick.addEventListener("emoji-click", (event)=>{
        const icon = event.detail.unicode
        //console.log(icon)
        inputChat.value = inputChat.value + icon
    })
}
//end-emoji-picker