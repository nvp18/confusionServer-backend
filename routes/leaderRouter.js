const express = require('express')
const bodypraser = require('body-parser')
const router = express.Router();
router.use(bodypraser.json());
router.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('leader details will be sent to you');
})
.post((req,res,next)=>{
    res.end('will add the leader '+req.body.name+' with details: '+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported');
})
.delete((req,res,next)=>{
    res.end('deleting all leaders');
});
router.get('/:leaderID',(req,res,next)=>{
    res.end('leader with id '+req.params.leaderID+' will be sent to you');
});
router.post('/:leaderID',(req,res,next)=>{
    res.statusCode=403;
    res.end('POST request is not supported');
});
router.put('/:leaderID',(req,res,next)=>{
    res.write('Updating the leader: ' + req.params.leaderID);
    res.end('Will update the leader: ' + req.body.name + 
    ' with details: ' + req.body.description)
});
router.delete('/:leaderID',(req,res,next)=>{
    res.end('deleting all leaders');
});
module.exports = router;