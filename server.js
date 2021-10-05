const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Note = require('./models/noteModel')
const bodyParser = require('body-parser')
const {GridFsStorage} = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')
const crypto = require('crypto');
const path = require('path');
const multer = require('multer')
app.use(cors())
app.use(express.json())
app.use('/files', require('./routes/fileRoute'));
app.use('/notes', require('./routes/noteRoute'));
app.use('/boards', require('./routes/boardRoute'));
app.use('/dupa', require('./routes/filesRoute'));
app.use(methodOverride('_method'))


const port = process.env.PORT || 3001
const uri = 'mongodb+srv://user1:12345@cluster0.vnpml.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/app/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/app/build', 'index.html'));
  });
}

// ** MIDDLEWARE ** //
const whitelist = ['http://localhost:3001', 'http://localhost:8080', 'https://shrouded-journey-38552.heroku...']
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}
// app.use(cors(corsOptions))


mongoose.connect('mongodb+srv://user1:12345@cluster0.vnpml.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser : true}, () => {
    
} )


mongoose.connection.on('connected', () => {
    console.log('mongoose is connected')
   
})

// const conn =  mongoose.createConnection(uri)









let storage = new GridFsStorage({
  url: uri,
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







app.listen( port, () => {
    console.log('server connected')
})

module.exports = {
  
  upload:  multer({ storage }),
  conn: mongoose.createConnection(uri)
}
