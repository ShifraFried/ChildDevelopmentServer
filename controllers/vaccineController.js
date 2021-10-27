var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/ChildDevelopmentDB";
const vaccine = require('../models/vaccine')

class vaccineController {

    async getAllVaccine(req, res) {
        let v = await vaccine.find();
        res.send(v);
    }

    async postVaccine(req, res) {
        let newVaccine = new vaccine(req.body);
        let saved = await newVaccine.save();
        res.send(saved);
    }

}
module.exports = new vaccineController();
