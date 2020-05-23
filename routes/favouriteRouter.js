const express = require('express');
const bodyparser = require('body-parser');
const Favourite = require('../models/favourite');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const router = express.Router();
router.use(bodyparser.json());

router.route('/')
.get(authenticate.verifyUser,(req,res,next)=>{
    Favourite.find({user:req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favourite)=>{
        console.log(favourite);
        res.statusCode = 200;
        res.setHeader('Contetnt-Type','application/json');
        res.json(favourite);
    },(err)=>next(err))
    .catch((err)=>{next(err)});
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Favourite.findOne({user:req.user._id})
    .then((favourite)=>{
        console.log(favourite)
        if(favourite){
            for(var i=req.body.length-1;i>=0;i--){
                console.log(favourite.dishes.includes(req.body[i]._id))
                if(favourite.dishes.includes(req.body[i]._id))
                {
                    continue;
                }
                else{
                    favourite.dishes.push(req.body[i]._id);
                }
            }
            favourite.save()
            .then((favourite)=>{
                console.log(favourite);
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(favourite);
            },(err)=>next(err))
            .catch((err)=>next(err));
        }
        else{
            Favourite.create({user:req.user._id})
            .then((favourite)=>{
                for(var i=req.body.length-1;i>=0;i--){
                    favourite.dishes.push(req.body[i]._id)
                }
                favourite.save()
                .then((favourite)=>{
                    console.log(favourite);
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favourite);
                },(err)=>next(err))
                .catch((err)=>next(err));
            },(err)=>next(err))
            .catch((err)=>next(err));
        }
    })
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Favourite.remove({user:req.user._id})
    .then((favourite)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(favourite);
    },(err)=>next(err))
    .catch((err)=>next(err));
});
router.route('/:dishID')
.get(authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Favourite.findOne({user:req.user._id})
    .then((favourite)=>{
        console.log(favourite)
        if(favourite){
            if(favourite.dishes.includes(req.params.dishID))
            {
                res.statusCode=200;
                res.setHeader('Content-Type','application/plain');
                res.end("dish already added to favourites list");
            }
            else{
                favourite.dishes.push(req.params.dishID);
                favourite.save()
                .then((favourite)=>{
                    console.log(favourite);
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favourite);
                },(err)=>next(err))
                .catch((err)=>next(err));
            }
        }
        else{
            Favourite.create({user:req.user._id})
            .then((favourite)=>{
                favourite.dishes.push(req.params.dishID)
                favourite.save()
                .then((favourite)=>{
                    console.log(favourite);
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favourite);
                },(err)=>next(err))
                .catch((err)=>next(err));
            },(err)=>next(err))
            .catch((err)=>next(err));
        }
    })
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Favourite.findOne({user:req.user._id})
    .then((favourite)=>{
        if(favourite){
            var i = favourite.dishes.indexOf(req.params.dishID);
            if(i==-1)
            {
                res.statusCode=400;
                res.setHeader('Content-Type','application/plain');
                res.end("this dish is not added to favourites");
            }
            else
            {
                favourite.dishes.splice(i,1);
                favourite.save()
                .then((favourite)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favourite);
                },(err)=>next(err))
                .catch((err)=>next(err));
            }
        }
        else{
            res.statusCode=400;
            res.setHeader('Content-Type','application/plain');
            res.end("no favourites dish associated with this user");
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports = router;