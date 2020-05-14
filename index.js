var express = require('express')
var app = express()
var fs = require('fs');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var template = require('./lib/template.js');



app.use(express.static('img'));
app.use(express.static('css'));

var favicon = require('serve-favicon');
app.use('/img', favicon(path.join(__dirname + '/img','favicon.jpg')));

var shopRouter = require('./routes/shop');

app.get('/', function(req, res){
    var title = 'hi';
    var description = "메인화면";
    var html = template.HTML(title, description)
    res.send(html);
});

app.get('/login/:pageId', function(req, res){
    fs.readdir('./data', function(error, filelist){
        var filteredId = path.parse(req.params.pageId).base;
        fs.readFile(`./data/${filteredId}`, 'utf8', function(err, description){
          var title = req.params.pageId;
          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedDescription = sanitizeHtml(description, {
            allowedTags:['h1']
          });
          var html = template.HTML(sanitizedTitle, 
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`
          );
        res.send(html);
    });
  });
});


app.use('/shop', shopRouter);


app.listen(3001, () => console.log(`Example app listening at http://localhost:3001`))