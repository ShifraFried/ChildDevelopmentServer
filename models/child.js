const mongoose = require('mongoose');
const schema = mongoose.Schema;
const moment = require('moment')

const childSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    id: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        unique: true
    },
    weightHistory:[{age:Number,weight:String,date:Date}],
    birthDate: Date,
    recordVaccines:[{
       vaccineId:{type:schema.Types.ObjectId,
        ref:'vaccines'} ,
        // date: Date,
        NumberOfVaccineDoses:Number
    },{ timestamps: true }],
    myPictures:[]
}
// , { virtuals: true })
)

// childSchema.virtual('age').
//     get(function () { return moment.duration(moment(new Date()) - this.birthDate); });

module.exports = mongoose.model('children', childSchema);