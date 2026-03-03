const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./config/db");
const cors = require('cors')

dotenv.config();
dbConnect();

const app = express();
app.use(cors())
app.use(express.json());
app.use("/uploads", express.static("uploads"));


const authRoutes = require('./routes/authRoutes')
app.use('/api/v1/auth', authRoutes)

const jobRoutes = require("./routes/jobRoutes");
app.use("/api/v1/jobs", jobRoutes);

const JobApplication = require("./routes/jobApplicationRoutes");
app.use("/api/v1/jobapplication", JobApplication);

const analyticsRoutes = require("./routes/analyticsRoutes");
app.use("/api/v1/analytics", analyticsRoutes);
console.log("✅ Analytics routes registered at /api/v1/analytics");




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
