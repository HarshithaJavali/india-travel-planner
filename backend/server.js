require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());

// ---------------- ROUTES ----------------
const statesRoutes = require("./routes/states.routes");
const citiesRoutes = require("./routes/cities.routes");
const placesRoutes = require("./routes/places.routes");

// test route
app.get("/test", (req, res) => {
  res.send("Backend is working");
});

// API routes (ONLY ONCE)
app.use("/api/states", statesRoutes);
app.use("/api/cities", citiesRoutes);
app.use("/api/places", placesRoutes);

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
