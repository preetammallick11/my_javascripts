const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require("mongoose");

/*******************
connect to mongodb database by using Mongoose
********************/
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/my_collection", { useNewUrlParser: true, useUnifiedTopology: true });

/******************
create
*******************/
// create new schema for collection (my_table_1) within my_collection collection
var nameSchema = new mongoose.Schema({
    userName: String,
    userEmail: String
});
// create model
var User = mongoose.model("User", nameSchema);

/******************
fetch data
********************/
// fetch collection data
var userDetails = new mongoose.Schema({
    userName: String,
    userEmail: String
}, {collection: 'users'});

var userDetailsModel = mongoose.model("userDetails", userDetails);

/******************
update data 
********************/
// xxxxxx ============== xxxxxxxx ================== xxxxxxxx

const PORT = 3000;

const app = new express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get('/', function(req, res) {
    res.send('test from server');
})

/******************
GET data on load
********************/
app.get('/my-data', function(req, res) {
    // res.status(200).send({"message":"data from server", "data": {"name": "Preetam", "email":"test@gmail.com", "phone": 9876543210}})

    userDetailsModel.find({}, function(err, data){
        // console.log(">>>> " + data );
        res.status(200).send({"data": data})
    })
})

/***********************
POST data on form submit
************************/
app.post('/post-data', function(req, res) {
    // res.status(200).send({"message":"data received", "data": req.body})

    // save to mongodb database
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.status(200).send({"message":"item saved to database", "server_response": item});
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
})

/**************************************************************
UPDATE data on (Currently on reload) for _id = 5e4f8953c09ec834bca27c41
***************************************************************/
app.put('/update-data', function(req, res) {
    //res.status(200).send({"message":"data receiveddd", "data": req.body})

    // find for the user_id *********************************************
    // User.findOne({_id: '5e4f8953c09ec834bca27c41'}, (err, user) => {
    //     //console.log(err, user)
    //     if (err || !user) {
    //         res.status(400).send({status: 'failed', message: 'user is missing'});
    //     } else {
    //         // res.status(200).send({status: 'success', data: user})
            var myquery = { _id: req.body.id };
            var newvalues = { $set: { userName: req.body.userName, userEmail: req.body.userEmail } };

            User.updateOne(myquery, newvalues, function(err, response) {
                if (err) throw err;
                res.status(200).send({status: 'success', message: '1 document updated', data: response})
            });
    //     }
    // });
})

/**************
REMOVE document
***************/
app.post('/delete-data', function(req, res) {
    // console.log(req.body)
    var myquery = { _id: req.body._id };
    User.deleteOne(myquery, function(err, obj) {
        if (err) throw err;
        res.status(200).send({status: 'success', message: '1 document deleted', data: obj})
    });
})

app.listen(PORT, function() {
    console.log('localhost:'+PORT)
})