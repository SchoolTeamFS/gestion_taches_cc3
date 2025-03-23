const express=require("express")
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const cors=require("cors")
const projetroute=require("./routes/projet")
const verifytoken=require("./middleware/verifyToken")

dotenv.config()
const app=express()

app.use(express.json())
app.use(cors())

const {MONGODB_URL,DATABASE,PORT}=process.env

mongoose.connect(`${MONGODB_URL}/${DATABASE}`)
.then(()=>console.log("Connexion MongoDB réussie"))
.catch(err=>console.error("Erreur de connexion MongoDB:",err))

mongoose.connection.on("error",err=>console.error("🔴 Perte de connexion MongoDB:",err))

app.use("/projet",verifytoken,projetroute)

app.get("/",(req,res)=>res.send("projet service"))
 
const port=PORT||5001
app.listen(port,()=>console.log(`Serveur en écoute sur le port ${port}`))
