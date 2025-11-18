const 

Category = require('../models/Category'),
dotenv=require('dotenv'),
fs = require('fs'),
path = require('path');

    
  // function to get a simple Category
    exports.GetSingleCategoryCtrl= async(req, res) => {
        try {
            
            console.log("Estoy en GetSingleCategoryCrtl - line 13 - req.params.id: "+req.params.id);

            const category = await Category.findById({ _id: req.params.id });
           
            console.log(category);

            res.status(200).send({ message: 'Single Category Fetched Successfully', category })
        } catch (error) {
            console.log(error); 
            res.status(500).send({ message: `get single Category api issue : ${error}`, error })
        } } // End of Get simgle Category by id

        // function to delete a Category Image from Uploads dir when Category is erased

exports.PostdeleteImageCtrl= async(req, res) => {

    const Image = req.body.image;
    const filePath = Image;

    console.log("Estoy en CategoryController - line 32 - GetDeleteImageCtrl - image: ");

    fs.unlink(filePath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log("Estoy en CategoryController - line 37 - GetDeleteImageCtrl - image: File not found ");
                return res.status(200).send({ message: 'File not found' });
            }
            
            return res.status(200).send({ message: 'Error deleting file', error: err });
        }
         console.log("Estoy en CategoryController - line 41 - GetDeleteImageCtrl - image: File deleted successfully ");
        res.status(200).json({ message: 'File deleted successfully' ,});
    });
}