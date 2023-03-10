const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})


userSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')){
        return next()
    }
    bcrypt.genSalt(10,(err,salt)=>{
        if(err){
            return next(err)
            console.log("one")
        }
        bcrypt.hash(user.password,salt,(err,hash)=>{
            if(err){
                return next(err)
                console.log("two")
            }
            user.password = hash
            next()
        })
    })
})


userSchema.methods.comparePassword = function (candidatePassword){
    const user = this;
    return new Promise((resolve,reject)=>{
        bcrypt.compare(candidatePassword,user.password,(err,isMatch)=>{
            if(err){
                console.log(err)
                return reject(err)
            }
            if(!isMatch){
                console.log("four")
                return reject(err)
            }
            resolve(true)
        })
    })
}

mongoose.model('User', userSchema);