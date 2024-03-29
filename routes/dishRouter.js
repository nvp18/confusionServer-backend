const express = require('express');
const bodypraser = require('body-parser');
const Dishes = require('../models/dishes');
const mongoose = require('mongoose');
var authenticate = require('../authenticate'); 
const router = express.Router();
router.use(bodypraser.json());
const cors = require('./cors');

router.route('/')
.options(cors.corsWithOptions, (req,res) => {res.statusCode = 200;})
.get(cors.cors,(req,res,next)=>{
    Dishes.find({})
    .populate('comments.author')
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.create(req.body)
    .then((dish)=>{
        console.log("dish created",dish);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});
router.route('/:dishID')
.options(cors.corsWithOptions, (req,res) => {res.statusCode = 200;})
.get(cors.cors,(req,res,next)=>{
    Dishes.findById(req.params.dishID)
    .populate('comments.author')
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('POST request is not supported');
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishID,{
        $set:req.body
    },{new:true})
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishID)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});
router.route('/:dishID/comments')
.options(cors.corsWithOptions, (req,res) => {res.statusCode = 200;})
.get(cors.cors,(req,res,next)=>{
    Dishes.findById(req.params.dishID)
    .populate('comments.author')
    .then((dish)=>{
        if(dish !=null)
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments);
        }
        else{
            err = new Error("dish "+req.params.dishID+" not found");
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishID)
    .then((dish)=>{
        if(dish !=null)
        {
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
                })
            },(err)=>next(err));
        }
        else{
            err = new Error("dish "+req.body.dishID+" not found");
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /dishes/'
    + req.params.dishID + '/comments');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.findById(req.params.dishID)
    .then((dish)=>{
        if(dish !=null)
        {
            for(var i = dish.comments.length -1;i>=0;i--)
            {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },(err)=>next(err));
        }
        else{
            err = new Error("dish "+req.body.dishID+" not found");
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});
router.route('/:dishID/comments/:commentID')
.options(cors.corsWithOptions, (req,res) => {res.statusCode = 200;})
.get(cors.cors,(req,res,next)=>{
    Dishes.findById(req.params.dishID)
    .populate('comments.author')
    .then((dish)=>{
        if(dish !=null && dish.comments.id(req.params.commentID)!=null)
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments.id(req.params.commentID));
        }
        else if(dish == null){
            err = new Error("dish "+req.body.dishID+" not found");
            err.status = 404;
            return next(err);
        }
        else{
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err); 
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
    + '/comments/' + req.params.commentId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishID)
    .then((dish)=>{
        if(dish !=null && dish.comments.id(req.params.commentID)!=null)
        {
            var y=(req.user._id).equals((dish.comments.id(req.params.commentID).author._id));
            console.log(y);
            if(y){
                console.log('dfhjdfs');
                if(req.body.rating){
                    dish.comments.id(req.params.commentID).rating = req.body.rating;
                }
                if(req.body.comment){
                    dish.comments.id(req.params.commentID).comment = req.body.comment;
                }
                dish.save()
                .then((dish)=>{
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(dish);
                    })
                },(err)=>next(err));
            }
            else{
                var err = new Error("your are not authenticated");
                err.status=403;
                return next(err);
            }
        }
        else if(dish == null){
            err = new Error("dish "+req.body.dishID+" not found");
            err.status = 404;
            return next(err);
        }
        else{
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err); 
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishID)
    .then((dish)=>{
        if(dish !=null && dish.comments.id(req.params.commentID)!=null)
        {
            var x=(req.user._id).equals((dish.comments.id(req.params.commentID).author._id));
            console.log(x);
            if(x){
                dish.comments.id(req.params.commentID).remove()
                dish.save()
                .then((dish)=>{
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(dish);
                    })
                },(err)=>next(err));
            }
            else{
                var err = new Error("you are not authorized");
                err.status = 403;
                return next(err);
            }
        }
        else if(dish == null){
            err = new Error("dish "+req.body.dishID+" not found");
            err.status = 404;
            return next(err);
        }
        else{
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err); 
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});
module.exports = router;