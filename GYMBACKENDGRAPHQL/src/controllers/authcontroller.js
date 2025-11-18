const
User = require('../models/User'),
jwt= require('jsonwebtoken'),
bcrypt = require("bcryptjs");

exports.login = async(req, res) => {
    
    console.log('Estoy en authController - line 6 - login controller - query: '+req.body)
    
    const email = req.body.email;
    const password = req.body.password;

    console.log("Estoy en authcontroller - login - line 11, email: "+email);
    console.log("Estoy en authcontroller - login - line 12, password: "+password);
    
    const user = await User.findOne({ email })

    if (!user) {
      
        console.log ("Estoy en authcontroller - login - line 18 - not user");
        return res.status(200).json({ message: "User does not exists" })

        //return res.status(409).json({ message: "User does not exists" })
      
    }
   // the compare function needs the await command to work ..
    const isMatchedPassword = await bcrypt.compare(req.body.password, user.password);

        if (!isMatchedPassword) {

            return res.status(200).send({ message: 'Invalid Credentials!, Incorrect Password ..' });
        }
    
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETKEY, { expiresIn: "1d" })


      console.log("Estoy en authController - login - line 110 - user: " +user);   
        //return res.status(200).json({ user: user, token: token, message: 'Login Successful' })
         return res.status(200).json({
                               status: "success",
                               message: "Successfully Login ....",
                               user, token })
}


exports.getAllAdmin = async(req, res) => {

    console.log ("Estoy en authcontroller - getAllAdmin - line 46 - ");

    let haveAdmin = await User.find({ isAdmin: 'true' });
        try {

        /***If there is data in database ***/    
        if (haveAdmin.length>0){
                
           const haveAdmintrue = 'true';
           console.log ("Estoy en authcontroller - getAllAdmin - line 55 - haveAdmin: haveAdmin found, data in database:"+haveAdmintrue);

            return res.status(200).json({haveAdmin: haveAdmintrue , message:' Have Admin its true .. !'})}
                
        /*if (haveAdmin==null) {

            console.log ("Estoy en authcontroller - getAllAdmin - line 113 - haveAdmin: NULL - empty database.");
                res.status(500).send({message: 'Empty Database !'})
            }*/        
         else { 
            const haveAdminfalse = 'false';
            console.log('Register api issue, IsAdmin not found .. !, maybe Not Data in Database. haveAdmin:'+haveAdmin);
            return res.status(200).json({ message: 'Register api issue, IsAdmin not found .. !, maybe Not Data in Database.', haveAdmin:haveAdminfalse });
}}catch (error) {
    console.log(error);
    res.status(200).send({ message: `Register api issue : ${error.message}`.bgRed.black, error })

} 

}       