const socket = io();

let name;


let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message_area');
let user = document.getElementById('user');
do{
    name = prompt('Please enter your name');
}while(!name);

//to display user name on hovering on user icon

user.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/3237/3237472.png" alt="user" title="${name}">`

//emitting event to server
socket.emit('new-user-joined', name);


// listening the events send by server
socket.on('user-joined', name =>{
    appendMessage({message:`${name} joined the chat!`}, 'info');

})

// Receive messages from server
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
})


//User left the chat
socket.on('left', name => {
    if (name)
        appendMessage({ message: `${name} left the chat` }, 'info');
})

textarea.addEventListener('keyup', (e)=>{
    if(e.key === 'Enter'){
        sendMessage(e.target.value);
    }
});

//Functions for actions
function sendMessage(message){
    let msg =  {
        user: "You",
        message: message.trim()
    }

    //append message
    appendMessage(msg, 'outgoing');
    textarea.value = "";

    scrollToBottom();

    // send to server
    socket.emit('message', msg);
}

//append the message to message_area
function appendMessage(msg, type){
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');
    let markup;
    if(type !== 'info'){
     markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
        `;
    }else{
        markup = `
            <p>${msg.message}</p>
        `
    }

    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

//scroll to bottom to see latest messages
function scrollToBottom(){
    messageArea.scrollTop = messageArea.scrollHeight;
}