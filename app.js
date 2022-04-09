// jshint esversion: 6
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})


app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/7a7d814274";
    const options = {
        method: "POST",
        auth: "akhil3:a9cfc33928a71e8b6b65a674b250cded2-us14"
    }

    const request = https.request(url, options, (response) => {
        if(response.statusCode == 200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure",(req,res)=>{
    res.redirect("/");
});

app.listen(process.env.PORT||3000, () => {
    console.log("Server is lisening on port 3000...");
});

// 9cfc33928a71e8b6b65a674b250cded2-us14
// 7a7d814274