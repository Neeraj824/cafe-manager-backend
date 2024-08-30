const express = require("express");
const {
  getEmployeesByCafe,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const router = express.Router();

router.get("/employees", getEmployeesByCafe);
router.post("/employee", createEmployee);
router.put("/employee", updateEmployee);
router.delete("/employee", deleteEmployee);

module.exports = router;