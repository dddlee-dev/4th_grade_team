var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var db = require('../lib/db.js');
var sanitizeHtml = require('sanitize-html');
var path = require('path');
var auth = require('../lib/auth');
var mysql = require('mysql');


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

    var filteredIdt = [filteredId];

    var sql_item = `SELECT * FROM item WHERE item_num = ?;`;
    var sql_item_s = mysql.format(sql_item, filteredIdt);
    var sql_comment = `SELECT board_title,board_time,user_nickname,board_view,board_info FROM board JOIN user ON user_num = board_witer WHERE board_num = ? ;`;
    var sql_comment_s = mysql.format(sql_comment, filteredIdt);

    //db.db.query(`SELECT * FROM board WHERE board_category=?`, [filteredId], function(res_board){ 
    db.db.query(sql_item_s + sql_comment_s, function(error, results){        
        //console.log(results[1]);
        
        var desc = `
        <img id="item_cover"src="/image/item/${results[0][0].item_cover}"></img>
        <ul>
            <li>
                
                <p>${results[0][0].item_name}</p>
                <hr></hr>  
                <table> 
                    <tr><th>판매가 : </th><td>${results[0][0].item_price}</td></tr>
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
        var string = results[0][0].item_info
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
        <div id = item_review>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                        <th>조회</th>
                        <th>평점</th>
                    </tr>
                </thead>
                <tbody>`;
              

        
            
            if(results[1] == '' ||results[1] ==  null ||results[1] ==  undefined ||results[1] ==  0 || results[1] == NaN) 
            {
                desc = desc +  `<tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                
                </tr>`;
            }
            else{
                var star = '';
                for(var i = 0;i < 5; i++)
                {   
                    if(i < Number(results[1][0].board_info)) 
                    {
                        star = star + `★`;
                    }
                    else 
                    {
                        star = star + `☆`;
                    }
                }
                //console.log(typeof results[1][0].board_info);
                console.log(star);

                desc = desc +  `<tr>
                <td>1</td>
                <td>${results[1][0].board_title}</td>
                <td>${results[1][0].board_time}</td>
                <td>${results[1][0].user_nickname}</td>
                <td>${results[1][0].board_view}</td>
                <td>${star}</td>
                </tr>`;
            }
       
        desc = desc +  `     
                </tbody>
            </table>        
        </div>`;


        
        var title = results[0][0].item_name;
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