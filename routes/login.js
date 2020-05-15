var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var sanitizeHtml = require('sanitize-html');
var path = require('path');



router.get('/login', function(req, res){ 
    var title = 'login';
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = `로그인`;
    var html = template.HTML(sanitizedTitle, 
    `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`
    );
    res.send(html);
});

router.get('/sign_up', function(req, res){ 
    var title = 'sign up';
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = `회원가입`;
    var html = template.HTML(sanitizedTitle, 
    `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`
    );
    res.send(html);
});

//전체의 경우
router.get('/card', function(req, res){ 
    var title = '장바구니';
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = `장바구니`;
    var html = template.HTML(sanitizedTitle, 
    `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`
    );
    res.send(html);
});

module.exports = router;