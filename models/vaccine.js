const mongoose = require('mongoose');
const schema = mongoose.Schema;

const vaccinesSchema = new mongoose.Schema({
    vaccineName: String,
    minAge: [Number],
    infomation:String,
    frequency:Number
})

module.exports = mongoose.model('vaccines', vaccinesSchema);

