/**
 * Created by lenovo on 2017/2/21.
 */
var  path = require('path');
var fs = require('fs');
var uuid = require('node-uuid');
var CleanCSS = require('clean-css');

var getOriCode = function (files) {
    var formatFilePaths = [];
    var i = 0;
    var filename = null;
    for(i = 0; i < files.length; i++){
        //防止提交的参数含有目录，防止黑客攻击
        filename = path.basename(files[i]);
        //获取绝对路径
        filename = path.resolve(__dirname, '../uploadfiles', filename);
        formatFilePaths.push(filename);
    }
    return (new CleanCSS({ compatibility: 'ie7' }).minify(formatFilePaths)).styles;
}

var downloadCode = function (code, req, res, next) {
    var baseFileName = uuid.v4() + ".css";
    var absuluteFileName = path.resolve(__dirname, '../uploadfiles', baseFileName);
    fs.writeFile(absuluteFileName, code, function(err){
        if (err){return next(err)};
        console.log('It\'s saved!');
        var result = {ok:true, filename:baseFileName};
        res.end(JSON.stringify(result));
    });
}
module.exports = function (req, res, next) {
    var uploadFiles = [];
    try {
        var files = req.body.files;
        if(typeof (files) === "string"){
            uploadFiles.push(files);
        }else{
            uploadFiles = files;
        }
        downloadCode(getOriCode(uploadFiles), req, res, next);
    }catch (e){
        console.error(e);
        next(e);
    }
};