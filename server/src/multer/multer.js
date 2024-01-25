import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../../E-COM/server/public/images")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

export const upload = multer({ storage: storage });
