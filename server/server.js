import express from 'express'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import http from 'http'

dotenv.config();

const app = express()
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:'*'
    }
})
io.on('connection',socket=>{
    console.log('New Connection',socket.id)
    // socket.emit('conn',socket.id);
    socket.on('newOffer',(data)=>{
        // console.log(data);
        socket.broadcast.emit('offerFrom',{from:socket.id,offer:data});
    })
    socket.on('icecandidate',data=>{
        // console.log("Ice Candidate Arrived")
        socket.emit('icecandidate',{candidate:data});
        // console.log("Ice Candidate Departed");
    })

    socket.on('answer',data=>{
        // console.log(data)
        socket.broadcast.emit('answer',data)
    })
})
server.listen(process.env.PORT,()=>console.log('SERVER STARTED AT',process.env.PORT)).on('error',err=>console.log("Error : ",err))