require('dotenv').config();
const express =require("express");
const path = require("path");
require("./db/conn");
const bcrypt = require("bcryptjs");
const Register = require("./models/register");
const hbs = require("hbs");
const app = express();
const port = process.env.PORT || 8000;

const staticPath = path.join(__dirname,"../public");
const templatesPath = path.join(__dirname,"../templates/views");
const partialsPath = path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(staticPath));
app.set('view engine', 'hbs');
app.set('views',templatesPath);
hbs.registerPartials(partialsPath);

console.log(process.env.SECRET_KEY);


app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/register",(req,res)=>{
    res.render("register");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/register", async (req,res)=>{
   try {
       const password = req.body.password;
       const Cpassword = req.body.confirmpassword;
       
       if(password===Cpassword){
         const registerEmployee = new Register({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            gender:req.body.gender,
            phone:req.body.phone,
            age:req.body.age,
            password:password,
            confirmpassword:Cpassword 
         });

         //password hash(conncept of middleware)

         const token = await registerEmployee.generateAuthToken();

         const craeteEmployee = await registerEmployee.save();
         res.status(201).render("index");
       
       }
       else{
          
           res.send("password does not matches");
       }
   }
   
   catch (error) {
       res.status(400).send(error)
   }
})

// login check 

app.post("/login",async(req,res)=>{
   try {
       const email = req.body.email;
       const password = req.body.password;

    const userEmail =  await Register.findOne({email:email});

    // res.send(userEmail);
    // console.log(userEmail);

    const isMatch = await bcrypt.compare(password,userEmail.password);

    const token = await userEmail.generateAuthToken();

    if(isMatch){
      res.status(201).render("index");
    }

    else{
        res.send("Invalid login details");
    }

   }
   
   catch (error) {
        res.status(400).send(error);
   }
})




// const bcrypt = require('bcryptjs');

// const securePassword = async (password) =>{
// const passwordHash = await bcrypt.hash(password,10);
// console.log(passwordHash);

// const passwordMatch = await bcrypt.compare("thapa@12",passwordHash);
// console.log(passwordMatch);
// }

// securePassword("thapa@123")


// const jwt = require("jsonwebtoken");

// const createToken = async() =>{
// const token = await jwt.sign({_id:"6162c721b63c4d0d2b015c9d"},"mynameisasitkumarmandalyoutuber",{
//     expiresIn:"2 seconds"
// });
// console.log(token);

// const userVerify = await jwt.verify(token,"mynameisasitkumarmandalyoutuber");
//  console.log(userVerify);
// }

// createToken();


app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});