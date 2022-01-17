const express = require('express');
const app = new express();

/*This tells the server to use the client 
folder for all static resources*/
app.use(express.static('client'));

/*This tells the server to allow cross origin references*/
const cors_app = require('cors');
app.use(cors_app());

/*Uncomment the following lines to loan the environment 
variables that you set up in the .env file*/

const dotenv = require('dotenv');
dotenv.config();

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

function getNLUInstance() {
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key
        }),
        serviceUrl: api_url
    });
    return naturalLanguageUnderstanding;
}


//The default endpoint for the webserver
app.get("/", (req, res) => {
    res.render('index.html');
});

//The endpoint for the webserver ending with /url/emotion
app.get("/url/emotion", (req, res) => {
    //Extract the url passed from the client through the request object
    let urlToAnalyze = req.query.url
    const analyzeParams =
    {
        "url": urlToAnalyze,
        "features": {
            "keywords": {
                "emotion": true,
                "limit": 1
            }
        }
    }

    const naturalLanguageUnderstanding = getNLUInstance();

    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            //Please refer to the image to see the order of retrieval
            return res.send(analysisResults.result.keywords[0].emotion, null, 2);
        })
        .catch(err => {
            return res.send("Could not do desired operation " + err);
        });
});

//The endpoint for the webserver ending with /url/sentiment
app.get("/url/sentiment", (req, res) => {
    let sentimentanalyze = req.query.url
    const analyzeParams = {
        "url":sentimentanalyze,
        "features":{
            "keywords":{
                "sentiment":true,
                "limit":1
            }
        }
    }

    const naturalLanguageUnderstanding = getNLUInstance()

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(sentimentRes =>{
        return res.send(sentimentRes.result.keywords[0].sentiment,null,2)
    })
    .catch(err => {
        return res.send("Could not analyze sentiment "+err)
    })
});

//The endpoint for the webserver ending with /text/emotion
app.get("/text/emotion", (req, res) => {
    let emotionanalyze = req.query.text
    const analyzeParams = {
        "text":emotionanalyze,
        "features":{
            "keywords":{
                "emotion":true,
                "limit":1
            }
        }
    }

    const naturalLanguageUnderstanding = getNLUInstance()

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(emotionRes =>{
        return res.send(emotionRes.result.keywords[0].emotion,null,2)
    })
    .catch(err => {
        return res.send("Could not analyze text emotion "+err)
    })
});

app.get("/text/sentiment", (req, res) => {
    let textsentiment = req.query.text
    const analyzeParams = {
        "text":textsentiment,
        "features":{
            "keywords":{
                "sentiment":true,
                "limit":1
            }
        }
    }

    const naturalLanguageUnderstanding = getNLUInstance()

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(textSentimentRes =>{
        return res.send(textSentimentRes.result.keywords[0].sentiment,null,2)
    })
    .catch(err => {
        return res.send("Could not analyze text sentiment "+err)
    })
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

