var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var db = require('../lib/db.js');
var sanitizeHtml = require('sanitize-html');
var path = require('path');
var auth = require('../lib/auth');
var list = require('../lib/board_list');
var comment = require('../lib/comment');
var mysql = require('mysql');
var cookie = require('cookie');

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

/*
router.get('/community/create/4', function(req, res){ 
    //var filteredId = path.parse(req.params.pageId).base;
    
    var tiem = '2020-06';
    var d = 01;
    var h = 02;
    var m = 10;
    var s = 19;

    for(var i = 0;i < 20; i++)
    {
    var  title = i + " 번 댓글";
   
    var t = Math.floor(Math.random() * 60) + 1;
    var s = s + t;
    if(s > 59){
        s = s - 60;
        m++;
    }
    if(m > 59){
        m = m - 60;
        h++
    }
    if(h > 23){
        h = h-24;
        d++;
    }
    var tiem_ = tiem + "-" + d + " " + h + ":" + m + ":" + s;
    
    var  user_num = Math.floor(Math.random() * 5) + 1;
    if(user_num > 2) user_num++;
    db.db.query(`INSERT INTO comment 
    (comment_board, comment_writer, comment_time, comment_level, comment_content) 
    VALUES   (?, ?, ?, ?,?)`,
    [14, user_num, tiem_,  i, title],
    function(error){
        if(error){
            throw error;
        }
        console.log(i);
    });
    }   
});

router.get('/community/create/3', function(req, res){ 
    //var filteredId = path.parse(req.params.pageId).base;
    
    var tiem = '2020-06';
    var d = 01;
    var h = 03;
    var m = 10;
    var s = 19;

    for(var i = 0;i < 10; i++)
    {
    var  title = i + " 번 대댓글";
   
    var t = Math.floor(Math.random() * 60) + 1;
    var s = s + t;
    if(s > 59){
        s = s - 60;
        m++;
    }
    if(m > 59){
        m = m - 60;
        h++
    }
    if(h > 23){
        h = h-24;
        d++;
    }
    var tiem_ = tiem + "-" + d + " " + h + ":" + m + ":" + s;
    
    var  user_num = Math.floor(Math.random() * 5) + 1;
    if(user_num > 2) user_num++;
    db.db.query(`INSERT INTO comment 
    (comment_board, comment_writer, comment_time, comment_level, comment_content) 
    VALUES   (?, ?, ?, ?,?)`,
    [14, user_num, tiem_,  Math.floor(Math.random() * 30) + 1, title],
    function(error){
        if(error){
            throw error;
        }
        console.log(i);
    });
    }   
});



router.get('/community/:pageId/create/1', function(req, res){ 
    var filteredId = path.parse(req.params.pageId).base;
    

    for(var i = 0;i < 300; i++)
    {
      var  title = i + " 번 제목";
    var content = i+" 번 글 내용"+ i;
    var  user_num = i%3 + 1;
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

router.get('/community/:pageId/create/2', function(req, res){   //18 ~ 317까지의 board_time을 바꿀 예정 18번 수정함
    var filteredId = path.parse(req.params.pageId).base;
    
    //UPDATE `board` SET `board_time` = '2020-05-01 00:10:10' WHERE `board`.`board_num` = 18; 

    var tiem = '2020-5';
    var d = 01;
    var h = 00;
    var m = 10;
    var s = 19;

    for(var i = 21;i < 317; i++)
    {
    var t = Math.floor(Math.random() * 60) + 1;
    var s = s + t;
    if(s > 59){
        s = s - 60;
        m++;
    }
    if(m > 59){
        m = m - 60;
        h++
    }
    if(h > 23){
        h = h-24;
        d++;
    }
    var tiem_ = tiem + "-" + d + " " + h + ":" + m + ":" + s;

    //console.log(tiem_);
   
    db.db.query(`UPDATE board SET board_time = ? WHERE board.board_num = ?`,
    [tiem_, i],
    function(error){
        if(error){
            throw error;
        }
        console.log(i);
    }); 
    }   
});
*/


