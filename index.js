const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const createCache = (maxSize) => {
  const store = new Map();
  const set = (key, value) => {
    if (store.size >= maxSize && !store.has(key)) {
      return false;
    }
    store.set(key, value);
    return true;
  };
  const get = (key) => store.get(key);
  const remove = (key) => store.delete(key);

  return { set, get, remove };
};

const cache = createCache(10);

//Routes

app.post("/cache", (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ error: "Key and value are required" });
    }

    if (typeof key !== "string") {
      return res.status(400).json({ error: "Key must be a string" });
    }

    if (!cache.set(key, value)) {
      return res.status(429).json({ error: "Max size reached" });
    }

    res.status(201).json({ key, value, message: "Cache created" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/cache/:key", (req, res) => {
  const { key } = req.params;
  const value = cache.get(key);
  if (value === undefined) {
    return res.status(404).json({ error: "Cache not found" });
  }
  res.json({ key, value });
});

app.delete("/cache/:key", (req, res) => {
  const { key } = req.params;
  cache.remove(key);
  res.json({ message: "Cache deleted" });
});

// Easter egg route
app.get("/easter-egg", (req, res) => {
  const easterEgg = {
    message: "Congratulations! You've found the Easter egg!",
    hint: "The key to success is consistency and perseverance.",
    platform: "Cactro",
    developer: {
      name: "Gyandeep Aryan",
      linkedin: "https://www.linkedin.com/in/your-profile",
      github:
        "https://github.com/gyandeeparyanhttps://www.linkedin.com/in/gyandeep-aryan-6a7509176/",
      peerlist: "https://peerlist.io/gyandeeparyan",
      x: "https://x.com/gyandeeeparyan",
      email: "gyandeeparyan.dev@gmail.com",
      phone: "7004669519",
      message: "Hello there! If you enjoyed this little surprise, imagine what we could achieve together. Let's connect and create something amazing!"
    },
  };
  res.json(easterEgg);
});

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
