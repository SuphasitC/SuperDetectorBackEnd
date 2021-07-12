const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileSystem = require('fs');

const app = express();

const cars = require('./cars.json');
const people = require('./people.json');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017";
const serverPort = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

app.get('/', (req, res) => {
    res.send("Server is running...");
});

app.get('/people', (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
        (err, db) => {
            if (err) throw err;
            var dbo = db.db("super-detector");
            dbo.collection("people").find({}).toArray((err, people) => {
                if (err) throw err;
                res.send(people);
                db.close();
            });
        }
    );
    // res.status(404).send("Cannot find this person.");
});

app.get('/people/:id', (req, res) => {
    var person_id = req.params.id;
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
        (err, db) => {
            if (err) throw err;
            var dbo = db.db("super-detector");
            dbo.collection("people").findOne({ "personID": person_id }, (err, person) => {
                if (err) throw err;
                console.log('person =', person);
                res.json(person);
                db.close();
            });
        }
    );
    // res.status(404).send("Cannot find this person.");
});

app.get('/cars', (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
        (err, db) => {
            if (err) throw err;
            var dbo = db.db("super-detector");
            dbo.collection("cars").find({}).toArray((err, cars) => {
                if (err) throw err;
                res.send(cars);
                db.close();
            });
        }
    );
    // res.status(404).send("Cannot find this car.");
});

app.get('/cars/:id', (req, res) => {
    var car_id = req.params.id;
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
        (err, db) => {
            if (err) throw err;
            var dbo = db.db("super-detector");
            dbo.collection("cars").findOne({ "carID": car_id }, (err, car) => {
                if (err) throw err;
                console.log(car);
                res.json(car);
                db.close();
            });
        }
    );
    // res.status(404).send("Cannot find this car.");
});

app.get('/delete_and_re_create', (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
        (err, db) => {
            if (err) throw err;
            var dbo = db.db("super-detector");
            dbo.collection("cars").drop();
        }
    );
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
        (err, db) => {
            if (err) throw err;
            var dbo = db.db("super-detector");
            dbo.collection("people").drop();
        }
    );
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
        (err, db) => {
            if (err) throw err;
            var dbo = db.db("super-detector");
            dbo.collection('cars').insertMany(cars);
        }
    );
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
        (err, db) => {
            if (err) throw err;
            var dbo = db.db("super-detector");
            dbo.collection('people').insertMany(people);
        }
    );
    res.send('Delete and Re-create');
});

app.post('/process', (req, res) => {
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var base64 = req.body.base64Image;
    var base64Image = req.body.base64Image.replace("/^data:image\/png;base64,/", "");

    // /Em/NECTEC/Super-Detector-Backend/picture/out.png is image sent from App to process
    // fileSystem.writeFile("/Em/NECTEC/Super-Detector-Backend/picture/out.png", base64Image, 'base64', (err) => {
    //     if (err != null)
    //         console.log(err);
    // });

    res.status(200).send({ message: 'Process Successful' });
});

// app.get('/date_now', (req, res) => {
//     var date = new Date();
//     var millisecond = date.getMilliseconds();
//     var second = date.getSeconds();
//     var minute = date.getMinutes();
//     var hour = date.getHours();
//     var day = date.getDate();
//     var month = date.getMonth() + 1;
//     var year = date.getYear() + 1900;

//     var fullDate = `${day}/${month}/${year} ${hour}:${minute}:${second} ${millisecond}ms`;

//     console.log(fullDate)
//     res.send(fullDate);
// });

app.listen(serverPort, () => console.log(`Super Detector Server is listening on port ${serverPort}`));