const express = require("express");
const sequelize = require("./config/database");
const cafeRoutes = require("./routes/cafeRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const path = require('path');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001' 
}));

app.use('/upload', express.static(path.join(__dirname, '../upload')));


app.use("/api", cafeRoutes);
app.use("/api", employeeRoutes);

sequelize.sync().then(() => {
  console.log("Database synchronized");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});