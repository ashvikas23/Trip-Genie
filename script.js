let destination=""
let duration=0
let budget=0
let travellers=0
let type=""

/* TOUR PACKAGE DATABASE */

const packages=[

{destination:"Kerala",duration:3,price:12000,type:"nature",details:"Houseboat and backwater tour"},
{destination:"Ooty",duration:3,price:11000,type:"nature",details:"Hill station and tea gardens"},
{destination:"Darjeeling",duration:3,price:13000,type:"nature",details:"Tea plantations and mountain views"},
{destination:"Kashmir",duration:5,price:22000,type:"nature",details:"Srinagar houseboat and Gulmarg"},
{destination:"Coorg",duration:3,price:14000,type:"nature",details:"Coffee plantations and waterfalls"},
{destination:"Munnar",duration:3,price:12500,type:"nature",details:"Tea gardens and misty hills"},

{destination:"Goa",duration:4,price:15000,type:"beach",details:"Beach resort stay and water sports"},
{destination:"Andaman",duration:4,price:25000,type:"beach",details:"Island beaches and scuba diving"},
{destination:"Lakshadweep",duration:4,price:23000,type:"beach",details:"Coral islands and snorkeling"},
{destination:"Pondicherry",duration:3,price:13000,type:"beach",details:"French colonial town and beaches"},

{destination:"Manali",duration:5,price:20000,type:"adventure",details:"Snow activities and trekking"},
{destination:"Ladakh",duration:6,price:30000,type:"adventure",details:"Bike trip through Himalayan passes"},
{destination:"Rishikesh",duration:3,price:13000,type:"adventure",details:"River rafting and camping"},
{destination:"Auli",duration:4,price:19000,type:"adventure",details:"Skiing and snow mountains"},

{destination:"Rajasthan",duration:4,price:18000,type:"culture",details:"Jaipur and Udaipur heritage tour"},
{destination:"Varanasi",duration:2,price:9000,type:"culture",details:"Temple visits and Ganga aarti"},
{destination:"Hampi",duration:3,price:11000,type:"culture",details:"Ancient temple ruins"},
{destination:"Mysore",duration:3,price:11500,type:"culture",details:"Palace city heritage tour"}

]

/* SEND MESSAGE */

async function sendMessage(){

let input = document.getElementById("userInput").value.trim()

let messages = document.getElementById("messages")

if(input === "") return

messages.innerHTML += `<div class="userMsg">${input}</div>`
messages.scrollTop = messages.scrollHeight

document.getElementById("userInput").value = ""

/* show typing */

let typing = document.createElement("div")
typing.className = "botMsg typing"
typing.innerHTML = `<span></span><span></span><span></span>`

messages.appendChild(typing)

messages.scrollTop = messages.scrollHeight

try{

let response = await fetch("http://127.0.0.1:5000/chat",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
message: input
})

})

let data = await response.json()

/* wait 0.8 seconds so typing is visible */

setTimeout(()=>{

typing.remove()

if(data.packages){

if(data.packages.length === 0){

botMessage("No packages found for your request.")

}else{
botMessage("🧠 Understanding your travel preferences...")

setTimeout(()=>{
botMessage("🔎 Searching best travel packages...")
},400)

setTimeout(()=>{
botMessage("✈ Preparing recommendations...")
},800)

setTimeout(()=>{

botMessage("Here are the best travel packages:")

data.packages.forEach(pkg=>{

messages.innerHTML += `

<div class="resultCard">

<div class="resultTitle">🏝 ${pkg.destination}</div>

<div class="resultInfo">
💰 Price: ₹${pkg.price}
</div>

<div class="resultInfo">
📅 Duration: ${pkg.duration} days
</div>

<div class="resultInfo">
📝 ${pkg.details}
</div>

</div>

`

})

messages.scrollTop = messages.scrollHeight

},1200)

}

}

},800)   // typing visible for 0.8s

}catch(error){

typing.remove()

botMessage("Server connection error")

}

}

/* BOT MESSAGE */

function botMessage(text){

let messages=document.getElementById("messages")

let bubble=document.createElement("div")

bubble.className="botMsg"

bubble.innerText=text

messages.appendChild(bubble)

messages.scrollTop=messages.scrollHeight

}

/* OPTION BUTTONS */

function showOptions(options){

let messages=document.getElementById("messages")

let html=`<div class="optionContainer">`

options.forEach(opt=>{
html+=`<button class="optionBtn" onclick="selectOption('${opt}')">${opt}</button>`
})

html+=`</div>`

messages.innerHTML+=html
messages.scrollTop=messages.scrollHeight

}

function selectOption(value){

document.getElementById("userInput").value=value
sendMessage()

}

/* RESET */

function resetChat(){

destination=""
duration=0
budget=0
travellers=0
type=""

let messages=document.getElementById("messages")

messages.innerHTML =
`<div class="botMsg">
👋 Hello! I'm TripGenie, your AI travel assistant.<br><br>
Tell me your destination, budget, or travel type and I'll find the best trips for you.
</div>`

showOptions(["Kerala","Goa","Manali","Ooty","Any"])

}

/* CHAT WINDOW */

function toggleChat(){

let chat=document.getElementById("chatContainer")

if(chat.style.display==="block"){

chat.style.opacity="0"
chat.style.transform="scale(0.8)"

setTimeout(()=>{
chat.style.display="none"
},300)

}else{

chat.style.display="block"

setTimeout(()=>{
chat.style.opacity="1"
chat.style.transform="scale(1)"
},10)

}

}

/* ENTER KEY */

document.getElementById("userInput").addEventListener("keydown",function(e){

if(e.key==="Enter") sendMessage()

})

resetChat()

const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){
entry.target.classList.add("visible")
}

})

})

document.querySelectorAll(".fade-section").forEach(section=>{
observer.observe(section)
})

function maximizeChat(){

let chat = document.getElementById("chatContainer")

chat.classList.toggle("fullscreen")

}
function minimizeChat(){

let messages = document.getElementById("messages")

messages.style.display = 
messages.style.display === "none" ? "flex" : "none"

}