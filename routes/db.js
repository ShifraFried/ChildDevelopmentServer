const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

class dataBase {

    constructor() {
    }

    connect() {
        let url = "mongodb://localhost:27017/ChildDevelopmentDB";
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log("DB connect succefuly");
        })
            .catch((err) => {
                console.log("connect failed")
            })
    }
}

module.exports = new dataBase();
