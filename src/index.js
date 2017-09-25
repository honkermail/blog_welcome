require("./lib/fullpage/jquery.fullpage.min.css");
require("./css/base.css");

$(function(){
    $('#back').fullpage({
		continuousVertical: true, //循环滚动
		navigation : true //导航按钮(右侧的小点)
    });

    setInterval(function(){
        $.fn.fullpage.moveSectionDown();
    }, 5000);
});