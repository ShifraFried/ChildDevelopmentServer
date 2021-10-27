var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/ChildDevelopmentDB";
const child = require('../models/child')
const jwt = require("jsonwebtoken");
const { update } = require('../models/child');
const vaccine = require('../models/vaccine');
var moment = require('moment')


const TOKEN_SECRET =
  "F9EACB0E0AB8102E999DF5E3808B215C028448E868333041026C481960EFC126";

const generateAccessToken = (username) => {
  return jwt.sign({ username }, TOKEN_SECRET);
};

class childController {

  //check if its a correct child  
  async login(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    //Check the child in the server
    let result = await child.findOne({ 'id': req.query.id, 'password': req.query.password })
    if (result != null) {
      console.log(result);
      const token = generateAccessToken(result.id);
      console.log("token", token);
      return res.status(200).json({ token, result });
    }
    return res.status(204).send('user dont exist');
  };


  //insert child
  async signup(req, res) {
    console.log('on login');
    console.log("req.body", req.body)
    const { firstName, lastName, id, email, password, weightHistory, birthDate } = req.body;
    console.log(req.body.weightHistory);
    //Validations.
    //Check if user exists
    // var myobj = { firstName, lastName, id, email, password, weightHistory: [], birthDate };
    let newUser = new child(req.body);
    console.log(newUser, "nUser");
    let saved = await newUser.save();
    const token = generateAccessToken(req.body);
    console.log("token", token);
    return res.json({ token }).send();
  };

  //insert weight + age to weight history
  async putWeight(req, res) {
    console.log('in put weight');
    let userToUpdate = await child.findOne({ 'id': req.query.id });
    console.log(userToUpdate, "userToUpdate");
    console.log(req.body, "req.body");
    userToUpdate.weightHistory.push(req.body);
    let userToSave = await userToUpdate.save();
    return res.status(200).send("secces");

  }

  async putBornWeight(req, res) {
    console.log('in put weight');
    let userToUpdate = await child.findById(req.query.id);
    console.log(userToUpdate, "userToUpdate");
    console.log(req.body, "req.body");
    userToUpdate.weightHistory[0].weight = req.body.weightBorn;
    userToUpdate.weightHistory.push(req.body.weightToInsert);
    let userToSave = await userToUpdate.save();
    return res.status(200).send();
  }

  async getChildVaccine(req, res) {
    // console.log("in vaccine")
    let c = await child.findById(req.params.id);
    console.log(c, "child");
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
    // console.log(v, "after for");
    // .forEach(e => c.recordVaccines.forEach(rv => e._id == rv.idVaccine ? rv.NumberOfVaccineDoses>1?);
    // console.log(filterVaccine);
    // filterVaccine.forEach(element => c.recordVaccines.)
    return res.status(200).send(v);
  }

  async updateRecordVaccine(req, res) {
    console.log("in updateRecordVaccine");
    // console.log(req.body);
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
    // c.recordVaccines.forEach(element => element.vaccineId == req.body.idVaccine ? element.NumberOfVaccineDoses++ :
    // c.recordVaccines.push({ vaccineId: req.body.idVaccine, NumberOfVaccineDoses: 1 }));
    let vaccineToSave = await c.save();
    return res.status(200).send(c.recordVaccines);

  }
}

module.exports = new childController();

