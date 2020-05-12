const express = require('express');
const bodypraser = require('body-parser');

const router = express.Router();
router.use(bodypraser.json());

router.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('dishes will be sent to you');
})
.post((req,res,next)=>{
    res.end('will add the dish '+req.body.name+' with details: '+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported');
})
.delete((req,res,next)=>{
    res.end('deleting all dishes');
});
router.get('/:dishID',(req,res,next)=>{
    res.end('dish with id '+req.params.dishID+' will be sent to you');
});
router.post('/:dishID',(req,res,next)=>{
    res.statusCode=403;
    res.end('POST request is not supported');
});
router.put('/:dishID',(req,res,next)=>{
    res.write('Updating the dish: ' + req.params.dishID + '\n');
    res.end('Will update the dish: ' + req.body.name + 
    ' with details: ' + req.body.description)
});
router.delete('/:dishID',(req,res,next)=>{
    res.end('deleting all dishes');
});
module.exports = router;