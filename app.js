const express = require("express");
const mailchimp = require('@mailchimp/mailchimp_marketing')
require('dotenv').config();
const PORT = 3000;


mailchimp.setConfig({
    apiKey: process.env.API_KEY_MAILCHIMP,
    server: process.env.SERVER_MAILCHIMP
})

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {
    
    res.sendFile(__dirname + "/signup.html");

})

app.post('/', async (req, res) => {

    let firstName = req.body.firstname;
    let lastName = req.body.lastname;
    let email = req.body.email;

    const listId = process.env.LIST_ID;

    try {

        const response = await mailchimp.lists.addListMember(listId, {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        })

        console.log(response.id);

        res.sendFile(__dirname + "/sucess.html");

    } catch (e) {

        console.log(e);

        res.sendFile(__dirname + "/failure.html");
        
    }
    
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})