var path = require('path');
var db = require('./db.js');
var cookie = require('cookie');

module.exports = {
    // setcommentlevel:function(req,res){
    //     var set;
    //     if(req[1] == 1)
    //     {
    //         set = req[0];
    //         return true;
    //     }else
    //     {
    //         return set;
    //     }
    // },
    commentList:function(request, response){
        return new Promise(resolve=>{
        
        var filteredId3 = path.parse(request.params.pageId3).base;
        var desc = '<h1>댓글</h1>';
        var set = new Array();
        db.db.query(`SELECT comment_time, comment_content, comment_level, user_nickname, comment_heart FROM comment JOIN user ON user_num = comment_writer WHERE comment_board = ${filteredId3} ORDER BY comment_level, comment_time`, function(err,results){
            //console.log(results);
            
            if(results == '' ||results ==  null ||results ==  undefined ||results ==  0 || results == NaN) 
            {
                set[0] = 0;
            }
            else
            {
                var leng = results.length;
                //console.log(leng);
                
                for (var j = 0; j < leng ; j++)
                {
                    var date_ = new Date(results[j].comment_time * 1);
                    var date = '';
                    if(date_.getMonth() < 10) date = date + '0';
                    date = date + date_.getMonth() +'-';
                    if(date_.getDate() < 10) date = date + '0';
                    date = date + date_.getDate()+' ';
                    if(date_.getHours() < 10) date = date + '0';
                    date = date + date_.getHours()+':';
                    if(date_.getMinutes() < 10) date = date + '0';
                    date = date + date_.getMinutes()+':';
                    

                    if(j != 0 && results[j].comment_level === results[j-1].comment_level)  desc = desc + `<p>▶</p>`;
                    desc = desc + `
                    <div id="comment_">
                        <p>${results[j].user_nickname}님</p>
                        <p>${date}</p>
                        <button>대댓글</button>`;
                    if(results[j].comment_heart > 0)  desc = desc + `<p>♥${results[j].comment_heart}</p>`;
                    
                    desc = desc + `
                    <p>${results[j].comment_content}</p>
                    <hr>
                    </div>`;
    
                   if(j == leng-1)
                   {
                    set[0] = results[j].comment_level;
                    //response.send(200,desc);
                   }
                }
            
            }
            

            // set[1] = 1;
            // if(this.setcommentlevel(set,response))

            //console.log(desc);
            //if(request) request(results); 
            // response.writeHead(200, {
            //             'Set-Cookie':['comment_level=${set}']
                        
            //         });
            // response.send(desc);
            // response.end();
            return desc;
            });
        
             setTimeout(() => resolve(desc), 1000);
        });
    }
} 