import multer from "multer";
import fs from "fs";

// Ensure uploads folder exists
const uploadPath = "uploads/";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// FILE FILTER
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

// UPLOAD
const upload = multer({
  storage,
  fileFilter,
});

export default upload;