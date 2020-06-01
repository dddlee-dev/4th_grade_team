var path = require('path');
var db = require('./db.js');

module.exports = {
    boardList:function(request, response){
        return new Promise(resolve=>{
        
        var filteredId = path.parse(request.params.pageId).base;
        var filteredId2 = path.parse(request.params.pageId2).base;
        var max;
        var desc;

        db.db.query(`SELECT COUNT(*) as cnt FROM board WHERE board_category = ${filteredId}`, function(err,re){
            max = re[0].cnt;
        });
        var start = 20 * filteredId2;
        
        db.db.query(`SELECT board_title,board_time,user_nickname,board_view,board_info FROM board JOIN user ON user_num = board_witer WHERE board_category = ${filteredId} ORDER BY board_time DESC Limit ${start}, 20`, function(err,results){
            //console.log(results);
            //console.log(max);
            desc = `
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
                        <td>${results[j].board_title}</td>
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
            //console.log(desc);
            //if(request) request(results);
            return desc;
        });
        
        setTimeout(() => resolve(desc), 1000);
    });
    }
} 