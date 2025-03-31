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

const MONGODB_URL = process.env.MONGODB_URL;
const DBNAME = process.env.DATABASE;
mongoose.connect(`${MONGODB_URL}/${DBNAME}`)
.then(() => console.log('Your Connexion To MongoDB Is Successful (❁´◡`❁)'))
.catch(err => console.error('Error connectiong to MongoDB:', err));
const db=mongoose.connection;


app.use("/projet",verifytoken,projetroute)

app.get("/",(req,res)=>res.send("projet service"))
 
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Serveur en écoute sur le port ${PORT}`))
