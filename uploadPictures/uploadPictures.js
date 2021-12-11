var storage = require('filestorage').create('/path/to/directory/');

storage.insert('a.JPG', 'C:/שיפי/משפחה/שנה טובה/a.JPG',
    'my baby',
    function (err, id, stat) {

        console.log(id);
        console.log(stat);
    }, 'babyyyyyyyyyy');
