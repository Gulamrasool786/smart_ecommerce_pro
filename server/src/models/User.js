import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Please enter your name"],
            trim:true
        },
        email:{
            type:String,
            required:[true, "Please enter your email"],
            unique:true,
            trim:true,
            lowercase:true
        },
        password:{
            type:String,
            required:[true, "Please enter your password"],
            minlength:[6, "Please enter a password with at least 6 characters"],
        },
        role:{
            type:String,
            enum:["customer", "admin"],
            default:"customer"
        },
    },
    {
        timestamps:true
    }
);


userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;