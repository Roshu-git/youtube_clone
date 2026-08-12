const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes.route");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// MongoDB
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error(error);
  });


// Routes
app.use("/api/auth", authRoutes);


const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});