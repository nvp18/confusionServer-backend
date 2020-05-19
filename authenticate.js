var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var Jwtstrategy = require('passport-jwt').Strategy;
var Extractjwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config');
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
    return jwt.sign(user,config.secretkey,{expiresIn:3600});
};

var opts={}
opts.jwtFromRequest = Extractjwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretkey;

exports.jwtpassport = passport.use(new Jwtstrategy(opts,
    (jwt_payload,done)=>{
        User.findOne({_id:jwt_payload._id},(err,user)=>{
            if(err){
                return done(err,false);
            }
            else if(user){
                return done(null,user);
            }
            else{
                return done(null,false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt',{session:false});

exports.verifyAdmin = function(req,res,next){
    if(req.user.admin){
        next();
    }
    else{
        var err = new Error('you are not authenticated');
        err.status = 403;
        next(err);
    }
};