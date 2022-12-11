const express = require('express')
const cors = require('cors')

const app = express();
const authRoutes= require('./Routes/AuthRoutes')
const cookieParser = require('cookie-parser')
var db = require('./config/connection')
app.use('/userImage',express.static('userImage'))

app.listen(4000, () => {
    console.log('server connected');
})

// MongoClient.connect('mongodb://localhost:27017/jwt-redux',(err,client)=>{
//     if(err){
//         console.log(err)
//     }else{
//         client.db('week16').collection('user')
//         console.log("database connected")
//     }
// })

// mongoose.connect("mongodb://localhost:27017/jwt-redux",{
//     useNewUrlParser:true,useUnifiedTopology:true,
// }).then(()=>{
//     console.log('database connected successfully');
// }).catch((err)=>{
//     console.log(err.message);
// })

db.connect((err)=>{
    if(err){
        console.log("databse error")
    }else{
    console.log("database connected")

    }
})


app.get('/', (req, res) => {
    res.send('hi')
})


app.use(cors({
    origin: ['http://localhost:3000'],
    method: ['GET', 'POST'],
    credentials: true,
}));

app.use(cookieParser())
app.use(express.json());
app.use('/', authRoutes)