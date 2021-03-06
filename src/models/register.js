const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const employSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        min:10
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens:[{
        token:{
          type:String,
          required: true
        }
    }]
})

// concept of middleware(for jwt token in registeration)
employSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id);
       const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
       this.tokens = this.tokens.concat({token:token});
      await this.save();
       return token;
    } 
    catch (error) {
        res.send("the error part" + error);
        console.log("the error part is" + error);
    }
}


// concept of middleware(to make hash of password in registeration)

employSchema.pre("save",async function(next){
    if(this.isModified("password")){

    this.password = await bcrypt.hash(this.password,10)

    this.confirmpassword =await bcrypt.hash(this.password,10);

    }
    next();
})

// we craete a collection now

const Register = new mongoose.model("Register",employSchema);
module.exports = Register;