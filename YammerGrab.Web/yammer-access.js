exports = module.exports = yammeraccess;
var fs = require('fs');
var qs = require('querystring');
var https = require('request');


function yammeraccess(options) {
    
    var secret = process.env.YAMMER_SECRET;
    var clientId = process.env.YAMMER_CLIENTID;
    

    options.routes.get('/code', function (req, res) {
        
        var authUrl = "https://www.yammer.com/oauth2/access_token.json?client_id=" + clientId + "&client_secret=" + secret + "&code=" + req.query.code;
        
        https.get(authUrl, function (err, res2, body) {
            console.log("Got response: ", body);
            
            //res.render('index', { title: JSON.parse(body).access_token.token });
            req.session.accessToken = JSON.parse(body).access_token.token;
            res.redirect(req.query.url);
        });
    
    });

    
    return function getaccesstoken(req, res, next) {
        if (req.url.indexOf('/code') > -1) {
            next();
            return; 
        }
        if (!req.session.accessToken ) {
            var query = qs.stringify({ client_id: clientId, redirect_uri: 'http://localhost:1337/code?url=' + req.url });
            res.redirect("https://www.yammer.com/dialog/oauth?" + query);
            return;
        }
        next();
    };
}