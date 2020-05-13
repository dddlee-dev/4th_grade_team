var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var sanitizeHtml = require('sanitize-html');
var path = require('path');

router.get('/in_sale', function(req, res){ 
    var title = 'in_sale';
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = `재배기 사용 판매 정보`;
    var html = template.HTML(sanitizedTitle, 
    `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`, `<img src="../logo.png"></img>`
    );
    res.send(html);
});

router.get('/out_sale', function(req, res){ 
    var title = 'out_sale';
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = `재배기 미사용 판매 정보`;
    var html = template.HTML(sanitizedTitle, 
    `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`, `<img src="../logo.png"></img>`
    );
    res.send(html);
});

//전체의 경우
router.get('/:pageId', function(req, res){ 
    var filteredId = path.parse(req.params.pageId).base;
    var title = filteredId;
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = `쇼핑몰 내용 테스트`;
    var html = template.HTML(sanitizedTitle, 
    `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`, `<img src="../logo.png"></img>`
    );
    res.send(html);
});

module.exports = router;