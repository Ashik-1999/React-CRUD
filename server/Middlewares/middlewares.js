
const jwt = require("jsonwebtoken");
const db = require('../config/connection');
const { Collection } = require("mongodb");
var objectId=require('mongodb').ObjectId
module.exports.checkUser = (req, res, next) => {
  console.log(req.cookies,"cookiesss")
  const token = req.cookies.jwt;
  console.log(token,"tokenn user")
  if (token) {
    jwt.verify(
      token,
      "akhil",
      async (err, decodedToken) => {
        if (err) {
          res.json({ status: false });
          next();
        } else {
          const users = await db.get().collection('users').findOne({_id:objectId(decodedToken.id)})
           res.json({ status: true,user:users});
        
          next();
        }
      }
    );
  } else {
    res.json({ status: false });
    next();
  }
};

module.exports.checkAdmin = (req, res, next) => {
  console.log("admin enters")
  console.log(req.cookies,"admin cookie")
  const token = req.cookies.jwt;
  console.log(token,"tokenn admin")
  if (token) {
    console.log("token created")
    jwt.verify(
      token,
      "admin",
      async (err, decodedToken) => {
        if (err) {
          console.log("error occured")
          res.json({ status: false });
          next();
        } else {
          console.log(decodedToken,"admin token")
           res.json({ status: true,admin:decodedToken.id.name});
         
          next();
        }
      }
    ); 
  } else {
    console.log("else worked no token")
    res.json({ status: false });
    next();
  }
};

