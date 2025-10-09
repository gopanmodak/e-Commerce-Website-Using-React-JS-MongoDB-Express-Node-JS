// test.js
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://gopanmodak:00099@cluster0.iwfbfrb.mongodb.net/e-commerce?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.log("❌ Database connection error:", err));
