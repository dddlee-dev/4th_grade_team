var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var db = require('../lib/db.js');
var sanitizeHtml = require('sanitize-html');
var path = require('path');
var auth = require('../lib/auth');
var mysql = require('mysql');




//외부 판매
router.get('/community/:pageId/:pageId2', function(req, res){ 
    var filteredId = path.parse(req.params.pageId).base;
    var filteredId2 = path.parse(req.params.pageId2).base;
   
    db.db.query(`SELECT board_title,board_time,user_nickname,board_view,board_info FROM board JOIN user ON user_num = board_witer WHERE board_category = ${filteredId}`, function(err,results){
        console.log(results);
        var desc = desc + `
        
        <div id = cummunity>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>추천</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                        <th>조회수</th>
                    </tr>
                </thead>
                <tbody>`;
                 
        if(results == '' ||results ==  null ||results ==  undefined ||results ==  0 || results == NaN) 
        {
            desc = desc +  
            `<tr>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
            </tr> 
            </tbody>
            </table>
        </div>`;
        }
        else
        {
            var leng = results.length;
            console.log(leng);
            if(leng > 20)
            {
        

            }
            else
            {
                for (var j = results.length - 1; j >=0 ; j--)
                {
                    var date_ = new Date(results[j].board_time * 1);
                    var date = date_.getMonth() +'-' +date_.getDate();
                    //console.log(date);

                    var recommend = results[j].board_info ;
                    if(recommend == null) recommend = 0;

                    desc = desc +  
                    `<tr>
                        <td>${j + 1}</td>
                        <td>${recommend}</td>
                        <td>${results[j].board_title}</td>
                        <td>${results[j].user_nickname}</td>
                        <td>${date}</td>
                        <td>${results[j].board_view}</td>     
                    </tr>`;
                }
            }
        }
        desc = desc +  `     
                </tbody>
            </table>
            <button><a href="../../review/${filteredId}">후기 작성하기</a></button>
        </div>`;

        var title = '수경재배 커뮤니티';
        var sanitizedTitle = sanitizeHtml(title);   
        var html = template.HTML(sanitizedTitle, 
            `${desc}`, auth.statusUI(req, res)
        );

        res.send(html);
    });

    
});

