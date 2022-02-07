const { Product } = require("../models")
const multer = require('multer');
const path = require('path');
const CustomErrorHandler = require('../services/CustomErrorHandler');
const Joi = require("joi");
const fs = require("fs");
const { productSchema } = require("../validators/productValidators");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) =>{
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
       cb(null, uniqueName)
    }
});


const handleMultipartData = multer({storage, limits: {fileSize: 1000000 * 5 }}).single('image'); // 5mb


   async function store(req, res, next){
       // Multipart form data

       handleMultipartData(req, res, async (err) =>  {
           if(err){
               return next(CustomErrorHandler.serverError(error.message))
           }

       
           const filePath = req.file.path;

           // Validation
        
        const { error } = productSchema.validate(req.body);
        
        if(error){

           // Delete the upload file
           fs.unlink(`${appRoot}/${filePath}`, (err) => {
              if(err){
                return next(CustomErrorHandler.serverError(error.message));
              }
           });

            return next(error);
        }

        const {name, price, size} = req.body;

        let document;

        try {
            document = await Product.create({
                name,
                price,
                size,
                image: filePath
            });

        } catch (error) {
            return next(error);
        }
    

        res.status(201).json(document);

       });

       
   }

   function update(req, res, next){
         // Multipart form data

         handleMultipartData(req, res, async (err) =>  {
            if(err){
                return next(CustomErrorHandler.serverError(error.message))
            }

            let filePath;
            
            if(req.file){
                 filePath = req.file.path;
            }
 
        
            
 
            // Validation
         const { error } = productSchema.validate(req.body);
         
         if(error){
 
            // Delete the upload file
           if(req.file){
            fs.unlink(`${appRoot}/${filePath}`, (err) => {
                if(err){
                  return next(CustomErrorHandler.serverError(error.message));
                }
             });
           }
 
             return next(error);
         }
 
         const {name, price, size} = req.body;
 
         let document;
 
         try {
             document = await Product.findOneAndUpdate({_id: req.params.id},{
                 name,
                 price,
                 size,
                 ...(req.file && {image: filePath})
             }, {new: true});
 
         } catch (error) {
             return next(error);
         }
     
 
         res.status(200).json(document);
 
        });
 
   }

   async function destroy(req, res, next){
       const document = await Product.findOneAndRemove({_id: req.params.id});
       if(!document){
           return next(new Error('Nothing to delete'))
       }

       // Image delete
       const imagePath = document.image;
       fs.unlink(`${appRoot}/${imagePath}`, (err) => {
           if(err){
               return next(CustomErrorHandler.serverError());
           }
       });

       res.json(document);

   }

   async function index(req, res, next){
      
     
       try {

        let{page, size} = req.query;

        if(!page){
            page = 1;
        }
        if(!size){
            size = 5;
        }

        const limit = parseInt(size);
        const skip = (page -1) * size;

        
        const documents = await Product.find().limit(limit).skip(skip).select('-updatedAt -__v').sort({_id: -1});

        return res.json({
            page,
            size,
            data: documents,
 
        });
        
       } catch (error) {
           return next(CustomErrorHandler.serverError());
       }

     
   }

   async function show(req, res, next){
       
       let document;

       try {
           lset
           document = await Product.findOne({_id: req.params.id}).select('-updatedAt -__v');
       } catch (error) {
           return next(CustomErrorHandler.serverError());
       }

       return res.json(document);
   }


module.exports = {
    store,
    update,
    destroy,
    index,
    show,
};
