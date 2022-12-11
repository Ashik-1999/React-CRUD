
const jwt = require('jsonwebtoken')
const maxAge = 3 * 24 * 60 * 60;

const userHelpers = require('../helpers/userHelpers');




const createToken = (id) => {
    return jwt.sign({ id }, "akhil", {
        expiresIn: maxAge
    })
}

const createTokenAdmin = (id) => {
  return jwt.sign({ id }, "admin", {
      expiresIn: maxAge
  })
}

const credentials = {
  email:"admin@gmail.com",
  password:"123"
}


const handleErrors = (err) => {
    let errors = { email: "", password: "" };
  
    console.log(err);
    if (err.message === "incorrect email") {
      errors.email = "That email is not registered";
    }
  
    if (err.message === "incorrect password") {
      errors.password = "That password is incorrect";
    }
  
    if (err.code === 11000) {
      errors.email = "Email is already registered";
      return errors;
    }
  
    if (err.message.includes("Users validation failed")) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  };

module.exports.register = async (req, res, next) => {
    console.log(req.body,"reee")
 
   
    try {
        userHelpers.userSignUp(req.body).then((response)=>{
          const token = createToken(response.insertedId)
          console.log(response,"responseee")
        res.cookie("jwt", token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000,
        })
          res.status(201).json({user:response.insertedId, created: true })
        }).catch((userExist)=>{
            res.json({userExist:true})
        })

        
    } catch (err) {
        console.log(err);
        const errors = handleErrors(err)
        res.json({ errors, created: false })
    }
}

module.exports.login = async (req, res) => {
  
  try {
    userHelpers.doLogin(req.body).then((response)=>{
      console.log(response,"response loginn")
      const userId = response.userdata._id
      const token = createToken(userId);
      res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 });
      res.status(200).json({ user: userId, status: true, userData:response.userdata });
    }).catch((response)=>{
      res.json({errorMessage:response.errMessage,status:response.status})
    })
   
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};



module.exports.adminLogin = async (req, res) => {
  console.log(req.body)
  
  try {
    if(req.body.email==credentials.email&&req.body.password==credentials.password){
      
    const token = createTokenAdmin(credentials.email);
    res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 });
    res.status(200).json({ admin: credentials.email, status: true });
    }else{
      res.json({errorMessage:"invalid username or password",status:false})
    }
    
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });  
  }
};

module.exports.dashboard = async (req, res) => {

  
  try {
      userHelpers.getUserData().then((userData)=>{
        console.log(userData,"userssss")
        res.json({userData,status:true})

      })
   
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });  
  }
};

module.exports.getUserForEdit = async(req,res)=>{
  const {userId} = req.params
  const id = userId.slice(1)
  
  try {
    userHelpers.editUserData(id).then((user)=>{
      console.log(user,"llllllllllllllllll")
      res.json({user,status:true})

    })
 
} catch (err) {
  const errors = handleErrors(err);
  res.json({ errors, status: false });
}
}

module.exports.submitUserEdit = async(req,res)=>{
  const {userId} = req.params
  const id = userId.slice(1)
 
  try{
    userHelpers.userEditSubmit(id,req.body).then(()=>{
      res.json({update:true})
    })
  }
  catch(err){
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
}

module.exports.deleteUser = async(req,res)=>{
  const {userId} = req.params
  const id = userId.slice(1)
  try{
    userHelpers.deleteUser(id).then(()=>{
      res.json({delete:true})
    })
  }
  catch(err){
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }

}

module.exports.imageSubmit = async(req,res)=>{
  const files = req.files
    const file = files.map((file)=>{
        return file
    })
    const fileName = file.map((file)=>{
     
        return file.filename
    })
 
    const img = [files[0]]

    const {userId} = req.params
    const id = userId.slice(1)
    console.log(id,"paramss")
    const product = req.body
    product.img = fileName
   
    userHelpers.addUserImage(product,id).then((response)=>{
      console.log(response,']]]]]]]]]]]]]]]]]]]]]]]]]]]]]]')
         res.json(response)
    })
 
}

module.exports.getDataOfUser = async(req,res)=>{
  const {userId} = req.params
  const id = userId.slice(1)
  userHelpers.getUserDetails(id).then((data)=>{
    console.log(data,"data when use Effect")
    res.json(data)
  })
} 

module.exports.deleteImage = async(req,res)=>{
  const {userId,imageName} = req.params
  console.log(userId,imageName)
  const id = userId.slice(1)
   const fileName = imageName.slice(1)
   console.log(id,fileName)
    userHelpers.deleteUserImage(id,fileName).then(()=>{
        res.json({imageDelete:true})
    })
}