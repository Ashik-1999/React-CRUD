const { response } = require("express")
const db = require('../config/connection')
const bcrypt = require('bcrypt')
var objectId=require('mongodb').ObjectId


module.exports={

    userSignUp:(userData)=>{
        
        let userExist=false
        return new Promise(async(resolve,reject)=>{
    
            let alreadyUser=await db.get().collection('users').findOne({$or:[{email:userData.email},{number:userData.number}]})
    
            if(alreadyUser){
                userExist=true
                reject(userExist)
            }else{
    
                userData.password=userData.password.toString()
                
                userData.password=await bcrypt.hash(userData.password,10)
              
                db.get().collection('users').insertOne(userData).then((data)=>{
                    userExist=false
                    resolve(data)
                    
                })
            }        
        })
    },

    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
                let response={}
                let userLogin=await db.get().collection('users').findOne({email:userData.email})
                if(userLogin){
                   
                        bcrypt.compare(userData.password,userLogin.password).then((status)=>{
                            if(status){
                                console.log('+++++++++++++')
                                console.log('login success')
                                console.log('+++++++++++++')
                                response.userdata=userLogin
                                response.status=true
                                resolve(response)
                            }else{
                               
                                response.status=false
                                response.errMessage="Invalid password"
                                
                                
                                reject(response)
                            }
                        })
                }else{
                    response.status=false
                    response.errMessage="Invalid mail id"
                    reject(response)
                }
            
           
            

        })
    },

    getUserData:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('users').find().toArray().then((users)=>{
                console.log(users,"users")
                resolve(users)
            })
        })
    },

    editUserData:(userId)=>{
        console.log(userId,"iddddddd")
        const userid = objectId(userId)
        return new Promise((resolve,reject)=>{
         db.get().collection('users').findOne({_id:userid}).then((user)=>{
            console.log(user,"uuu")
            resolve(user)
            
         })     
        })  
    },

    getUserDetails:(userId)=>{
        console.log(userId,"iddddddd")
        const userid = objectId(userId)
        return new Promise((resolve,reject)=>{
         db.get().collection('users').findOne({_id:userid}).then((user)=>{
            console.log(user,"uuu")
            resolve(user)
            
         })     
        })  
    },

    userEditSubmit:(id,{email,name,number})=>{
        return new Promise(async(resolve,reject)=>{
           await db.get().collection('users').updateOne({_id:objectId(id)},
            {$set:{
                email:email,
                name:name,
                number:number
            }}
            )
            resolve()
        })
    },

    deleteUser:(id)=>{
        console.log(id,"idd")
        return new Promise((resolve,reject)=>{
            db.get().collection('users').deleteOne({_id:objectId(id)}).then(()=>{
                console.log("deleted")
                resolve()
            })
        })
    },
 
    
    addUserImage:(Image,id)=>{
        const imgPath = Image.img[0]
       
        return new Promise((resolve,reject)=>{
            db.get().collection('users').updateOne({_id:objectId(id)},
            {$set:{
                image:imgPath
            }}).then((response)=>{
                console.log(imgPath,id,"comingggg")
                resolve(imgPath)
            })
        })
    },


    getImageFileName:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('users').findOne({_id:objectId(userId)}).then((userData)=>{
                console.log(userData,"uuu")
                resolve(userData)  
            })
          
        })
    },

    deleteUserImage:(userId,fileName)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('users').updateOne({_id:objectId(userId)},{$unset:{image:fileName}}).then(()=>{
                resolve()
            })
        })
    }

}

