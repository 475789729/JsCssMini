/**
 * Created by lenovo on 2017/2/22.
 */
module.exports = function (req, res, next) {
    if(global.guestNum){
        res.end(global.guestNum + "");
    }else{
        res.end("error");
    }
};