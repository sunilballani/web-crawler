const cheerio = require('cheerio')
const axios = require('axios')
const express = require('express')

const fs = require('fs');


const PORT = 8000;

const url = "http://books.toscrape.com/";
let myObj = {}, counter = 1;
const articles = [];
const app = express();
function createcrawledJSON() {
    try{
        axios(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html)
            $("a", html).each(function () {
                let value = $(this).text();
                if (myObj['links']) {
                    myObj['links'].push([value, counter]);
                } else {
                    myObj['links'] = [[value, counter]];
                }
            })

            $("button", html).each(function () {
                let value = $(this).text();
                if (myObj['buttons']) {
                    myObj['buttons'].push([value, counter]);
                } else {
                    myObj['buttons'] = [[value, counter]];
                }
            })

            $("input", html).each(function () {
                let value = $(this).text();
                if (myObj['inputs']) {
                    myObj['inputs'].push([value, counter]);
                } else {
                    myObj['inputs'] = [[value, counter]];
                }
            })

        })
    }   catch(e){
        console.log(e)
    }
    

       

    let obj = JSON.stringify(myObj);
    fs.writeFileSync('test-path-graph.json', obj);
}


app.listen(PORT, () => console.log(`server running on port ${PORT} : testing nodemon`))

app.get("/getJSON", () => {
    createcrawledJSON();
})

app.get("/instructions", () => {
    return handler()
})




function handler(req, res) {
   return res.status(200).json({ actions: [{
        type: "launch",
        url: "www.asana.com"
    }, {
        type: "click",
        text: "continue with google"
    }] })
}