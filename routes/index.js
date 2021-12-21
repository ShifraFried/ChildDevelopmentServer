var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const childController = require('../controllers/childController');
const vaccineController = require('../controllers/vaccineController');

var MongoClient = require('mongodb').MongoClient;
var urlToCreate = "mongodb://localhost:27017/ChildDevelopmentDB";
var url = "mongodb://localhost:27017/";


//create DB
router.get("/createDB", (req, res) => {
  MongoClient.connect(urlToCreate, function (err, db) {
    if (err) {
      console.error(err)
      return res.status(500).send(err);
    } else {
      console.log("Database created!");
      db.close();
      return res.send(err);
    }
    res.send();
  });
})

//create children collection
router.get("/createChildrenColection", () => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("ChildDevelopmentDB");
    dbo.createCollection("children", function (err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
})

//create veccine collection
router.get("/createVaccinesColection", () => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("ChildDevelopmentDB");
    dbo.createCollection("vaccines", function (err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
})

router.post("/signup",childController.signup);
router.get("/login",childController.login);
router.put("/putWeight",childController.putWeight);
router.put("/putBornWeight",childController.putBornWeight);
router.post("/postVaccine",vaccineController.postVaccine);
router.get("/getAllVaccine",vaccineController.getAllVaccine);
router.get("/getChildVaccine/:id",childController.getChildVaccine);
router.put("/updateRecordVaccine",childController.updateRecordVaccine);
router.post("/createItem/:id",childController.createItem);
router.delete("/removeImage",childController.removeImage);




module.exports = router;
