// ======================== IMPORTS ========================
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const port = 4000;
const app = express();

// ======================== MIDDLEWARE ========================
app.use(express.json());
app.use(cors());
app.use("/image", express.static("upload/image")); // Serve uploaded images

// ======================== DATABASE ========================
mongoose
  .connect(
    "mongodb+srv://gopanmodak:00099@cluster0.iwfbfrb.mongodb.net/e-commerce"
  )
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.log("❌ Database connection error:", err));

// ======================== MULTER SETUP ========================
const storage = multer.diskStorage({
  destination: "./upload/image",
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// ======================== SCHEMAS ========================
const Product = mongoose.model("Product", {
  id: Number,
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

const User = mongoose.model("User", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: { type: Object, default: {} },
  date: { type: Date, default: Date.now },
});

// ======================== TEST API ========================
app.get("/", (req, res) => res.send("🚀 Express server is running!"));

// ======================== IMAGE UPLOAD ========================
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: false, errors: "No file uploaded" });

  res.json({
    success: true,
    image_url: `http://localhost:${port}/image/${req.file.filename}`,
  });
});

// ======================== ADD PRODUCT ========================
app.post("/addproduct", upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, errors: "No image uploaded" });

    const products = await Product.find({});
    const id = products.length ? products[products.length - 1].id + 1 : 1;

    const product = new Product({
      id,
      name: req.body.name,
      image: `http://localhost:${port}/image/${req.file.filename}`,
      category: req.body.category,
      new_price: Number(req.body.new_price),
      old_price: Number(req.body.old_price),
    });

    await product.save();
    res.json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ success: false, errors: error.message });
  }
});

// ======================== REMOVE PRODUCT ========================
app.post("/removeproduct", async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.body.id });
    if (!deletedProduct)
      return res.status(404).json({ success: false, errors: "Product not found" });

    res.json({ success: true, message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    res.status(500).json({ success: false, errors: error.message });
  }
});

// ======================== GET ALL PRODUCTS ========================
app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, errors: error.message });
  }
});

// ======================== SIGNUP ========================
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ success: false, errors: "All fields required" });

    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(400).json({ success: false, errors: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const cart = {};
    for (let i = 0; i < 300; i++) cart[i] = 0;

    const newUser = new User({
      name: username,
      email,
      password: hashedPassword,
      cartData: cart,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, "secret_ecom", { expiresIn: "7d" });

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

// ======================== LOGIN ========================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, errors: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, errors: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, errors: "Incorrect password" });

    const token = jwt.sign({ userId: user._id }, "secret_ecom", { expiresIn: "7d" });

    res.json({ success: true, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

// ======================== ADD TO CART ========================
app.post("/addtocart", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity)
      return res.status(400).json({ success: false, errors: "All fields required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, errors: "User not found" });

    const product = await Product.findOne({ id: productId });
    if (!product) return res.status(404).json({ success: false, errors: "Product not found" });

    if (!user.cartData[productId]) user.cartData[productId] = 0;
    user.cartData[productId] += Number(quantity);

    await user.save();
    res.json({ success: true, message: "Product added to cart", cart: user.cartData });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

// ======================== GET USER CART ========================
app.get("/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, errors: "User not found" });

    const cartItems = [];
    for (let key in user.cartData) {
      if (user.cartData[key] > 0) {
        const product = await Product.findOne({ id: Number(key) });
        if (product) {
          cartItems.push({
            productId: key,
            name: product.name,
            price: product.new_price,
            quantity: user.cartData[key],
            total: product.new_price * user.cartData[key],
          });
        }
      }
    }

    res.json({ success: true, cart: cartItems });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

// ======================== BUY / CHECKOUT ========================
app.post("/buy", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, errors: "User not found" });

    let totalAmount = 0;

    for (let key in user.cartData) {
      const quantity = user.cartData[key];
      if (quantity > 0) {
        const product = await Product.findOne({ id: Number(key) });
        if (product) {
          totalAmount += product.new_price * quantity;
        }
        user.cartData[key] = 0; // Empty cart
      }
    }

    await user.save();
    res.json({ success: true, message: "Purchase successful", totalAmount });
  } catch (err) {
    console.error("Buy error:", err);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

// ======================== START SERVER ========================
app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));