//상품 정보
router.get('/item/:pageId/:pageId2', function(req, res){ 
    var filteredId = path.parse(req.params.pageId).base;
    var filteredId2 = path.parse(req.params.pageId2).base;
    
    var filteredIdt = [filteredId];

    var sql_item = `SELECT * FROM item WHERE item_num = ?;`;
    var sql_item_s = mysql.format(sql_item, filteredIdt);
    var sql_comment = `SELECT board_title,board_time,user_nickname,board_view,board_info FROM board JOIN user ON user_num = board_witer WHERE board_category = ? ;`;
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
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                
                </tr> </tbody>
                </table>
                <button><a href="../../review/${filteredId}">후기 작성하기</a></button>
            </div>`;
            }
            else{
                //댓글 페이지
                var leng = results[1].length;
                //console.log(leng);
                if(leng > 5)
                {
                    var start = results[1].length - 1 - (5 * filteredId2);
                    var last = start - 5;
                    if (last < 0) last = 0;
                    
                    for (var j = start; j >last ; j--)
                    {
                        var star = '';
                        for(var i = 0;i < 5; i++)
                        {   
                            if(i < Number(results[1][j].board_info)) 
                            {
                                star = star + `★`;
                            }
                            else 
                            {
                                star = star + `☆`;
                            }
                        }
                        //console.log(typeof results[1][0].board_info);
                        //console.log(star);
                        //console.log(results[1].length);
    
    
                        var date_ = new Date(results[1][j].board_time * 1);
                        var date = date_.getFullYear() +'-'+date_.getMonth() +'-' +date_.getDate();
                        //console.log(date);
    
                        desc = desc +  `<tr>
                        <td>${j + 1}</td>
                        <td>${results[1][j].board_title}</td>
                        
                        <td>${results[1][j].user_nickname}</td>
                        <td>${date}</td>
                        <td>${results[1][j].board_view}</td>
                        <td>${star}</td>
                        </tr>`;

                    }
                    desc = desc +  `     
                            </tbody>
                        </table>
                        <p> `
                        if(Number(filteredId2) !== 0)  desc = desc + `<a href="../${filteredId}/${Number(filteredId2) - 1}">◀이전  </a>`

                    for(var j = 0 ; j < parseInt((Number(leng) / 5))+1 ; j++)
                    {
                        if(Number(filteredId2) !== j)
                        {
                            desc = desc + `<a href="../${filteredId}/${j}">${j+1}</a>`;
                        }
                        else{
                            desc = desc + `<a> ${j+1} </a>`;
                        }
                    }
                    if(Number(filteredId2) != parseInt((Number(leng) / 5)))  desc = desc + `<a href="../${filteredId}/${Number(filteredId2) + 1}">  다음▶</a>`
                    // console.log(Number(filteredId2));
                    // console.log((Number(leng) / 5 ));

                    desc = desc +  `</p>
                        <button><a href="../../review/${filteredId}">후기 작성하기</a></button>
                    </div>`;
                }
                else{
                //기존
                for (var j = results[1].length - 1; j >=0 ; j--)
                {
                    var star = '';
                    for(var i = 0;i < 5; i++)
                    {   
                        if(i < Number(results[1][j].board_info)) 
                        {
                            star = star + `★`;
                        }
                        else 
                        {
                            star = star + `☆`;
                        }
                    }
                    //console.log(typeof results[1][0].board_info);
                    //console.log(star);
                    //console.log(results[1].length);


                    var date_ = new Date(results[1][j].board_time * 1);
                    var date = date_.getFullYear() +'-'+date_.getMonth() +'-' +date_.getDate();
                    //console.log(date);

                    desc = desc +  `<tr>
                    <td>${j + 1}</td>
                    <td>${results[1][j].board_title}</td>
                    
                    <td>${results[1][j].user_nickname}</td>
                    <td>${date}</td>
                    <td>${results[1][j].board_view}</td>
                    <td>${star}</td>
                    </tr>`;
                }
                desc = desc +  `     
                </tbody>
            </table>
            <button><a href="">긆 작성하기</a></button>
        </div>`;
                }
            }
       


        
        var title = results[0][0].item_name;
        var sanitizedTitle = sanitizeHtml(title);   
       // var sanitizedDescription = sanitizeHtml(desc, {allowedTags:['img']});
        var html = template.HTML(sanitizedTitle, 
            `${desc}`, auth.statusUI(req, res)
        );

        res.send(html);

    });
});

router.get('/review/:pageId', function(req, res){ 
    var filteredId = path.parse(req.params.pageId).base;
    if(!auth.isOwner(req,res))
    {
        res.redirect(`notlogin`);
    }
    else{

    var star = 0;
    var desc = `
    <h2>REVIEW | 상품후기</h2>
    <hr>
    <form action="create/${filteredId}" method="post">
    <table>
        <tr>
            <td>제목</td>
            <td><input type="text" name="title"></td>
        </tr>
        <tr>
            <td>평점</td>
            <td><p>
            <input type="radio" name="star" value="1" >☆
            <input type="radio" name="star" value="2" >☆☆
            <input type="radio" name="star" value="3" checked="checked">☆☆☆
            <input type="radio" name="star" value="4" >☆☆☆☆
            <input type="radio" name="star" value="5" >☆☆☆☆☆
            </p></td>
        </tr>
    </table>
    <textarea name="content">
    </textarea>
    <input type="submit" value="등록">
    <a  href="../item/${filteredId}/0"><input type="button" value="취소"></a>
    </form>
    `

    
    var title = filteredId + "상품 후기";
    var sanitizedTitle = sanitizeHtml(title);
    var html = template.HTML(sanitizedTitle, 
    desc
    , auth.statusUI(req, res)
    );
    res.send(html);
    }
});
router.get('/review/notlogin',function(req,res){
    res.send(`<script type="text/javascript">alert("로그인이 필요합니다.");location.href='in_sale'</script>`);
});

router.post('/review/create/:pageId', function(req, res){ 
    var filteredId = path.parse(req.params.pageId).base;
    //console.log(req.body);
    
    db.db.query(`INSERT INTO board 
    (board_category, board_title, board_content, board_witer, board_info) 
    VALUES   (?, ?, ?, ?, ?)`,
    [filteredId, req.body.title, req.body.content, req.session.user_num, req.body.star],
    function(error){
        if(error){
            //throw error;
        }
        res.writeHead(302, {Location: `/shop/item/${filteredId}/0`});
        res.end();
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