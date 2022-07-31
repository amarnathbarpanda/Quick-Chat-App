const { response } = require('express');
const express = require('express');
const app = express();

const http = require('http').createServer(app)

const PORT = process.env.PORT || 5500;

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//Socket instance
const io = require('socket.io')(http);

const user = {};

// it listens all connections
io.on('connection', (socket) =>{
    
    // for a particular event
    // when a user joins
    socket.on('new-user-joined', name =>{
        // console.log(name);
        user[socket.id] = name;
        // console.log(user);
        socket.broadcast.emit('user-joined', name);
    });

    //listening the event emmited by client
    //on message send
    socket.on('message', (msg)=>{
        //sending/broadcating the message to all except sender
        socket.broadcast.emit('message', {user: user[socket.id], message: msg.message});
    })

    //when user leaves the chat
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', user[socket.id]);
        delete user[socket.id];
    })
})