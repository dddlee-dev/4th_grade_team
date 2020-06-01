
module.exports = {
  HTML:function(title, body, authStatusUI=
    ` <li><a href="/login/login">로그인</a></li>
      <li><a href="/login/sign_up">회원가입</a></li>
      <li><a href="/login/login">장바구니</a></li>`)
  {
    return `
    <!doctype html>
    <html>
    <head>
      <title>옆집텃밭 - ${title}</title>
      <meta charset="utf-8">
      <link rel="icon" type="image/x-icon" href="/image/favicon.jpg")>
      <link rel="stylesheet" type="text/css" href="/style/style.css">
    </head>
    <body>
      <div id="header">
        <ul>
          <li><a href="/">홈</a></li>  
          ${authStatusUI}
         
        </ul>
      </div>
      
      <div id="logo">
         <a href="/">
         <img id="logo2" src="/image/logo.png"></img>
         </a>
      </div>
      
      <div id="nav">
        <ul>
          <li><a href="/shop/in_sale">플랫폼 판매</a></li>
          <li><a href="/shop/out_sale">외부 판매</a></li>
          <li><a href="/shop/hydroponics_sale">수경재배기 판매</a></li>
          <li><a href="/etc/event">이벤트</a></li>
          <li><a href="/etc/hydroponics_info">수경재배 정보안내</a></li>
          <li><a href="/board/community/-1/0">수경재배 커뮤니티</a></li>
        </ul>
      </div>
      <hr>

      <div id="body">
      ${body}

      </div>
      <div id="footer">
        <h1>footer</h1>
      </div>
    </body>
    </html>
    `;

  }

}

