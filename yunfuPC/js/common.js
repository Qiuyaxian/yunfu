function addFavorite() {//收藏本站方法
    var url = window.location;
    var title = document.title;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("360se") > -1) {
        alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
    }
    else if (ua.indexOf("msie 8") > -1) {
        window.external.AddToFavoritesBar(url, title); //IE8
    }
    else if (document.all) {
  try{
    window.external.addFavorite(url, title);
  }catch(e){
    alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
  }
    }
    else if (window.sidebar) {
        window.sidebar.addPanel(title, url, "");
    }
    else {
  alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
    }
}


function inputNum(element){//控制输入正整数
   var reg = /^[0-9]*[1-9][0-9]*$/;
   var re = new RegExp(reg);
   if(!reg.test(element.value)){
        $(element).val("1");
   }
}


/*弹窗里面所用到的方法*/
$(document).on("click",".add-btn",function(){//点击增加数量
    var v1 = parseInt($(this).parent().siblings(".choose-num").val());
    var v2 = v1+1;
    var max = parseInt($(this).parent().siblings(".choose-tips").find(".rest-num").text());
    if(v2>=max){//与库存量比较
        $(this).parent().siblings(".choose-num").val(max);
    }else{
        $(this).parent().siblings(".choose-num").val(v2);
    }
});

$(document).on("click",".reduce-btn",function(){//点击减少数量
    var v1 = parseInt($(this).parent().siblings(".choose-num").val());
    var v2 = v1-1;
    var min = 1;
    if(v2<=1){//最小为1
        $(this).parent().siblings(".choose-num").val(min);
    }else{
        $(this).parent().siblings(".choose-num").val(v2);
    }
    
});

$(document).on("input",".choose-num,.shop-num",function(){//控制数量合法
    inputNum(this);
});

