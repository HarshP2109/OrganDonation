const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const session = require('express-session');



app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
  }));
app.use(bodyParser.json());
const { render } = require('ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public')); 
//------Changes---------
app.set('view engine', 'ejs');
//------Changes---------
// var naam = "";


const ServerKey = 3000;

app.use(express.static('/public'));

app.get('/', (req,res)=>{
    res.render("pages/index")
});

app.get('/about', (req,res)=>{
    res.render("pages/about")
});

app.get('/doctor', (req,res)=>{
    res.render("pages/doctorprofile")
});

app.get('/contact', (req,res)=>{
    res.render("pages/contact")
});
//------Changes---------
app.get('/profile', (req,res)=>{
    let kaam = req.session.userdetails;
    if(kaam)
    res.render("pages/profile",{User:kaam});
    else
    res.redirect("/login")
});
//------Changes---------
app.get('/login', (req,res)=>{
    res.render("pages/login")
});

app.get('/testimonial', (req,res)=>{
    res.render("pages/testimonial")
});

app.get('/treatment', (req,res)=>{
    res.render("pages/treatment")
});



app.post('/login', (req,res)=>{
    let name = req.body.uname;
    let email = req.body.email;
    let pass = req.body.pass;
    let Person = req.body.userdetails;
    req.session.userdetails = Person;

    if(name==undefined){
        var datii = {
            "Email":email,
            "Pass":pass
        };
        check_id(email).then(pasuu =>{
                //------Changes---------
            console.log(pasuu);

            if (pasuu) {
                if (pasuu[0].Pass === pass) {
                    req.session.userdetails = pasuu[0].IDTYPE;
                    console.log("Is it working" + pasuu[0].Pass);
                    res.redirect('/profile');
                } else {
                    res.redirect('/login');
                }
            } else {
                res.redirect('/');
            }
        });        
    }
    else{
    var datii = {
        "Name":name,
        "Email":email,
        "Pass":pass,
        "IDTYPE":Person
    };
    console.log(datii);
    CreateID(datii);
    res.redirect('/profile');
    }

    // inserTData(datii);

    
});


app.post('/contactform',(req,res) =>{
    let name = req.body.naam;
    let email = req.body.mail;
    let number = req.body.num;
    let message = req.body.mess;

    let ContactUS = {
        'Name': name,
        'Email':email,
        'Number':number,
        'Message':message
    }
    console.log(ContactUS);

    res.redirect('/');
});










// MongoDB Connection

const DBname = 'Organ_Donation';
var CollectName = "User";

const {MongoClient} = require("mongodb");
// const { log } = require('console');

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function inserTData(data) 
{
    try{
        CollectName = data.Dr;
        console.log(data.Dr);
      let result = await client.connect();  //To Connect Server
      let db = result.db(DBname);   //To tell database name
      let collecter = db.collection(CollectName);     //To tell Collection Name

    //   const options = { ordered: true };  //It is used for avoiding duplicate items

      let response = await collecter.insertOne(data);     //Command or Query
      console.log("Values are Inserted!!");

    }
    finally{
        await client.close();
    }
}

async function CreateID(data) 
{
    try{
        // CollectName = data.Dr;
        // console.log(data.Dr);
      let result = await client.connect();  //To Connect Server
      let db = result.db(DBname);   //To tell database name
      let collecter = db.collection("User_Id");     //To tell Collection Name

    //   const options = { ordered: true };  //It is used for avoiding duplicate items

      let response = await collecter.insertOne(data);     //Command or Query
      console.log("Values are Inserted!!");

    }
    finally{
        await client.close();
    }
}

async function check_id(emuu) 
{
    try{
        let result = await client.connect();
        let db = result.db(DBname); 
        let collection = db.collection("User_Id");
  
        let response = await collection.find({"Email":emuu}).toArray();
        if(response.length)
           return response //Changes
        //   return response[0].Pass;
        else
          return 0;

    }
    finally{
        await client.close();
    }
}















app.listen(ServerKey,()=>{
    console.log("Server at port ",ServerKey," !!!");
}); 