//
router.get('/community/:pageId/:pageId2', function(req, res){ 
    var filteredId = path.parse(req.params.pageId).base;
    var filteredId2 = path.parse(req.params.pageId2).base;
    var max;

    db.db.query(`SELECT COUNT(*) as cnt FROM board WHERE board_category = ${filteredId}`, function(err,re){
        max = re[0].cnt;
    });
    var start = 20 * filteredId2;
    
    db.db.query(`SELECT board_num,board_title,board_time,user_nickname,board_view,board_info FROM board JOIN user ON user_num = board_witer WHERE board_category = ${filteredId} ORDER BY board_time DESC Limit ${start}, 20`, function(err,results){
        //console.log(results);
        //console.log(max);
        var desc = `
        <h2>수경재배 커뮤니티</h2>
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
            
            for (var j = 0; j < leng ; j++)
            {
                var date_ = new Date(results[j].board_time * 1);
                var date = date_.getMonth() +'-' +date_.getDate();
                //console.log(date);

                var recommend = results[j].board_info ;
                if(recommend == null) recommend = 0;

                desc = desc +  
                `<tr>
                    <td>${max - (filteredId2 * 20) -  j }</td>
                    <td>${recommend}</td>
                    <td><a href="/board/community/${filteredId}/${filteredId2}/content/${results[j].board_num}">${results[j].board_title}</a></td>
                    <td>${results[j].user_nickname}</td>
                    <td>${date}</td>
                    <td>${results[j].board_view}</td>     
                </tr>`;
            }
        
        }
        desc = desc +  `     
                </tbody>
            </table>`;

        desc = desc +  `<p> `;
        if(Number(filteredId2) !== 0)  desc = desc + `<a href="./${Number(filteredId2) - 1}">◀이전  </a>`;

        
        for(var j = 0 ; j < (max / 20) ; j++)
        {
            if(Number(filteredId2) !== j)
            {
                desc = desc + `<a href="./${j}">${j+1}</a>`;
            }
            else{
                desc = desc + `<a> ${j+1} </a>`;
            }
        }
        if(Number(filteredId2) != parseInt((max / 20)))  desc = desc + `<a href="./${Number(filteredId2) + 1}">  다음▶</a>`     
        

        desc = desc +  ` </p>
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

router.get('/community/:pageId/:pageId2/content/:pageId3', async(req, res) =>{ 
    var filteredId = path.parse(req.params.pageId).base;
    var filteredId2 = path.parse(req.params.pageId2).base;
    var filteredId3 = path.parse(req.params.pageId3).base;

    const list_ = await list.boardList(req,res);
    const comment_ = await comment.commentList(req,res);
    

    db.db.query(`UPDATE board SET board_view=board_view+1 WHERE board_num = ${filteredId3} `, function(err){});

    db.db.query(`SELECT board_title, board_content,board_time,user_nickname,board_view,board_info FROM board JOIN user ON user_num = board_witer WHERE board_num = ${filteredId3} `, function(err,results)
    {
        var desc;
        desc = `
        <h1>${results[0].board_title}</h1>
        `;
        var recommend = results[0].board_info ;
        //var time = results[0].board_time*1;
        var date_ = new Date(results[0].board_time * 1);
        var date = date_.getFullYear() +'-';
        if(date_.getMonth() < 10) date = date + '0';
        date = date + date_.getMonth() +'-';
        if(date_.getDate() < 10) date = date + '0';
        date = date + date_.getDate()+' ';
        if(date_.getHours() < 10) date = date + '0';
        date = date + date_.getHours()+':';
        if(date_.getMinutes() < 10) date = date + '0';
        date = date + date_.getMinutes()+':';
        if(date_.getSeconds() < 10) date = date + '0';
        date = date + date_.getSeconds();

        if(recommend == null) recommend = 0;
        desc = desc + `<p>추천 = ${recommend}</p>
        <p>조회수 = ${results[0].board_view}</p>
        <hr>
        <p>${results[0].user_nickname}님</p>
        <p>${date}</p>
        <div id="content">${results[0].board_content}</div>
        <button onclick="recommed_plus()"><a>${recommend} 추천하기</a></button>
        <hr>
        `;

        var comment_input = `
        <h2>댓글 쓰기</h2>
        <div id="comment_in">
        <form action="${filteredId3}/create" method="post">
        <textarea name="content">
        </textarea>
        <input type="submit" value="댓글 쓰기">
        </form>
        </div>
        <hr>
        `
        // const list_ = await list.boardList(req,res);
        //console.log(list_);

        var title = '수경재배 커뮤니티';
        var sanitizedTitle = sanitizeHtml(title);   
        var html = template.HTML(sanitizedTitle, 
            `${desc}${comment_}${comment_input} ${list_}`, auth.statusUI(req, res)
        );

        res.send(html);

    });
    
});


//걍 댓글 읽어올때 쿠키에 최대 레벨 저장하자
router.post('/community/:pageId/:pageId2/content/:pageId3/create', function(req, res){ 
    var filteredId = path.parse(req.params.pageId).base;
    var filteredId2 = path.parse(req.params.pageId2).base;
    var filteredId3 = path.parse(req.params.pageId3).base;
    //console.log(req.body);
    if(!auth.isOwner(req,res))
    {
        res.redirect(`/community/${filteredId}/notlogin`);
    }
    else{
        var filteredId3 = path.parse(req.params.pageId3).base;
        
        var max;

        var sql_1 = `SELECT MAX(comment_level) AS max FROM comment WHERE comment_board=?;`;
        var sql_1_ =  mysql.format(sql_1, [filteredId3]);

        db.db.query( sql_1_, function(error, re1)
        {
            results = re1[0].max;
        
            if(results == '' ||results ==  null ||results ==  undefined ||results ==  0 || results == NaN)
            {
                var sql_2 = `INSERT INTO comment(comment_board, comment_writer, comment_content, comment_level) VALUES (?, ?, ?, ?);`;
                max = 0;
                var sql_2_ = mysql.format(sql_2, [filteredId3, req.session.user_num, req.body.content, max+1]);

        
                db.db.query( sql_2_, function(error){
            
                        if(error){
                            throw error;
                        }
                        res.writeHead(302, {Location: `/board/community/${filteredId}/${filteredId2}/content/${filteredId3}`});
                        res.end();
                    });
            } 
            else{
                var sql_2 = `INSERT INTO comment(comment_board, comment_writer, comment_content, comment_level) VALUES (?, ?, ?, ?);`;
                max = re1[0].max;
                var sql_2_ = mysql.format(sql_2, [filteredId3, req.session.user_num, req.body.content, max+1]);

        
                db.db.query( sql_2_, function(error){
            
                        if(error){
                            throw error;
                        }
                        res.writeHead(302, {'Location': `/board/community/${filteredId}/${filteredId2}/content/${filteredId3}`});
                        res.end();
                    });
            }
           
        
        });
    }
});


module.exports = router;