#!/usr/bin/env node

var express = require("express"),
    session = require("express-session"),
    http = require("http"),
    currUsr,
    twixer = require("./voting.js"),
    bodyParser = require("body-parser"),
    Twitter = require("twitter"),
    twitAuth = require("./twitterauth.json"),
    accountList =  require("./accounts.json").accounts,
    tweetList = require("./tweets.json").tweets,
    app = express();

http.createServer(app).listen(3000);

app.use(express.static(__dirname + "/client"));
app.use(session({secret: "qwertyuiop"}));
app.use(bodyParser());
twixer.loadAccounts(accountList);
twixer.loadTweets(tweetList);

var twitter = new Twitter(twitAuth);
var userSesh;

app.post("/login", function(req, res){
    var loginInfo = req.body;
    userSesh = req.session;
    if(twixer.validAccount(loginInfo)){
        console.log("login success!");
        userSesh.user =loginInfo.user;
        res.json({valid: true});
    } else {
        res.json({valid: false});
    }
});

app.post("/logout", function(req,res){
    req.session.destroy();
    res.send("/");
});

app.post("/user", function(req,res){
    res.send(userSesh.user);
});

app.post("/submit", function(req,res){
    var submit = req.body.tweet;
    twixer.createTweet(submit);
});

app.post("/votes", function(req,res){    
    var votes = twixer.getTweetsForAcct(userSesh.user);
    res.json(votes);    
});

app.post("/yes",function(req,res){
    var usrVote = { user: req.body.user, vote: 1, tweet: req.body.tweet };
    twixer.processVote(usrVote);
});

app.post("/no",function(req,res){
    var usrVote = { user: req.body.user, vote: 0, tweet: req.body.tweet };
    twixer.processVote(usrVote);
});

app.post("/tally", function(req,res){
    res.json(twixer.getTally());
});

app.post("/post", function(req,res){
    twitter.post('statuses/update', {status: req.body.tweet},  function(error, tweet, response){
        if(error) throw error;
    });
});

console.log("Server listening on http://localhost:3000");