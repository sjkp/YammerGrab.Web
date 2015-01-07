var express = require('express');
var router = express.Router();
var YammerAPIClient = require('yammer-rest-api-client');

/* GET users listing. */
router.get('/', function (req, res) {
    var client = new YammerAPIClient({ token: req.session.accessToken });
    client.users.list({ limit: 200 }, function (err, data) {
        res.send(data);
    });
    
    //new YammerAPIClient()
});

module.exports = router;