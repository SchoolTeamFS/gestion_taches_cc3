const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const MONGODB_URL = process.env.MONGODB_URL;
const DBNAME = process.env.DATABASE;
mongoose.connect(`${MONGODB_URL}/${DBNAME}`)
.then(() => console.log('Your Connexion To MongoDB Is Successful (❁´◡`❁)'))
.catch(err => console.error('Error connectiong to MongoDB:', err));
const db=mongoose.connection;

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Auth-Service running on port ${PORT}`));
