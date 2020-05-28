var express = require('express')
var app = express();
var fs = require('fs');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var template = require('./lib/template.js');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var db = require('./lib/db.js');
var auth = require('./lib/auth');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('img'));
//app.use(express.static('img/item'));
app.use('/image', express.static(__dirname + '/img'));
app.use('/style', express.static(__dirname + '/css'));

var favicon = require('serve-favicon');
app.use('/img', favicon(path.join(__dirname + '/img','favicon.jpg')));

var shopRouter = require('./routes/shop');
var loginRouter = require('./routes/login');

app.use(session({
    secret: '1fsgdg34@!$DFfrf@@fsd',
    resave: false,
    saveUninitialized: true,
    store : new MySQLStore(db.db_option)

}))



app.get('/', function(req, res){
    console.log(req.session);
    var title = 'hi';
    var description = "메인화면";
    var html = template.HTML(title, description, auth.statusUI(req, res))
    res.send(html);
});

// app.get('/login/:pageId', function(req, res){
//     fs.readdir('./data', function(error, filelist){
//         var filteredId = path.parse(req.params.pageId).base;
//         fs.readFile(`./data/${filteredId}`, 'utf8', function(err, description){
//           var title = req.params.pageId;
//           var sanitizedTitle = sanitizeHtml(title);
//           var sanitizedDescription = sanitizeHtml(description, {
//             allowedTags:['h1']
//           });
//           var html = template.HTML(sanitizedTitle, 
//             `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`
//           );
//         res.send(html);
//     });
//   });
// });


app.use('/shop', shopRouter);
app.use('/login', loginRouter);


app.listen(3001, () => console.log(`Example app listening at http://localhost:3001`))