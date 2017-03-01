/**
 * Created by lenovo on 2017/2/20.
 */
var index = function () {
    var showProgress = function (show) {
        var dialog = $("#loadingToast");
        if(show){
            dialog.fadeIn(100);
        }else{
            dialog.fadeOut(100);
        }
    }
    var setPageVisiable = function (i) {
        $(".index-page").hide();
        $(".index-page").each(function (ii, e) {
             if($(this).data("myIndex") === i){
                 $(this).show();
                 return;
             }
        });
    }
    var setNavCheck = function (element) {
        $(".com-titleHeader-a").each(function (i, e) {
            $(this).removeClass("com-titleHeader-a-checked");

        });
        $(element).addClass("com-titleHeader-a-checked");
        setPageVisiable($(element).data("myIndex"));
    }
    var init = function () {
        //设置第一个页面显示，其他页面隐藏
        $(".index-page").each(function (i, e) {
            //也页面做个序号标记
            $(this).data("myIndex", i);
            if(i !== 0){
                $(this).hide();
            }
        });
         //给导航栏目添加序号，初始设置第一个栏目选中
         $(".com-titleHeader-a").each(function (i, e) {
                       if(i === 0){
                           $(this).addClass("com-titleHeader-a-checked");
                       }
                      $(this).data("myIndex", i);

         });
         //给导航栏目增加点击事件
         $(".com-titleHeader-a").on("click",function () {

                 if ($(this).is(".com-titleHeader-a-checked")) {

                     return false;
                 }
                 setNavCheck(this);

             return false;
         });


    }
    return {init:init,
        showProgress:showProgress
          };
}();