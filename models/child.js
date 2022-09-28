const mongoose = require('mongoose');
const schema = mongoose.Schema;

const childSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    id: {
        type: String,
        length: 9,
        unique: true
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        unique: true
    },
    weightHistory: [{ age: Number, weight: String, date: Date }],
    birthDate: Date,
    recordVaccines: [{
        vaccineId: {
            type: schema.Types.ObjectId,
            ref: 'vaccines'
        },
        NumberOfVaccineDoses: Number
    }, { timestamps: true }],
    myPictures: []
})

module.exports = mongoose.model('children', childSchema);
