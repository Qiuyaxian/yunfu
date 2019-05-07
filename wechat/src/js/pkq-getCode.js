(function(win,doc,app){
    
  app.extend({
     getCode:function(options){
        var opt = $.extend({
            getBtn:"getCode",
            sendIn:"秒后重新发送",
            sendOut:"重新获取验证码",
            methods:"",
            time:60,
            url:"",
            type:"POST",
            data:"",
            timeout:60000,
            dataType:"json",
            async:true,
            beforeSend:function(){},
            success:function(){},
            error:function(){}
        },options);
        var that = this,
        $getBtn = $('#' + opt.getBtn);
        $getBtn.on('click',function(){
             $(this).prop('disabled',true);
             if($(this).prop('disabled')){
                _setTimeout($(this),opt);
             }else{
            
             }
        });
        //获取验证码

        var _setTimeout = function(obj,options){
            var that = this,
                i = options.time,
                timer = null;
                obj.addClass('disabled');
                obj.html(i + options.sendIn); 
                timer = setInterval(function(){
                    i--;
                    if(i == 0){
                       clearInterval(timer);
                       obj.prop('disabled',false);
                       obj.html(options.sendOut);
                       obj.removeClass('disabled');
                    }else{
                       obj.html(i + options.sendIn); 
                    }
                },1000);
                //send data
            app.ajax(options)
        }
        return this;
     }
  });
  
})(window,document,app);
