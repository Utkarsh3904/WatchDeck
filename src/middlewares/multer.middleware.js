import multer from "multer";
//read multer doc for to know how this work

//using diskstorage not memory stroage as disk is big.(cb is callback)

 const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/temp"), // Folder location
  filename: (req, file, cb) => {

    cb(null, file.originalname);  //it return the original file name
  }
});

export const upload = multer({ storage });
