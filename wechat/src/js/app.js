(function(win,id,factory){
    "use strict"; //使用严格模式
    //进行模块化打发，封装模块
    if (typeof (module) !== 'undefined' && module.exports) {        // CommonJS
        module.exports = factory(id, win);
    } else if (typeof (define) === 'function' && define.amd ) {     // AMD
        define(function () {
            return factory(id, win);
        });
    } else {                                                        // <script>
        win[id] = factory(id, win);
    }

})(window,'app',function(id, window){
    "use strict";
    function appFn(){
         var that = this;
         that.var = {};
         if(that.init()){
            that.init();
         }
    };
    //功能封装
    //ajax        异步请求数据 $.ajax 
    //getTempl    获取模板     template7.js 
    //变量        局部变量     this.var 
    //tab切换                  $.tab
    //滚动加载                
    //弹出层    
    //表单校验 （ok）
    //图片上传 
    //扩展函数（ok）
    appFn.fn = appFn.prototype = {
        constructor:'appFn',
        extend:function(o){
            for (var i in o) {
                appFn.fn[i] = o[i];
            }
        }
    };
    appFn.fn.extend({
        init:function(){
            var that = this,
                html = document.documentElement;
                html.style.fontSize = html.getBoundingClientRect().width / 7.5 + 'px';//100px = 1rem
            that.history();
        },
        getTempl:function(options){
            //模板
            /*
               'local': false,   //是否从外部加载模板
               'templateId':'',  //模板id
               'container':'',  //输出容器,
               'data':null,     //数据来源
               'append':false   //采取
            */
            var opt = $.extend({
              'local': false,
              'url':null,
              'templateId':'',  //模板id
              'container':'',  //输出容器,
              'data':null,
              'append':false
            },options);

            if(opt.local){

               var $templateId = $('#'+opt.templateId),
                   $container = $('#'+opt.container);

                   if($templateId && $templateId.length > 0 && $container && $container.length > 0){
                      var tmpl = $templateId.html(),           
                          compiledTemplate = Template7.compile(tmpl),
                          
                          //把数据打包丢进模板
                          tempHtml = compiledTemplate(opt.data);
                          console.log(compiledTemplate,"compiledTemplate")
                          //append数据
                          opt.append?$container.append(tempHtml):$container.html(tempHtml);    
                   }

            }else{

               var $container = $('#'+opt.container);
               $.ajax({
                  url:opt.url,
                  type:'GET',
                  success:function(tmpl){
                      if(tmpl && typeof tmpl == 'string'){

                         var compiledTemplate = Template7.compile(tmpl),
                            //把数据打包丢进模板
                             tempHtml = compiledTemplate(opt.data);
                            //append数据
                             opt.append?$container.append(tempHtml):$container.html(tempHtml);
                      }
                  },
                  error:function(){

                  }
               })
            }
            return this;
        },
        ajax:function(options){
            //发送ajax请求
        
            $.ajax({
                  url:options.url || "",
                  type:options.type || "POST",
                  data:options.data || {},
                  dataType:options.dataType || "json",
                  async:options.async || true,
                  beforeSend:options.beforeSend || function(){},
                  success:options.success || function(){},
                  error:options.error || function(){},
                  complete:options.complete || function(){},
                  timeout:options.timeout || 5000,
                  cache:options.cache || false,
                  contents:options.contents || "",
                  contentType:options.contentType || "application/x-www-form-urlencoded; charset=UTF-8",
                  context:options.context || "",
                  headers:options.headers || "",
                  statusCode:options.statusCode || {},
            });
            return this;   
        },
        tab:function(options){
            //使用id作为关联
            /*
                'click':'',          //点击对象
                'active':'',         //点击选择添加的样式
                'switchTab':'',      //切换的class类
                'callback':          //回掉函数
            */
            var opt = $.extend({
                'click':'',    
                'active':'',
                'switchTab':'',
                'callback':function(){

                }
            },options);
            //点击的对象
            //添加的样式
            //关联的tab切换
            //回调函数
            //是否数据重新加载
            //
            if(opt.click && opt.click != ''){
                var clickBtn = null,
                    href = null,
                    saveData = {},
                    clickArr = $('.'+opt.click),
                    switchTab = $('.'+opt.switchTab);  
                $('.'+opt.click).on('touchend',function(){

                    clickBtn = $(this);
                    if(clickBtn.attr('data-href') && clickBtn.attr('data-href') != ''){
                       //设置头部信息
                       href = clickBtn.attr('data-href').substr(1);
                       clickArr.removeClass(opt.active);
                       clickBtn.addClass(opt.active);
                       //遍历对应的tabitem 
                       switchTab.each(function(index,elem){
                           if($(elem).attr('id') == href){
                              $(elem).removeClass('hide');
                           }else{
                              $(elem).addClass('hide');
                           }
                       });
                       //判断回调函数执行次数
                       if(!saveData[href]){
                          saveData[href] = {};
                          opt.callback();
                       }
                    }else{

                    }
                });
            }            
            return this;
        },
        history:function(id){
           var id = id || 'go-back';
           $(document).on('touchend','.'+id,function(){
               window.history.back();
           });
        }, 
        validates:function(options){
            /*
               "form":null,      //form表单
               "rules":{},       //rules校验规则
               "messages":{}     //提示信息
            */
            var opt = $.extend({
               "form":null,      
               "rules":{},      
               "messages":{},
               "submitHandler":function(form){

               },
               //"showErrors":'center'  
            },options);
            var tips = {
               center:function(errorMap,errorList){
                    var $container = $('.errorContainer');
                    if ($container.css("display") == "block") {       //判断错误提示框状态
                        var width = $container.width() / 2;
                        var height = $container.height() / 2;
                        $container.css({
                            "margin-left": -width,
                            "margin-top": -height
                        });
                        $("ul li",$container).hide();                      //隐藏所有提示信息
                        //只是显示第一条错误信息
                        $("ul li label[style='display: inline;']",$container).eq(0).parent().show();
                        //隐藏台式提示信息框
                        
                        setTimeout('$(".errorContainer").fadeOut(500)', 2000);
                    }
               },
               top:function(errorMap,errorList){
                  //效果  提示框从上往下，2s之后从下往上隐藏
                  var $container = $('.errorContainer');
                   $container.addClass('errorContainer-top');
                   if($('label',$container).length > 0){
                      var $top = $container.position().top,
                          $height = $container.height(),
                          timer = null;
                      //隐藏所有提示信息
                      $("ul li",$container).hide();                      
                        //只是显示第一条错误信息
                      $("ul li label[style='display: inline;']",$container).eq(0).parent().show();
                      if(!$container.hasClass('errorContainer-top-active')){
                          $container.addClass('errorContainer-top-active');
                          clearTimeout(timer);
                          timer = setTimeout(function(){
                             $container.removeClass('errorContainer-top-active')
                          },1000);
                      }
                      
                   }
                }
            };
            if($('.errorContainer').length <= 0){
               $('body').append('<section class="errorContainer"><ul class="t-center"></ul></section>');
            }
            opt.form.validate({
                rules: opt.rules,
                messages: opt.messages,
                onfocusout: false,                                //指定是否在获取焦点时验证
                onkeyup: false,                                   //指定是否在敲击键盘时验证
                onclick: false,                                   //指定是否在鼠标点击时验证
                focusInvalid: false,                              //提交表单后，未通过验证的表单（第一个或提交之前获得焦点的未通过验证的表单）会获得焦点
                errorContainer:".errorContainer",
                errorLabelContainer:".errorContainer ul",
                wrapper: "li",                                    //错误信息外部包裹层
                showErrors: function(errorMap, errorList) {
                    //显示错误提示信息
                    this.defaultShowErrors();
                    tips[opt.showErrors] && tips[opt.showErrors](errorMap, errorList);
                    
                },
                errorPlacement: function(error, element) {
                    //错误信息提示插入
                    error.appendTo(element.next().next());  
                },
                submitHandler: function(form) { 
                    //此处为验证完后，表单提交方式，可以设置是异步还是同步
                    opt.submitHandler(form);
                }
            });

            return this;
       }
    });  
    var app = null;
    
    if(this instanceof appFn){
         app = this;
    }else{
        return new appFn();
    }

    return app;

});
