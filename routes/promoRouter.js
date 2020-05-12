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
    res.end('promo will be sent to you');
})
.post((req,res,next)=>{
    res.end('will add the promo '+req.body.name+' with details: '+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported');
})
.delete((req,res,next)=>{
    res.end('deleting all promos');
});
router.get('/:promoID',(req,res,next)=>{
    res.end('promo with id '+req.params.promoID+' will be sent to you');
});
router.post('/:promoID',(req,res,next)=>{
    res.statusCode=403;
    res.end('POST request is not supported');
});
router.put('/:promoID',(req,res,next)=>{
    res.write('Updating the dish: ' + req.params.promoID + '\n');
    res.end('Will update the dish: ' + req.body.name + 
    ' with details: ' + req.body.description)
});
router.delete('/:promoID',(req,res,next)=>{
    res.end('deleting all promos');
});
module.exports = router;