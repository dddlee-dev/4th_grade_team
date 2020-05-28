var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var db = require('../lib/db.js');
var sanitizeHtml = require('sanitize-html');
var path = require('path');
var auth = require('../lib/auth');


//내부 판매
router.get('/in_sale', function(req, res){ 
    var title = 'in_sale';
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = `재배기 사용 판매 정보`;
    var html = template.HTML(sanitizedTitle, 
    `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`, auth.statusUI(req, res)
    );
    res.send(html);
});

//외부 판매
router.get('/out_sale', function(req, res){ 
    //db.query(`SELECT item_num, itme_name, item_price, item_cover FROM item`, function(error, results){
    db.db.query(`SELECT * FROM item`, function(error, results){        
        //console.log(results);
        
        var desc = '<ul>';
        var i = 0;
        while(i < results.length){
            desc = desc + `
            <li>
                <a href="./item/${results[i].item_num}"><img id="item_cover"src="../image/item/${results[i].item_cover}"></img></a>
                <a href="./item/${results[i].item_num}"><p>${results[i].item_name}</p></a>
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
            `<h2>${sanitizedTitle}</h2>${desc}`, auth.statusUI(req, res)
        );

        res.send(html);
    });
    
});

//상품 정보
router.get('/item/:pageId', function(req, res){ 
    var filteredId = path.parse(req.params.pageId).base;
    
    db.db.query(`SELECT * FROM item WHERE item_num = ${filteredId}`, function(error, results){        
        //console.log(results);
        
        var desc = `
        <img id="item_cover"src="/image/item/${results[0].item_cover}"></img>
        <ul>
            <li>
                
                <p>${results[0].item_name}</p>
                <hr></hr>  
                <table> 
                    <tr><th>판매가 : </th><td>${results[0].item_price}</td></tr>
                    <tr><th></th><td></td></tr>
                    <tr><th>원산지 : </th><td>국내산</td></tr>
                    <tr><th>판매단위</th><td>1개</td></tr>
                    <tr><th></th><td></td></tr>
                    <tr><th>옵션 : </th><td><select><option>a</option></select></td></tr>
                </table>  

                <div>선택한 옵션이 나오는 항목</div>
                <p > 총 금액 : </p>
            </li>
        </ul>
        <button>구매하기</button><button>장바구니</button>
        <hr>
        <button>상품상세정보</button><button>상품후기</button>
        <div id = item_info>
        `
        var string = results[0].item_info
        var slice = string.split(';');
        //console.log(slice);
        var i = 0;
        while(i < slice.length){
            desc = desc + `<img src='/image/item/${slice[i]}'> </img>`
            i = i + 1;
        }

        desc = desc + `
        </div>
        <img src='/image/item/delivery.jpg'> </img>
        <hr>
        <button>상품상세정보</button><button>상품후기</button>
        <div id = item_review></div>

        `;
        
        var title = results[0].item_name;
        var sanitizedTitle = sanitizeHtml(title);   
       // var sanitizedDescription = sanitizeHtml(desc, {allowedTags:['img']});
        var html = template.HTML(sanitizedTitle, 
            `${desc}`, auth.statusUI(req, res)
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
    , auth.statusUI(req, res)
    );
    res.send(html);
});

module.exports = router;