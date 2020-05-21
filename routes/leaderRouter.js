const express = require('express')
const bodypraser = require('body-parser')
const Leader = require('../models/leaders');
const router = express.Router();
const cors = require('./cors');
var authenticate = require('../authenticate');
router.use(bodypraser.json());
router.route('/')
.options(cors.corsWithOptions, (req,res) => {res.statusCode = 200;})
.get(cors.cors,(req,res,next)=>{
    Leader.find({})
    .then((leaders)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders)
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Leader.create(req.body)
    .then((leader)=>{
        console.log('leader created',leader);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Leader.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp)
    },(err)=>next(err))
    .catch((err)=>next(err))
});
router.route('/:leaderID')
.options(cors.corsWithOptions, (req,res) => {res.statusCode = 200;})
.get(cors.cors,(req,res,next)=>{
    Leader.findById(req.params.leaderID)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader)
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('POST request is not supported');
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Leader.findByIdAndUpdate(req.params.leaderID,{
        $set:req.body
    },{new:true})
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader)
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Leader.findByIdAndRemove(req.params.leaderID)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader)
    },(err)=>next(err))
    .catch((err)=>next(err));
});
module.exports = router;