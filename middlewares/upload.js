const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const id = req.params.id;
        console.log(id, "ididid");
        require('filestorage').create(`upload/${id}`)
        cb(null,`upload/${id}`);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }

    cb(null, false)
}

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter
})

module.exports = upload;