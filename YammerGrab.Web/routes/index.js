var express = require('express');
var router = express.Router();
var fs = require('fs');
var YammerAPIClient = require('yammer-rest-api-client');



var messages = [];

/* GET home page. */
router.get('/', function (req, res) {    
    res.render('index', { title: 'YammerGrab.Web' });
});


router.get('/messages', function (req, res) {
    var client = new YammerAPIClient({ token: req.session.accessToken });
    client.messages.all({ limit: 1, reerse: true }, function (err, data) {
        getAllMessages(client, data.messages[0].id);
    });
});

router.get('/groups', function (req , res) {
    var client = new YammerAPIClient({ token: req.session.accessToken });
    client.groups.list({ limit: 200, reerse: true }, function (err, data) {
        res.send(data);
    });
});

//481677099
function getAllMessages(client, older_than) {
    
    client.messages.all({ limit: 20, reverse: true, older_than: older_than}, function (error, data) {
        if (error) {
            if (error.statusCode == 429) {
                console.log("Rate limiting",error.headers);
                setTimeout(function () {
                    getAllMessages(client, older_than);
                }, 30*1000);
            }
            else {
                console.log("There was an error retrieving the data");
            }
        }
        else {
            console.log("** Data was retrieved **");
            console.log(data);
            messages = messages.concat(data.messages);
            fs.writeFileSync('messages.json', JSON.stringify(messages, null, 4));
            if (data.meta.older_available) {
                
                getAllMessages(client, data.messages[data.messages.length - 1].id);
            }            
        }
    });
};

module.exports = router;