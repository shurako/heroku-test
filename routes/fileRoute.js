const express = require('express')
const router = express.Router()
const server = require('../server')
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const {GridFsStorage} = require('multer-gridfs-storage')
const multer = require('multer')
const crypto = require('crypto');
const path = require('path');

let gfs

const conn =  mongoose.createConnection('mongodb+srv://user1:12345@cluster0.vnpml.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')






conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads')
   })



   let storage = new GridFsStorage({
    url: 'mongodb+srv://user1:12345@cluster0.vnpml.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });


  const upload = multer({ storage })

// @route POST/ upload
 router.route('/upload').post(upload.single('file'),(req, res) => {
    res.json({file: req.file})
 })

router.route('/').get( (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if(!files || files.length === 0) {S
            
            return res.status(404).json({
                err: 'no files'
            })
        }
        return res.json(files)
    })
})

router.route('/:filename').get( async (req, res) => {
   
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        if(!file || file.length === 0){ return res.status(404).json({err: 'no such a file'})}
        return res.json(file)
    })
})

router.route('/file/image/:filename').get( (req, res) => {
   
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        if(!file || file.length === 0){ return res.status(404).json({err: 'no such a file'})}
        
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res)
    })
})

router.route('/image/:filename').get( (req, res) => {
   
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        if(!file || file.length === 0){ return res.status(404).json({err: 'no such a file'})}
        
        res.json({file: file})
    })
})

module.exports = router;