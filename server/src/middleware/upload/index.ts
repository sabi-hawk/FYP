import util from "util";
import multer from "multer";

const maxSize = 2 * 1024 * 1024;
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        console.log("file name", file.originalname);
        cb(null, file.originalname);
    },
});

let uploadFile = multer({
    storage: storage,
    limits: {fileSize: maxSize},
}).array("file");

let uploadFileMiddleware = util.promisify(uploadFile);
export default uploadFileMiddleware;