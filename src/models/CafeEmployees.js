const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Cafe = require("./Cafe");
const Employee = require("./Employee");

const CafeEmployees = sequelize.define("CafeEmployees", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  employee_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cafe_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  }
});
Cafe.hasMany(CafeEmployees, { foreignKey: 'cafe_id' });
Employee.hasMany(CafeEmployees, { foreignKey: 'employee_id' });

CafeEmployees.belongsTo(Cafe, { foreignKey: 'cafe_id' });
CafeEmployees.belongsTo(Employee, { foreignKey: 'employee_id' });


module.exports = CafeEmployees;