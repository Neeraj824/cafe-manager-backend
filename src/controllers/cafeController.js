const Cafe = require("../models/Cafe");
const CafeEmployees = require("../models/CafeEmployees");
const Employee = require("../models/Employee");
const {fn,col,literal,sequelize} = require('../config/database'); // Adjust the path if needed

const path = require('path');
exports.getAllCafes = async (req, res) => {
  try {
    const cafes = await Ca
    fe.findAll();
    res.json(cafes);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error fetching cafes" });
  }
};
exports.getCafesByLocation = async (req, res) => {
  try {
    const { location } = req.query;

    let whereClause = {};
    if (location) {
      whereClause.location = location; // Filter by location if provided
    }
    const cafes = await Cafe.findAll({
      where: whereClause,
      include: [
        {
          model: CafeEmployees, 
          attributes: [],
          required: false
        }
      ],
      group: ['Cafes.id', 'Cafes.name', 'Cafes.location', 'Cafes.description', 'Cafes.logo'], 
      attributes: [
        'id', 'name', 'location', 'description','logo',
        [fn('COUNT', col('CafeEmployees.employee_id')), 'employeeCount'] // Count employees in each cafe
      ],
      order: [[literal('employeeCount'), 'DESC']] // Sort by the highest number of employees
    });

    res.json(cafes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching cafes" });
  }
};

exports.createCafe = async (req, res) => {
  try {
    const { name, description, location } = req.body;
    let logo = null;
    if (req.file) {
      const logoPath = path.join('/upload', req.file.filename); // Store relative path to the logo
      logo = logoPath; // Assuming you have a `logo` column in the `Cafe` model
    }
    const newCafe = await Cafe.create({ name, description, location,logo });
    res.status(201).json(newCafe);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error creating cafe" });
  }
};

exports.updateCafe = async (req, res) => {
  try {
    // console.log("req",req.body)
    // console.log("file",req.file)
    // throw new Error("sdfsd")
    const { id } = req.body;
    const cafe = await Cafe.findByPk(id);

    if (!cafe) {
      return res.status(404).json({ error: "Cafe not found" });
    }

    cafe.name = req.body.name || cafe.name;
    cafe.description = req.body.description || cafe.description;
    cafe.location = req.body.location || cafe.location;

    if (req.file) {
      const logoPath = path.join('/upload', req.file.filename); // Store relative path to the logo
      cafe.logo = logoPath; // Assuming you have a `logo` column in the `Cafe` model
    }

    await cafe.save();
    res.json(cafe);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error updating cafe" });
  }
};

exports.deleteCafe = async (req, res) => {
  const { id } = req.body;
  try {
          await CafeEmployees.destroy({
            where: { cafe_id: id },
          });
          // Delete the cafe itself
          const deletedCafe = await Cafe.destroy({
            where: { id: id },
          });
          if (deletedCafe === 0) {
            // No cafe was deleted, meaning it wasn't found
            throw new Error('Cafe not found');
          }
    // Respond with a success message
    res.status(200).json({ message: "Cafe and associated employees deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting cafe" });
  }
};