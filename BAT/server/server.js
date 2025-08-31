const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "BATDatabase",
  })
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

// User Schema

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Signup info
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // generate JWT
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "Signup successful!", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login info
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful!", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// To fetch for Dashboard
app.get("/dashboard", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid token" });
      res.json({ message: `Hi ${decoded.username}` });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
Added for the Form submission
*/

//Employee Schema
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  dob: { type: Date, required: true },
  doj: { type: Date, required: true },
  photo: { type: String, default: "https://example.com/default-photo.jpg" },
});

const Employee = mongoose.model("Employee", employeeSchema);

//Employee Route
app.post("/employee", async (req, res) => {
  try {
    const { name, email, department, dob, doj, photo } = req.body;

    if (!name || !email || !department || !dob || !doj) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res
        .status(400)
        .json({ message: "Employee with this email already exists" });
    }

    const newEmployee = new Employee({
      name,
      email,
      department,
      dob,
      doj,
      photo,
    });
    await newEmployee.save();

    res.status(201).json({ message: "Employee added successfully!" });
  } catch (err) {
    console.error("Employee submission error:", err);
    res.status(500).json({ message: "Server error while adding employee" });
  }
});

/*

// To get emplyee info for table

app.get("/employee", async (req, res) => {
  try {
    const allEmployees = await Employee.find();
    res.json(allEmployees);
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    res.status(500).send("Internal Server Error");
  }
});
*/

// To get employee info for table with search
app.get("/employee", async (req, res) => {
  try {
    const { search } = req.query;
    let employees = await Employee.find();

    // filter by search query
    if (search) {
      const lowerSearch = search.toLowerCase();
      employees = employees.filter((emp) =>
        emp.name.toLowerCase().includes(lowerSearch)
      );
    }

    res.json(employees);
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    res.status(500).send("Internal Server Error");
  }
});

// To fetch the employees having events on this month
app.get("/employee/events/current-month", async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;

    // Fetch all employees
    const employees = await Employee.find();

    // Filter employees whose DOB or DOJ month matches the current month
    const filtered = employees.filter((emp) => {
      const dobMonth = emp.dob ? new Date(emp.dob).getMonth() + 1 : null;
      const dojMonth = emp.doj ? new Date(emp.doj).getMonth() + 1 : null;

      return dobMonth === currentMonth || dojMonth === currentMonth;
    });

    if (filtered.length === 0) {
      return res
        .status(200)
        .json({ message: "No events this month", events: [] });
      // To display if there is no events in the current month
    }

    res.json({ events: filtered });
  } catch (error) {
    console.error("Failed to fetch current month events:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Cron to schedule today's events
let todayEventsCache = [];

// function to fetch today's events
const getTodayEvents = async () => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;

  const employees = await Employee.find();
  return employees.filter((emp) => {
    const dob = emp.dob ? new Date(emp.dob) : null;
    const doj = emp.doj ? new Date(emp.doj) : null;

    const isDobToday =
      dob &&
      dob.getDate() === currentDay &&
      dob.getMonth() + 1 === currentMonth;

    const isDojToday =
      doj &&
      doj.getDate() === currentDay &&
      doj.getMonth() + 1 === currentMonth;

    return isDobToday || isDojToday;
  });
};

// function to refresh cache
const refreshTodayEvents = async () => {
  todayEventsCache = await getTodayEvents();
  console.log("Cached today's events:", todayEventsCache.length);
};

// to fetch the month's events
let monthEventsCache = [];

const getMonthEvents = async () => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;

  const employees = await Employee.find();
  return employees.filter((emp) => {
    const dobMonth = emp.dob ? new Date(emp.dob).getMonth() + 1 : null;
    const dojMonth = emp.doj ? new Date(emp.doj).getMonth() + 1 : null;

    return dobMonth === currentMonth || dojMonth === currentMonth;
  });
};

const refreshMonthEvents = async () => {
  monthEventsCache = await getMonthEvents();
  console.log("Cached this month's events:", monthEventsCache.length);
};

// to fetch today's events at start
refreshTodayEvents();
refreshMonthEvents();

// Cron works
// Cron at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Midnight cron: refreshing events...");
  await refreshTodayEvents();
});

// Cron at 9 AM daily
cron.schedule("0 9 * * *", async () => {
  console.log("9 AM cron: refreshing events...");
  await refreshTodayEvents();
});

// Month’s events – run on 1st of every month at midnight
cron.schedule("0 0 1 * *", async () => {
  console.log("Monthly cron: refreshing this month's events...");
  await refreshMonthEvents();
});

// Refresh monthly cache every midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Daily cron: refreshing this month's events...");
  await refreshMonthEvents();
});

app.get("/events/today", (req, res) => {
  res.json(todayEventsCache);
});

// Month events with search
app.get("/events/month", (req, res) => {
  try {
    const { search } = req.query;
    let filtered = [...monthEventsCache];

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(lowerSearch) ||
          (emp.department &&
            emp.department.toLowerCase().includes(lowerSearch)) ||
          (emp.email && emp.email.toLowerCase().includes(lowerSearch))
      );
    }

    res.json(filtered);
  } catch (err) {
    console.error("Failed to fetch month events:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// For birthday tab in side bar with search
app.get("/employee/birthdays", async (req, res) => {
  try {
    const { search } = req.query;
    const employees = await Employee.find({}, "name email dob");
    const today = new Date();

    let birthdays = employees.map((emp) => {
      const birthDate = new Date(emp.dob);

      let nextBirthday = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
      );

      if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
      }

      const diffTime = nextBirthday - today;
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        _id: emp._id,
        name: emp.name,
        email: emp.email,
        dob: emp.dob,
        daysLeft,
      };
    });

    // filter by search query if provided
    if (search) {
      const lowerSearch = search.toLowerCase();
      birthdays = birthdays.filter((emp) =>
        emp.name.toLowerCase().includes(lowerSearch)
      );
    }

    birthdays.sort((a, b) => a.daysLeft - b.daysLeft);

    res.json(birthdays);
  } catch (err) {
    console.error("Birthday fetch error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For anniversary tab in side bar with search
app.get("/employee/anniversary", async (req, res) => {
  try {
    const { search } = req.query;
    const employees = await Employee.find({}, "name email doj");
    const today = new Date();

    let anniversary = employees.map((emp) => {
      const anniversaryDate = new Date(emp.doj);

      // next occurrence of anniversary
      let nextAnniversary = new Date(
        today.getFullYear(),
        anniversaryDate.getMonth(),
        anniversaryDate.getDate()
      );

      // if this year's anniversary has passed, take next year
      if (nextAnniversary < today) {
        nextAnniversary.setFullYear(today.getFullYear() + 1);
      }

      const diffTime = nextAnniversary - today;
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        _id: emp._id,
        name: emp.name,
        email: emp.email,
        doj: emp.doj,
        daysLeft,
      };
    });

    // filter by search query
    if (search) {
      const lowerSearch = search.toLowerCase();
      anniversary = anniversary.filter((emp) =>
        emp.name.toLowerCase().includes(lowerSearch)
      );
    }

    // sort by nearest anniversary
    anniversary.sort((a, b) => a.daysLeft - b.daysLeft);

    res.json(anniversary);
  } catch (err) {
    console.error("Anniversary fetch error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
