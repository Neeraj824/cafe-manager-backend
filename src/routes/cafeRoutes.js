const express = require("express");
const {
  getCafesByLocation,
  createCafe,
  deleteCafe,
  updateCafe
} = require("../controllers/cafeController");
const upload = require('../middleware/upload'); 
const cafeController = require('../controllers/cafeController');


const router = express.Router();

router.get("/cafes", getCafesByLocation);
// router.post("/cafe", createCafe);
router.post('/cafe', upload.single('logo'), createCafe);
router.put('/cafe', upload.single('logo'), updateCafe);
router.delete("/cafe", deleteCafe);

module.exports = router;