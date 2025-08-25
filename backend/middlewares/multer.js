import multer from "multer";
//it will take img from frontend and store in public folder
const storage=multer.diskStorage({
  destination:(req, file, cb)=>{
    cb(null, "./public")
  },
  filename:(req, file, cb)=>{
    cb(null, file.originalname)
  }
})

const upload = multer({storage})
export default upload