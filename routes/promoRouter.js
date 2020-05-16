const express = require('express');
const bodypraser = require('body-parser');
const Promo = require('../models/promotions');
const mongoose = require('mongoose');
const router = express.Router();
router.use(bodypraser.json());

router.route('/')
.get((req,res,next)=>{
    Promo.find({})
    .then((promos)=>{
        res.statusCode =200;
        res.setHeader('Content-Type','application/json');
        res.json(promos)
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    Promo.create(req.body)
    .then((promo)=>{
        console.log('Promo created',promo);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported');
})
.delete((req,res,next)=>{
    Promo.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});
router.route('/:promoID')
.get((req,res,next)=>{
    Promo.findById(req.params.promoID)
    .then((promo)=>{
        res.statusCode =200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('POST request is not supported');
})
.put((req,res,next)=>{
    Promo.findByIdAndUpdate(req.params.promoID,{
        $set:req.body
    },{new:true})
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete((req,res,next)=>{
    Promo.findByIdAndRemove(req.params.promoID)
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    })
});
module.exports = router;