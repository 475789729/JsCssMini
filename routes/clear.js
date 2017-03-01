/**
 * Created by lenovo on 2017/2/22.
 */
var fs = require('fs');
var path = require('path');
var util = require('util');
var check = function (filename) {
      var filepath = path.resolve(__dirname, "../uploadfiles", filename);
      fs.stat(filepath, function (err, stats) {
          if(err){return err};
           try {
               var now = new Date();
                if(now.getTime() - stats.birthtime.getTime() > 1000 * 60 * 60){
                     //过期一小时
                    fs.unlink(filepath, function (err) {
                           if(err){console.log("删除失败");}
                    });
                }
           }catch (e){
              console.log(e);
           }
      });
}
module.exports = function (req, res, next) {
       var uploadfilePath = path.resolve(__dirname, "../uploadfiles");
       fs.readdir(uploadfilePath, function (err, files) {
           if(err){
               return res.end(err.message);
           }
           var i = 0;
           for(i = 0; i < files.length; i++){
               check(files[i]);
           }
           res.end("finish");
       });
};