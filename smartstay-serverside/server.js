const express = require("express")
const server = express()
const PORT = 3000


server.get("/", (request, response) =>{
    response.send("SmartStay Hotel Server side")
})

server.listen(PORT, () => {
    console.log("Server is running at 3000 port")
})