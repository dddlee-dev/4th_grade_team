var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var db = require('../lib/db.js');
var sanitizeHtml = require('sanitize-html');
var path = require('path');
var auth = require('../lib/auth');
var mysql = require('mysql');

//새글 작성
router.get('/community/:pageId/newboard', function(req, res){ 
    var filteredId = path.parse(req.params.pageId).base;
    //console.log(auth.isOwner(req,res));
    if(!auth.isOwner(req,res))
    {
        res.redirect(`../${filteredId}/notlogin`);
    }
    else{

    var desc = `
    <h2>글쓰기 | </h2>
    <hr>
    <form action="./create" method="post">
    
        <h3>제목</h3>
        <td><input type="text" name="title" placeholder="제목을 입력하세요."></td>
    
    <hr>
   
    <textarea name="content">
    </textarea>
    <input type="submit" value="글쓰기">
    <a  href="../${filteredId}/0"><input type="button" value="취소"></a>
    </form>
    `

    
    var title = "글쓰기";
    var sanitizedTitle = sanitizeHtml(title);
    var html = template.HTML(sanitizedTitle, 
    desc
    , auth.statusUI(req, res)
    );
    res.send(html);
    }
});
router.get('/community/:pageId/notlogin',function(req,res){
    var filteredId = path.parse(req.params.pageId).base;
    res.send(`<script type="text/javascript">alert("로그인이 필요합니다.");location.href='/board/community/${filteredId}/0'</script>`);
});

router.post('/community/:pageId/create', function(req, res){ 
    var filteredId = path.parse(req.params.pageId).base;
    console.log(req.body);
    
    db.db.query(`INSERT INTO board 
    (board_category, board_title, board_content, board_witer) 
    VALUES   (?, ?, ?, ?)`,
    [filteredId, req.body.title, req.body.content, req.session.user_num],
    function(error){
        if(error){
            throw error;
        }
        res.writeHead(302, {Location: `/board/community/${filteredId}/0`});
        res.end();
    }); 
});

router.get('/community/:pageId/create/1', function(req, res){ 
    var filteredId = path.parse(req.params.pageId).base;
    

    for(var i = 0;i < 300; i++)
    {
      var  title = i + " 번 제목";
    var content = i+" 번 글 내용"+ i;
    var  user_num = i%3;
    db.db.query(`INSERT INTO board 
    (board_category, board_title, board_content, board_witer) 
    VALUES   (?, ?, ?, ?)`,
    [filteredId, title, content, user_num],
    function(error){
        if(error){
            throw error;
        }
        console.log(i);
    }); 
    }   
});


//
router.get('/community/:pageId/:pageId2', function(req, res){ 
    var filteredId = path.parse(req.params.pageId).base;
    var filteredId2 = path.parse(req.params.pageId2).base;
    var max;

    db.db.query(`SELECT COUNT(*) as cnt FROM board WHERE board_category = ${filteredId}`, function(err,re){
        max = re[0].cnt;
    });
    var start = 20 * filteredId2;
    
    db.db.query(`SELECT board_title,board_time,user_nickname,board_view,board_info FROM board JOIN user ON user_num = board_witer WHERE board_category = ${filteredId} ORDER BY board_time DESC Limit ${start}, 20`, function(err,results){
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
            //console.log(leng);
            if(leng > 200)
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
                        <td>${max - (filteredId2 * 20) - (19 - j) }</td>
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
            <button><a href="../../community/${filteredId}/newboard">글쓰기</a></button>
        </div>`;

        var title = '수경재배 커뮤니티';
        var sanitizedTitle = sanitizeHtml(title);   
        var html = template.HTML(sanitizedTitle, 
            `${desc}`, auth.statusUI(req, res)
        );

        res.send(html);
    });

    
});


module.exports = router;