var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var db = require('../lib/db.js');
var sanitizeHtml = require('sanitize-html');
var path = require('path');


//db.connect();

router.get('/in_sale', function(req, res){ 
    var title = 'in_sale';
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = `재배기 사용 판매 정보`;
    var html = template.HTML(sanitizedTitle, 
    `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`
    );
    res.send(html);
});

router.get('/out_sale', function(req, res){ 
    //db.query(`SELECT item_num, itme_name, item_price, item_cover FROM item`, function(error, results){
    db.query(`SELECT * FROM item`, function(error, results){        
        //console.log(results);
        
        var desc = '<ul>';
        var i = 0;
        while(i < results.length){
            desc = desc + `
            <li>
                <a href="./${results[i].item_num}"><img id="item_cover"src="../image/item/${results[i].item_num}${results[i].item_cover}"></img></a>
                <a href="./${results[i].item_num}"><p>${results[i].item_name}</p></a>
                <hr></hr>            
                <div>${results[i].item_price}</div>
            </li>`
            i = i + 1;
        }
        desc = desc + '</ul>';
        

        var title = 'out_sale';
        var sanitizedTitle = sanitizeHtml(title);   
       // var sanitizedDescription = sanitizeHtml(desc, {allowedTags:['img']});
        var html = template.HTML(sanitizedTitle, 
            `<h2>${sanitizedTitle}</h2>${desc}`
        );

        res.send(html);
    });
    
});



//전체의 경우
router.get('/:pageId', function(req, res){ 
    var filteredId = path.parse(req.params.pageId).base;
    var title = filteredId;
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = `쇼핑몰 내용 테스트`;
    var html = template.HTML(sanitizedTitle, 
    `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`
    );
    res.send(html);
});

module.exports = router;