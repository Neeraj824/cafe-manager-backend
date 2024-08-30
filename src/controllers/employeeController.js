const Employee = require("../models/Employee");
const Cafe = require("../models/Cafe");
const CafeEmployees = require("../models/CafeEmployees");
const { Op,sequelize } = require("sequelize");
const moment = require("moment");


exports.getEmployeesByCafe = async (req, res) => {
    try {
      const { cafeId } = req.query;
  
      // Join Employee and CafeEmployees
      let whereClause = {};
      if (cafeId) {
        const cafeRecord = await Cafe.findOne({ where: { id: cafeId } });
        if (!cafeRecord) {
          return res.status(200).json([]); 
        }
        whereClause.cafe_id = cafeRecord.id;
      }
  
      const cafeEmployees = await CafeEmployees.findAll({
        where: whereClause,
        include: [
          { 
            model: Employee, 
            attributes: ["id","name", "email_address", "phone_number"] 
          },
         { 
          model: Cafe, 
          attributes: ["name"] 
        }
        ],
        // order: [[sequelize.literal("days_worked"), "DESC"]]
      });
      // Calculate days worked and format the response
      const employeeList = cafeEmployees.map((cafeEmployee) => {
        const daysWorked = moment().diff(moment(cafeEmployee.start_date), "days");
        return {
          id: cafeEmployee.Employee.id,
          name: cafeEmployee.Employee.name,
          email_address: cafeEmployee.Employee.email_address,
          phone_number: cafeEmployee.Employee.phone_number,
          days_worked: daysWorked,
          cafe: cafeEmployee.Cafe ? cafeEmployee.Cafe.name : "",
        };
      });
      employeeList.sort((a, b) => b.days_worked - a.days_worked);
      res.json(employeeList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching employees" });
    }
  };


exports.createEmployee = async (req, res) => {
    try {
      const { name, email_address, phone_number, gender,cafe_id } = req.body;
      
      const employeeId = `UI${Math.random().toString(36).substr(2, 7).toUpperCase()}`;
      const newEmployee = await Employee.create({ id: employeeId, name, email_address, phone_number, gender });
      if(cafe_id){
        await CafeEmployees.create({
            cafe_id,
            start_date:moment.now(),
            employee_id: newEmployee.id
          });
      }
      res.status(201).json(newEmployee);
    } catch (error) {
      console.log(error)
      if (error.name === 'SequelizeValidationError') {
        // Extract all validation error messages
        const validationErrors = error.errors.map(err => ({
          message: err.message
        }));
  
        return res.status(400).json({
          error: "Validation error",
          validationErrors
        });
      }
      res.status(500).json({ error: "Error creating employee" });
    }
  };

  exports.updateEmployee = async (req, res) => {
    try {
      const { id, name, email_address, phone_number, gender, cafe_id } = req.body;
      const employee = await Employee.findByPk(id);
  
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
  
      employee.name = name || employee.name;
      employee.email_address = email_address || employee.email_address;
      employee.phone_number = phone_number || employee.phone_number;
      employee.gender = gender || employee.gender;
      employee.cafe_id = cafe_id || employee.cafe_id;
  
      await employee.save();

      if (cafe_id) {
        // Find the existing CaféEmployee entry
        const existingCafeEmployee = await CafeEmployees.findOne({ where: { employee_id: id } });
  
        if (existingCafeEmployee) {
          // Update the café assignment
          existingCafeEmployee.cafe_id = cafe_id;
          existingCafeEmployee.start_date = moment.now(); // Optional: Update the start date
          await existingCafeEmployee.save();
        } else {
          // Create a new CaféEmployee entry if not existing
          await CafeEmployees.create({
            cafe_id,
            start_date: moment.now(),
            employee_id: id
          });
        }
      } else {
        // If no cafe_id is provided, you might want to handle unassigning the employee from a café
        await CafeEmployees.destroy({ where: { employee_id: id } });
      }


      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Error updating employee" });
    }
  };


  exports.deleteEmployee = async (req, res) => {
    try {
      const { id} = req.body; 
      const employee = await Employee.findByPk(id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      await CafeEmployees.destroy({
        where: { employee_id: id },
      });
      // Delete the cafe itself
      const deletedEmployee = await Employee.destroy({
        where: { id: id },
      });
      if (deletedEmployee === 0) {
        // No cafe was deleted, meaning it wasn't found
        throw new Error('Employee not found');
      }
      // Respond with a success message
      res.json({ message: "Employee deleted successfully" });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting employee" });
    }


  };