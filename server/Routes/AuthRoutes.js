const { register, login } = require('../Controller/AuthControllers')
const { checkUser } = require('../Middlewares/middlewares')
const {adminLogin,dashboard,getUserForEdit,submitUserEdit,deleteUser,imageSubmit,getDataOfUser,deleteImage} = require('../Controller/AuthControllers')
const {checkAdmin} = require('../Middlewares/middlewares')

const multer = require('multer');


// handle storage using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './userImage')
    },
    filename: (req, file, cb) => {
        cb(null,  Date.now() + '-' + file.originalname  )
    }
});
 const upload = multer({ storage: storage });



const router = require('express').Router()
router.post('/',checkUser)
router.post('/register',register)
router.post('/login',login)
router.post('/admin-login',adminLogin)
router.post('/admin-dashboard',dashboard)
router.post('/edit-user/:userId',getUserForEdit)
router.post('/edit-submit/:userId',submitUserEdit)
router.post('/delete-user/:userId',deleteUser)
router.post('/submitImage/:userId',upload.any('image'),imageSubmit)
router.post('/getUserData/:userId',getDataOfUser)
router.post('/deleteImage/:userId/:imageName',deleteImage)







module.exports = router;