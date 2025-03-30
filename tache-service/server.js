const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes"); 

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());


const MONGODB_URL = process.env.MONGODB_URL;
const DBNAME = process.env.DATABASE;
mongoose.connect(`${MONGODB_URL}/${DBNAME}`)
  .then(() => console.log("Your Connection To MongoDB Is Successful (❁´◡`❁)"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

const db = mongoose.connection;


app.use("/tache", taskRoutes); 


const PORT = process.env.PORT || 5001; // Use 5001 instead of 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

