/**
 * Created by lenovo on 2017/2/21.
 */
var multiparty = require('multiparty');
var path = require('path');
var util = require('util');
var maxFileSize = 1 * 1024 * 1024;
var maxFieldSize = 1024 * 100;
module.exports = function (req, res, next) {
    var form = new multiparty.Form({autoFiles:true, maxFilesSize:maxFileSize, maxFieldsSize: maxFieldSize, maxFields:4});
    form.uploadDir = path.resolve(__dirname, '../uploadfiles');
    form.parse(req, function(err, fields, file) {
           if(err){return next(err);}
    });
    form.on('file', function(name, file) {
        var result = {ok:true};
        result.filename = path.basename(file.path);
        console.log("自动获得的名字:" + result.filename);
         console.log(JSON.stringify(result));
         res.end(JSON.stringify(result));
    });

    form.on('error', function(err) {
        return next(err);
    });
};