/**
 * Created by lenovo on 2017/2/22.
 */
var path = require('path');
module.exports = function (req, res, next) {
           var downloadfile = null;
           var type = req.query.type;

           if(req.query.filename){
                downloadfile = path.basename(req.query.filename);
                //获取绝对地址
                downloadfile = path.resolve(__dirname, '../uploadfiles', downloadfile);
                if(type === "js"){
                    res.download(downloadfile, "bundle.js");
                }else{
                    res.download(downloadfile, "bundle.css");
                }

           }else {
               next(new Error('没有文件名'));
           }
};