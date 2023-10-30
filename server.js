const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const { render } = require('ejs');
app.use(bodyParser.urlencoded({extended: true}));

//------Changes---------
app.set('view engine', 'ejs');
//------Changes---------
var naam = "";


const ServerKey = 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/index.html")
});

app.get('/about', (req,res)=>{
    res.sendFile(__dirname + "/about.html")
});

app.get('/doctor', (req,res)=>{
    res.sendFile(__dirname + "/doctor.html")
});

app.get('/contact', (req,res)=>{
    res.sendFile(__dirname + "/contact.html")
});
//------Changes---------
app.get('/profile', (req,res)=>{
    if(naam==="")
    res.redirect("/login")
    else
    res.render("pages/profile",naam)
});
//------Changes---------
app.get('/login', (req,res)=>{
    res.sendFile(__dirname + "/login.html")
});

app.get('/testimonial', (req,res)=>{
    res.sendFile(__dirname + "/testimonial.html")
});

app.get('/treatment', (req,res)=>{
    res.sendFile(__dirname + "/treatment.html")
});


app.post('/', (req,res)=>{
    let name = req.body.name;
    let doctor = req.body.drname;
    let specialize = req.body.special;
    let number = req.body.num;
    let date = req.body.tarikh;
    var datii ={
        "Name":name,
        "Dr":doctor,
        "Specialization":specialize,
        "Phone_Number":number,
        "Date":date
    };

    console.log(datii);

    inserTData(datii);

    res.redirect('/');
});

app.post('/login', (req,res)=>{
    let name = req.body.uname;
    let email = req.body.email;
    let pass = req.body.pass;

    if(name==undefined){
        var datii = {
            "Email":email,
            "Pass":pass
        };
        check_id(email).then(pasuu =>{
                //------Changes---------
            if(pasuu[0].Pass === pass){
 
                // naam = pasuu[0].Name
                res.render("pages/profile",{ Name: pasuu[0].Name})
                //------Changes---------
            }
            else
                res.redirect("/");
        });        
    }
    else{
    var datii = {
        "Name":name,
        "Email":email,
        "Pass":pass
    };
    console.log(datii);
    CreateID(datii);
    res.redirect('/login');
    }

    // inserTData(datii);

    
});












// MongoDB Connection

const DBname = 'Doctor_Appointment';
var CollectName;

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
        CollectName = data.Dr;
        console.log(data.Dr);
      let result = await client.connect();  //To Connect Server
      let db = result.db(DBname);   //To tell database name
      let collecter = db.collection("Doc_Id");     //To tell Collection Name

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
        let collection = db.collection("Doc_Id");
  
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