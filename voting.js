

var accts = [],
    tweets = [];

//loads preset accounts from json file
function loadAccounts(acctList){
    acctList.forEach(function(acct){
        console.log("Loading account: "+acct.user);
        accts.push(acct);
    });
}

//loads preset tweets from json file
function loadTweets(tweetList){
    tweetList.forEach(function(tweet){
        console.log("Loading tweet: "+tweet);
        createTweet(tweet);
    });
}

// returns true if the login info matches an existing account
function validAccount(loginInfo){
    var user = loginInfo.user,
        pass = loginInfo.pass,
        valid = false,
        i, acct;

    for(i=0;i<=accts.length - 1;i++){
        acct = accts[i];
        if(acct.user === user && acct.pass === pass){
            valid = true;
        }
    }
    return valid;
}

//tests if the tweet has timed out, and if so deletes it
function timedOut(tweet){

}

//Creates tweet object and puts it in each users vote queue
function createTweet(text){
    var tweet = {text: text},
        tweetBallot = {text: text, ballot: []};
        accts.forEach(function(acct){
            tweetBallot.ballot.push(2);
            acct.toVote.push(tweet);
        });
    tweets.push(tweetBallot);
    console.log("Tweet submitted");
}

//returns the index of the tweet with the given text in the given array
function getIndexOfTweet(text, voteStack){
    var i,
        index = -1;
    for(i=0;i<voteStack.length;i++){
        if(voteStack[i].text === text){
            index = i;
        }
    }
    return index;
}

//returns an object containing the vote queues for the given account
function getTweetsForAcct(acctName){
    var voteQueues;
    accts.forEach(function(acct){
        if(acct.user === acctName){
            voteQueues = {toVote: acct.toVote, voted: acct.voted};
        }
    });
    return voteQueues;
}

//Processes a yes or no vote from user
function processVote(usrVote){
    var user = usrVote.user,
        vote = usrVote.vote,
        tweet = usrVote.tweet;
        usrIndex = 0;

    accts.forEach(function(acct){
        if(acct.user === user){
            acct.toVote.splice(getIndexOfTweet(tweet,acct.toVote), 1);
            tweets[getIndexOfTweet(tweet,tweets)].ballot[usrIndex]=vote;
            acct.voted.push(tweet);
        }
        usrIndex++;
    });
}

//removes the given tweet from all data stores
function purgeTweet(tweet){
    //remove the tweet from the voting pool of all accounts
    accts.forEach(function(acct){
        acct.voted.splice(getIndexOfTweet(tweet,acct.voted), 1);        
    });

    //remove the tweet from global tweet array
    tweets.splice(getIndexOfTweet(tweet,tweets), 1);

}

//returns the current tweet vote tally
function getTally(){
    var yay,
        nay,
        tally = [],
        status = "voting",
        ballotLength;
    tweets.forEach(function(tweet){
        yay=0;
        nay=0;
        ballotLength = tweet.ballot.length;
        tweet.ballot.forEach(function(vote){
            if(vote === 0){
                nay++;
            }
            if(vote === 1){
                yay++;
            }                
        });

        //Check if voting is done
        if((yay+nay) === ballotLength){
            if(yay >= (ballotLength/2 + 1)){
                console.log("'"+tweet.text+"' will be posted to twitter");
                status = "post";
            }
            else{
                console.log("'"+tweet.text+"' will be discarded");
                status = "discard";
            }
            
            //Remove tweet that has finished voting
            purgeTweet(tweet.text);
        }

        tally.push({
            text: tweet.text,
            yes: yay,
            no: nay,
            status: status
        });
    });
    return { tally: tally };
}

module.exports = {
    loadAccounts: loadAccounts,
    loadTweets: loadTweets,
    validAccount: validAccount,
    createTweet: createTweet, 
    getTweetsForAcct: getTweetsForAcct,
    processVote: processVote,
    getTally: getTally
};