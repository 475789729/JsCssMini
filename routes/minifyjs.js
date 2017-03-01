/**
 * Created by lenovo on 2017/2/21.
 */
var  path = require('path');
var fs = require('fs');
var uuid = require('node-uuid');
var miniCode = function (oriCode) {
    var jsp = require("uglify-js").parser;
    var pro = require("uglify-js").uglify;
    var ast = jsp.parse(oriCode); // parse code and get the initial AST
    ast = pro.ast_mangle(ast); // get a new AST with mangled names
    ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
    var final_code = pro.gen_code(ast); // compressed code her
    return final_code;
}
var downloadCode = function (code, req, res, next) {
     var baseFileName = uuid.v4() + ".js";
     var absuluteFileName = path.resolve(__dirname, '../uploadfiles', baseFileName);
    fs.writeFile(absuluteFileName, code, function(err){
        if (err){return next(err)};
        console.log('It\'s saved!');
        var result = {ok:true, filename:baseFileName};
        res.end(JSON.stringify(result));
    });
}
var getOriCode = function (files) {
    var formatFilePaths = [];
    var i = 0;
    var filename = null;
    for(i = 0; i < files.length; i++){
        //防止提交的参数含有目录，防止黑客攻击
        filename = path.basename(files[i]);
        console.log("应该传回自动生成的名字:" + filename);
        //获取绝对路径
        filename = path.resolve(__dirname, '../uploadfiles', filename);
        formatFilePaths.push(filename);
    }
    var UglifyJS = require("uglify-js");
    var resultCode = UglifyJS.minify(formatFilePaths);
    return resultCode.code;

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