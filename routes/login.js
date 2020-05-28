var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var sanitizeHtml = require('sanitize-html');
var app = express();
var path = require('path');
var qs = require('querystring');
var db = require('../lib/db.js');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);



router.get('/login', function(req, res){ 
    var title = 'login';
    var sanitizedTitle = sanitizeHtml(title);
    //var sanitizedDescription = `로그인`;
    var desc = `
    <form action="login_process" method="post">
        <table>
            <tr>
                <td>이메일</td>
                <td>:</td>
                <td><input type="text" name="id"></td>
            </tr>
            <tr>
                <td>비번</td>
                <td>:</td>
                <td><input type="password" name="password"></td>
            </tr>
            <tr>
                <td><input type="submit" value="로그인"></td>
                <td></td>
                <td><a href="/login/sign_up"><input type="button" value="회원가입"></a></td>
            </tr>
        </table>
    </form>
    `


    var html = template.HTML(sanitizedTitle, 
    `<h2>${sanitizedTitle}</h2>${desc}`
    );
    res.send(html);
});

router.post('/login_process', function(req, res){ 

    var id = req.body.id;
    var pw = req.body.password;
    console.log(id);
   

    db.db.query(`SELECT user_num FROM user WHERE user_id=?`,
    [id],
    function(error, userid){
        if(error){
            throw error;
        }
        if(userid == '')
        {
            //console.log("아이디 없음");
            res.redirect('login_process_noid');
        }
        else
        {
            db.db.query(`SELECT user_num, user_nickname FROM user WHERE user_id=? AND user_pw=? `,
            [id, pw],
            function(error, login_res){
                if(error){
                    throw error;
                }
                if(login_res == '')//비번틀림
                {
                    res.redirect('login_process_nopw');
                }
                else
                {
                    req.session.id = id;
                    req.session.user_num = login_res[0].user_num;
                    req.session.user_nickname = login_res[0].user_nickname;
                    req.session.is_Logined = true;
                    //console.log(login_res);
                    req.session.save(function(){
                        res.writeHead(302, {Location: `/`});
                        res.end();
                    });

                }
            });

        }
        
    }
    );
    
    
});
router.get('/login_process_noid', function(req, res){ 
    res.send(`<script type="text/javascript">alert("없는 아이디입니다.");location.href='login'</script>`);
});
router.get('/login_process_nopw', function(req, res){ 
    res.send(`<script type="text/javascript">alert("잘못된 비밀번호입니다.");location.href='login'</script>`);
});
router.get('/logout', function(req, res){ 
    req.session.destroy(function(err){
        res.redirect('/');
    })
});



router.get('/sign_up', function(req, res){ 
    var title = 'sign up';
    var sanitizedTitle = sanitizeHtml(title);
    //var sanitizedDescription = `회원가입`;
    var desc = `
    <form action="sign_up_process" method="post">
        <div class="container">
        <h1>회원가입</h1>
        <p>양식에 맞춰 입력해주세요</p>
        <hr>

        <table>
            <tr>
                <td><label for="email"><b>아이디</b></label></td>
                <td><input type="text" placeholder="Enter ID" name="id" required>  <div>중복된 아이디 입니다.</div></td>
            </tr>
            <tr>
                <td><label for="psw"><b>비밀번호</b></label></td>
                <td><input type="password" placeholder="Password" name="psw" required></td>
            </tr>
            <tr>
                <td><label for="psw-repeat"><b>비밀번호 확인</b></label></td>
                <td><input type="password" placeholder="Repeat Password" name="psw-repeat" required></td>
            </tr>
            <tr>
                <td>
                   <p>이름</p>
                </td>
                <td>
                    <input type="text" name="name">
                </td>
            </tr>
            <tr>
                <td>
                  <p>닉네임</p>
                </td>
                <td>
                    <input type="text" name="nickname">
                </td>
            </tr>
            <tr>
                <td>
                  <p>주소</p>
                </td>
                <td>
                    <input type="text" name="addr">
                </td>
            </tr>
            <tr>
                <td>
                  <p>우편번호</p>
                </td>
                <td>
                    <input type="number" name="zip">
                </td>
            </tr>
            <tr>
                <td>
                  <p>전화번호</p>
                </td>
                <td>
                    <input type="tel" name="phone">
                </td>
            </tr>
            <tr>
                <td>
                  <p>재배기 등록</p>
                </td>
                <td>
                    <input type="text" name="machine">
                </td>
            </tr>
            
        </table>
        
    
        <div class="clearfix">
            
            <button type="submit" class="signupbtn">Sign Up</button>
        </div>
        </div>
    </form> 
    `
    var html = template.HTML(sanitizedTitle, 
    `${desc}`
    );
    res.send(html);
});

router.post('/sign_up_process', function(req, res){ 

    //var name = req.body.name;
    //console.log(name);
    
    var zip = req.body.zip;
    var phone = req.body.phone;
    var machine = req.body.machine;
    
    if(zip == '')zip = -1;
    if(phone == '')phone = -1;
    if(machine == '')machine = 0;
    //console.log(zip);

    db.db.query(`INSERT INTO user 
    (user_id, user_pw, user_name, user_nickname, user_addr, user_zip, user_phone, user_machine) 
    VALUES   (?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.body.id, req.body.psw, req.body.name, req.body.nickname, req.body.addr, zip, phone, machine],
    function(error){
        if(error){
            throw error;
        }
        res.writeHead(302, {Location: `/login/login`});
        res.end();
    }
    );
    
    
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