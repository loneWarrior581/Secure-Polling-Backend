require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 8000;
//middlewares 
app.use(express.json())
app.use(cors());
mongoose.connect(process.env.MONGO_URI,
    {
        dbName: "pollingApp",//giving the database name 
        user: process.env.USER,
        pass: process.env.PASS,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("Mongodb connected...");
    })
    .catch((err) => {
        console.log(err)
        console.log("Connection failed...")
    });

app.use('/user', require('./router/userRouter'))
app.use('/', require('./router/pollRouter'));


app.listen(8000, () => {
    console.log(`Server started running on port http://localhost:${PORT}`);
})