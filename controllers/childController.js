var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/ChildDevelopmentDB";
// const child = require('../models/child')
const validateChild = require('./validate')
const child = require('../models/child');
const jwt = require("jsonwebtoken");
// const { update } = require('../models/child');
const vaccine = require('../models/vaccine');
var moment = require('moment')
// var storage = require('filestorage').create('./childPictures');
const Joi = require('joi');


const TOKEN_SECRET =
  "F9EACB0E0AB8102E999DF5E3808B215C028448E868333041026C481960EFC126";

const generateAccessToken = (username) => {
  return jwt.sign({ username }, TOKEN_SECRET);
};

class childController {

  async login(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    //Check the child in the server
    let result = await child.findOne({ 'id': req.query.id, 'password': req.query.password })
    if (result != null) {
      const token = generateAccessToken(result.id);
      return res.status(200).json({ token, result });
    }
    return res.status(204).send('user dont exist');
  };

  //insert child
  async signup(req, res) {
    const { error } = await validateChild(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    else {
      const { firstName, lastName, id, email, password, weightHistory, birthDate } = req.body;
      let existUser = await child.findOne({ 'id': req.body.id });
      if (existUser) {
        return res.status(400).send('That user already exisits!');
      }
      else {
        let newUser = new child(req.body);
        let saved = await newUser.save();
        const token = generateAccessToken(req.body);
        console.log("token", token);
        return res.json({ token }).send();
      }
    }
  };

  //insert weight + age to weight history
  async putWeight(req, res) {
    let userToUpdate = await child.findById(req.query.id);
    userToUpdate.weightHistory.push(req.body);
    let userToSave = await userToUpdate.save();
    return res.status(200).send(userToSave);

  }

  async putBornWeight(req, res) {
    let userToUpdate = await child.findById(req.query.id);
    userToUpdate.weightHistory[0].weight = req.body.weightBorn;
    userToUpdate.weightHistory.push(req.body.weightToInsert);
    let userToSave = await userToUpdate.save();
    return res.status(200).send(userToSave);
  }


  async getChildVaccine(req, res) {
    let c = await child.findById(req.params.id);
    let age = moment.duration(moment(new Date()).diff(c.birthDate));
    let ageInMonth = age._data.months + age._data.years;
    let v = await vaccine.find({ minAge: { $lt: ageInMonth } })//לבדוק האם הילד קיבל כבר את החיסון ע"פ פנקס החיסונים של הילד
    v.forEach(element => element.minAge = element.minAge.filter(age => ageInMonth > age))
    for (let i = 0; i < v.length; i++) {
      const element = v[i];
      for (let j = 0; j < c.recordVaccines.length; j++) {
        if (c.recordVaccines[j].vaccineId.equals(element._id)) {
          var vaccineGet = c.recordVaccines[j].NumberOfVaccineDoses;
          var l = element.minAge.length;
          element.minAge.splice(0, vaccineGet);
        }
      }
    }
    let finalV = []
    v.forEach(element => element.minAge.length > 0 ? finalV.push(element) : console.log(element));
    return res.status(200).send(finalV);
  }

  async updateRecordVaccine(req, res) {
    let c = await child.findById(req.body.idChild);
    let flag = false;
    for (let i = 0; i < c.recordVaccines.length; i++) {
      let element = c.recordVaccines[i];
      if (element.vaccineId == req.body.idVaccine) {
        element.NumberOfVaccineDoses++;
        flag = true;
      }
    }
    if (!flag) {
      c.recordVaccines.push({ vaccineId: req.body.idVaccine, NumberOfVaccineDoses: 1 })
    }
    let vaccineToSave = await c.save();
    return res.status(200).send(c.recordVaccines);
  }
  async postPicture(req, res) {
    console.log("postPicturepostPicture");
    // console.log(req.body, " id, picture id, picture ");
    return res.send("create item")
  }
 

}

module.exports = new childController();

