// pai dependencies
import express from "express";
import mongoose from "mongoose";
// .env and parsing dependencies
import dotenv from "dotenv";
import bodyParser from "body-parser";

// Initialize Express app and set up middleware
dotenv.config();
const app = express();

// middleware to parse data to JSON
app.use(express.json());
app.use(bodyParser.json());

// Set up MongoDB connection
const URI =
  "mongodb+srv://charlesldefreeseiii:zrMRtd4K6nkZQGes@cluster0.fijlwsy.mongodb.net/nodeJSServer?retryWrites=true&w=majority";

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err.message));

// Define user schema and model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
    default: "unknown",
  },
  incomeLevel: { type: Number, required: true },
  interests: {
    type: [String],
    required: false,
    default: "unknown",
  },
  purchaseHistory: {
    type: [String],
    required: false,
    default: "unknown",
  },
  websiteBrowsingBehavior: {
    type: [String],
    required: false,
    default: "unknown",
  },
  searchHistory: {
    type: [String],
    required: false,
    default: "unknown",
  },
});
const User = mongoose.model("User", userSchema);

// Set up routes
app.get("/", (_, res) => {
  res.send("This is a response from the server");
});

app.get("/test", async (_, res) => {
  try {
    await mongoose.connect(URI);
    res.send("Connected to MongoDB");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Get all users
app.get("/users", async (_, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Create new user
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Update user by ID
app.patch("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

// Delete user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on port : ${port}`);
});