require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 5001;
const authenticate = require('./src/middleware/authenticate');
const userRoute = require('./src/routes/user.route');
const taskRoute = require('./src/routes/task.route');

app.use(cors({
  origin: ['http://localhost:3000', 'https://to-do-list-dimar.vercel.app/'], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,               
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', userRoute);
app.use('/tasks', taskRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});