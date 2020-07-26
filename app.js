const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const fs = require('fs')
const ejs = require('ejs');
let setOfWords = require('./data.json')
const port = process.env.PORT || 3000

app.use(bodyparser.urlencoded({ extended: true }))

//Middleware
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));


//Shuffle Function for Vocabulary Words
let shuffle = function(element){
    let newPosition;
    let temporaryPosition;

    for (let j = element.length - 1; j > 0; j--) {
        newPosition = Math.floor(Math.random() * (j + 1));
        temporaryPosition = element[j];
        element[j] = element[newPosition];
        element[newPosition] = temporaryPosition;
    }
    return element;
}

//Shuffle array of object
let vocabulary = shuffle(setOfWords);

//Declare global variable, because during POST request, we can change its value from anywhere 
var i = 0

//@route    -   GET  /
//@desc     -   a route to home page
//@access   -   PUBLIC
app.get('/', (req, res) => {
    res.render('index')
})

//@route    -   GET  /practice
//@desc     -   a route to practice page
//@access   -   PUBLIC
app.get('/practice', (req, res) => {
    res.render('practice', {eng_vocab_prompt: vocabulary[i].eng})
})

//@route    -   POST  /practice
//@desc     -   a request to Vocabulary test field
//@access   -   PUBLIC
app.post('/practice', (req, res) => {
    //If answer by user is null
    if (req.body.user_jpn_vocab === '') {

        let j = i + 1
        res.render('practice', {vocab_result_message: `Remember! ${vocabulary[i].eng} => ${vocabulary[i].jpn}`, eng_vocab_prompt: vocabulary[j].eng})
        i++
    }
    //If user gives correct answer
    else if (req.body.user_jpn_vocab === vocabulary[i].jpn) {
        // Variable 'j' is used to display NEW WORD in question section, and 'i' is used to mention "PREVIOUS WORD" in result section
        let j = i + 1
        //If answer is 'correct'
        res.render('practice', {vocab_result_message: `Correct, ${vocabulary[i].eng} => ${vocabulary[i].jpn}`, eng_vocab_prompt: vocabulary[j].eng})
        i++
    }
    //If user gives wrong answer
    else {
        let j = i + 1
        //If answer is 'wrong'
        res.render('practice', {vocab_result_message: `Incorrect, ${vocabulary[i].eng} => ${vocabulary[i].jpn}`, eng_vocab_prompt: vocabulary[j].eng})
        i++
    }
})



app.listen(port, () => console.log('Server is Running'))