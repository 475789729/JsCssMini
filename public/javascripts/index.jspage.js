/**
 * Created by lenovo on 2017/2/20.
 */
var index_js_page = function () {
    var url = "/upload";
    var endurl = "/minifyjs";
    var downurl = "/download";
    var files = [];
    var newLineFileHtml = '<p class="index-file-item">' +
         '                  <span class="index-file-item-filename"></span>' +
        '                  <span class="index-file-item-status-loading"></span>' +
        '<a class="index-file-item-delete btn btn-red" style="display: none">删除</a> ' +
        '</p>';
    var upload = function () {
        $.ajax(url, {
            files: $("#upload_js"),
            iframe: true,
            dataType: 'json'
        }).done(function(data, textStatus, jqXHR) {
            // 这里data是JavaScript对象
            console.log('done():', data.ok + "," + data.filename);
            if(data.ok){
                files.push(data.filename);
                 setEndBtn(true);
                 console.log("set yes use");
                 newFileLineStatusEnd();
            }else{
                $("#upload_js").val("");
                setEndBtn(true);
                if(files.length === 0){
                    $("#js-upload-complete").hide();
                }
                $("#jsPage .index-file-item-status-loading").parent().remove();
                alert("上传失败,文件不能大于1mb");
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log('fail():' + jqXHR.status + "," + textStatus);
            alert("上传失败,或许网络原因，或许文件大于1mb");
        }).always(function() {
            console.log('always():');
        });
    }
    var checkFieType = function (fileName) {
        if(fileName){
            if(fileName.indexOf('.js') !== -1){
                console.log("后缀:" + fileName.substring(fileName.length - 3));
                if(fileName.substring(fileName.length - 3) === ".js"){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }
    }
    var init = function () {
          $("#upload_js").on("change", function () {
                 var fileName = $(this).val();
                 if(!checkFieType(fileName)){
                     $(this).val("");
                     return alert("需要选择js后缀名的文件");
                 }
                 if(fileName){
                     upload();
                     newFileLine(splitFileName(fileName));
                     console.log("--newFileLine()");
                     setEndBtn(false);
                     console.log("set no use");
                 }else{
                     console.info(false);
                 }
          });
        $("#js-upload-complete").on("click", function () {
                   if($(this).data("canUpload")){
                       if($(this).data("isLoading")){
                           return;
                       }
                       setIsLoading(true);
                      minifyCode();
                   }else{
                       alert("必须全部上传完毕才能点击");
                   }
        });
    }
    var splitFileName = function (fileName) {
        var arr = fileName.split("\\");
        var result = arr[arr.length - 1];
        arr = result.split("/");
        result = arr[arr.length - 1];
        return result;
    }
    var newFileLine = function (filename) {
        var newF = $(newLineFileHtml);
        newF.data("filename", filename);
         var newFileName = newF.find(".index-file-item-filename");
         var newFileStatus = newF.find(".index-file-item-status-loading");
         var deleteBtn = newF.find(".index-file-item-delete");
         deleteBtn.on("click", function () {
            var fileIndex = $("#jsPage .index-file-item").index(newF);
            console.log("您删除了第" + fileIndex + "个元素");
            newF.remove();
            deleteFileArrayByIndex(fileIndex);
        });
          newFileName.text(filename);
          newFileStatus.text("正在上传");
          newF.insertBefore($("#js-upload-complete").parent());
          console.log("insert:" + filename);
    }
    var newFileLineStatusEnd = function () {
         $(".index-file-item-status-loading", $("#jsPage")).removeClass("index-file-item-status-loading").addClass("index-file-item-status-end").text("上传完毕");
         $(".index-file-item-delete", $("#jsPage")).show();
    }
    var setEndBtn = function (use) {
        var endBtn = $("#js-upload-complete");
        endBtn.show();
        if(use){
            endBtn.data("canUpload", true);
        }else{
            endBtn.data("canUpload", false);
        }
    }
    var deleteFileArrayByIndex = function (i) {
        files.splice(i, 1);
        $("#upload_js").val("");
        if(files.length === 0){
            $("#js-upload-complete").hide();
        }
    }
    var setIsLoading = function (is) {
        if(is){
            index.showProgress(true);
            $("#js-upload-complete").data("isLoading",true);
        }else{
            index.showProgress(false);
            $("#js-upload-complete").data("isLoading",false);
        }
    }
    var minifyCode = function () {
        console.log(JSON.stringify(files));
        $.ajax(endurl, {
              data:{files:files},
               type:"POST",
            traditional:true,
               dataType:'json'
        }).done(function(data, textStatus, jqXHR) {
            // 这里data是JavaScript对象
            console.log('done():', data.ok);
            //setIsLoading(false);
            if(data.ok){
               console.log("压缩的响应:ok");
               window.location.href = (downurl + "?type=js&filename=" + data.filename);
               console.log("window open");
            }else{
                console.log("压缩的响应:false");
                alert("出错了");
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log('fail():' + jqXHR.status + "," + textStatus);
            //setIsLoading(false);
             alert("出错了");
        }).always(function() {
            console.log('always():');
            setIsLoading(false);
        });
    }
    return {init:init};
}();