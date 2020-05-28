module.exports = {
    isOwner:function(request, response) {
        if (request.session.is_Logined) {
            return true;
        } else {
            return false;
        }
    },
    statusUI:function(request, response) {
        var authStatusUI = 
        ` <li><a href="/login/login">로그인</a></li>
        <li><a href="/login/sign_up">회원가입</a></li>
        <li><a href="/login/login">장바구니</a></li>`;
        if (this.isOwner(request, response)) {
            authStatusUI = `
            <li><a href="/login/userinfo">${request.session.user_nickname}님</a></li>
            <li><a href="/login/logout">logout</a></li>
            <li><a href="/login/cart">장바구니</a></li>`;
        }
        return authStatusUI;
    }
} 