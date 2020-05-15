
module.exports = {
<<<<<<< HEAD
  HTML:function(title, body){
=======
  HTML:function(title, body, logo){
>>>>>>> main
    return `
    <!doctype html>
    <html>
    <head>
      <title>옆집텃밭 - ${title}</title>
      <meta charset="utf-8">
<<<<<<< HEAD
      <link rel="icon" type="image/x-icon" href="../favicon.jpg")>
      <link rel="stylesheet" type="text/css" href="../style.css">
=======
      <link rel="icon" type="image/x-icon" href="favicon.jpg")>
>>>>>>> main
    </head>
    <body>
      <div id="header">
        <ul>
          <li><a href="/login/login">로그인</a></li>
          <li><a href="/login/sign_up">회원가입</a></li>
          <li><a href="/login/cart">장바구니</a></li>
        </ul>
      </div>
      
      <div id="logo">
         <a href="/">
<<<<<<< HEAD
         <img id="logo2" src="../logo.png"></img>
=======
         ${logo}
>>>>>>> main
         </a>
      </div>
      
      <div id="nav">
        <ul>
          <li><a href="/shop/in_sale">플랫폼 판매</a></li>
          <li><a href="/shop/out_sale">외부 판매</a></li>
          <li><a href="/shop/hydroponics_sale">수경재배기 판매</a></li>
          <li><a href="/etc/event">이벤트</a></li>
          <li><a href="/etc/hydroponics_info">수경재배 정보안내</a></li>
          <li><a href="/board/community">수경재배 커뮤니티</a></li>
        </ul>
      </div>

      <h1><a href="/">WEB</a></h1> 

      ${body}


      <div id="footer">
        <h1>footer</h1>
      </div>
    </body>
    </html>
    `;

  }
}
//향후 favicon (탭화면에서 나오는 이미지) 설정하기