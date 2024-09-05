import express from "express"
import fs from "fs"
import chat from "./Middleware.json" assert {type: 'json'}

const app1 = express()
const app2 = express()
const PORT1 = 8000;
const PORT2 = 5000;
const now = new Date();

app1.use(express.urlencoded({extended: true}))
app1.use(express.static("public"))

app2.use(express.urlencoded({extended: true}))
app2.use(express.static("public"))

app1.route('/').get((req,res) =>{
    res.render("main.ejs",{
        chat: chat,
        count: 1,
        cid: 1
    })
}).post((req,res) =>{
    var data = req.body
    data.hour = now.getHours();
    data.minutes = now.getMinutes();
    data.seconds = now.getSeconds();
    data.id = 1
    chat.push(data)
    fs.writeFile("./Middleware.json",JSON.stringify(chat),(err) =>{
        if(err) throw err;
        console.log("Message Received From Sender ->  Receiver")
    })
    res.redirect('/')
})

app2.route('/').get((req,res) =>{
    res.render("main.ejs",{
        chat: chat,
        count: 2,
        cid: 2
    })
}).post((req,res) =>{
    var data = req.body
    data.hour = now.getHours();
    data.minutes = now.getMinutes();
    data.seconds = now.getSeconds();
    data.id = 2
    chat.push(data)
    fs.writeFile("./Middleware.json",JSON.stringify(chat),(err) =>{
        if(err) throw err;
        console.log("Message Received From Receiver ->  Sender")
    })
    res.redirect('/')
})

app1.get('/clear',(req,res) => {
    var reset1 = []
    fs.writeFile('./Middleware.json',JSON.stringify(reset1),(err)=>{
        if(err) throw err
        console.log("Chat History Cleared By Sender Successfully")
    })
    res.redirect('/')
})

app2.get('/clear',(req,res) => {
    var reset2 = []
    fs.writeFile('./Middleware.json',JSON.stringify(reset2),(err)=>{
        if(err) throw err
        console.log("Chat History Cleared By Receiver Successfully")
    })
    res.redirect('/')
})

app1.listen(PORT1, () =>{
    console.log(`Server Is Live At ${PORT1} for Sender`)
})
app2.listen(PORT2, () =>{
    console.log(`Server Is Live At ${PORT2} for Receiver`)
})