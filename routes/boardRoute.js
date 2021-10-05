const express = require('express')
const router = express.Router()
const Board = require('../models/boardModel')


const uri = 'mongodb+srv://user1:12345@cluster0.vnpml.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'



router.route('/').post((req, res) => {
    const newBoard = new Board({
       title: req.body.title
    })

    res.json(newBoard);
    newBoard.save()

} )

router.route('/createNote/:id').patch( async (req, res) => {
    
    updatedBoard = await Board.updateOne({_id : req.params.id}, {$set : { content : req.body.content}})
    res.json(updatedBoard)
})

router.route('/createNote/:id/:noteId').patch( async (req, res) => {
    const notes = await Board.findById(req.params.id)
    
    
    updatedBoard = await Board.updateOne({_id : req.params.id}, {$set : { content : req.body.content}})
    // res.json(updatedBoard)
})

router.route('/updateTitle/:id').patch( async (req, res) => {
    
    updatedBoard = await Board.updateOne({_id : req.params.id}, {$set : {title: req.body.title}})
    res.json(updatedBoard)
})


router.route('/:id').delete( async (req, res) => {
    const removeBoard = await Board.remove({_id: req.params.id});
    console.log(req.params)
    res.json(removeBoard)
    
})

router.route('/').get((req, res) => {
    Board.find().then( found => res.json(found) )
} )

router.route('/:id').get((req, res) => {
    Board.findById(req.params.id).then( found => res.json(found) )
} )




module.exports = router;