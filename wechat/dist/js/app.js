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

(function(win,doc,app){
    
  app.extend({
     'prev':function(){
        console.log(213);
     }
  });
  console.log(app);
  

})(window,document,app);

(function(win,doc,app){
    
  app.extend({
     select:function(options){
        var opt = $.extend({
            selectId:'',
            title:'您的爱好',
            multi:false,
            data:[],
            onChange:null,
            onOpen:null,
            onClose:null
        },options);
        
        $("#"+opt.selectId).select({
              title: opt.title,
              multi: opt.multi,
              items: opt.data,
              onChange:function(d){
                opt.onChange && opt.onChange(this,d);
              },
              onOpen:function(){
                opt.onOpen && opt.onOpen();
              },
              onClose:function(d){
                opt.onClose && opt.onClose(this,d);
              },
        });
     },
     scrollSelect:function(options){  //滚动选择
         var opt = $.extend({
             scrollId:'请选择',
             title:'',
             cssClass:'',
             onChange:null,
             onClose:null,
             data:[]
         },options);
         $("#"+opt.scrollId).picker({
            title: opt.title,
            cols: opt.data,
            onChange: function(p, v,dv) {
                opt.onChange && opt.onChange(p, v, dv);
            },
            onClose: function(p, v, d) {
                opt.onClose && opt.onClose(p, v, d);
            }
         });
     },
     datetime:function(options){ //时间选择
         var opt = $.extend({
             datetimeId:'time',
             title:'选择出生年月日',
             yearSplit: '-',
             monthSplit: '-',
             times:function () {
                return null;
             },
             onChange:function(picker, values, displayValues){

             }
         },options);

         $("#"+opt.datetimeId).datetimePicker({
            title: '选择出生年月日',
            yearSplit: opt.yearSplit,
            monthSplit: opt.monthSplit,
            times: opt.times,
            onChange: function (picker, values, displayValues) {
               opt.onChange && opt.onChange(picker, values, displayValues);
            }
        });
     },
     level:function(options){
        var opt = options || [{
          url:'',
          displayValue:'',
          hiddenValue:'',
          title: "请选择省份",
          success:function(){},
          error:function(){}
        }];
        
        
        $.each(opt,function(index){
            getData(index);
        });

        function select(num,data){

            app.scrollSelect({
                scrollId:opt[num].displayValue,
                title:opt[num].title,
                data: [
                    {
                        textAlign:'center',
                        values:data.values
                    }
                ],
                onChange: function(p, v,dv) {
                   $(opt[num].displayValue).val();
                   $(opt[num].hiddenValue).val(); 
                },
                onClose: function(p, v, d) {
                   setSelect(num);
                   getData(num);
                }
            });
        }
        function setSelect(num){

           var i = ++num;
           for(;i<opt.length;i++){
              $('#'+opt[i].displayValue).val('请选择');
              $('#'+opt[i].hiddenValue).val();
           }
         
        }
        function getData(num){
          /*var testData = [
              {
                textAlign: 'center',
                values: ['男1','女1']
              },
              {
                textAlign: 'center',
                values: ['男2','女2']
              },
              {
                textAlign: 'center',
                values: ['男3','女3']
              }
          ]
          select(num,testData[num]);*/
          app.ajax({
               url:opt[num].url,
               data:opt[num].data,
               dataType:'json',
               async:false,
               success:function(data){

                  select(data,obj);
               
               },
               error:function(){

               }
           });
          
        }
     }
  });
  

})(window,document,app);

(function(win,doc,$,app){
  
  app.extend({
     preview:function(file){
          var files = file[0].files,
              f = files[0],
              $showBox = file.siblings('label'),   //显示框 label
              img = $('img',$showBox),
              reader = new FileReader();

          reader.onload = (function(theFile){
                  return function (e) {
                    var tmpSrc = e.target.result;
                    if (tmpSrc.lastIndexOf('data:base64') != -1) {
                      tmpSrc = tmpSrc.replace('data:base64', 'data:image/jpeg;base64');
                    } else if (tmpSrc.lastIndexOf('data:,') != -1) {
                      tmpSrc = tmpSrc.replace('data:,', 'data:image/jpeg;base64,');
                    }
                    //var img = '<img src="' + tmpSrc + '"/>';
                    img.attr('src',tmpSrc);  //设置路径
                    
                 };
          })(f);
          reader.readAsDataURL(f);
     },
     upload:function(options){  
         //文件上传
            var opt = $.extend({
                url:'',　　　　　　　　　                           //上传处理程序地址。　　
                fileInput:'',　　　　　                             //需要上传的文件域的ID，即<input type="file">的ID。
                srcInput:'',                                        //设置图片上传的src路径
                oldInput:null,                                        //修改失败的src路径
                allowType: ["gif", "jpeg", "jpg", "bmp", "png"],    //图片上传类型
                maxSize: 1,                                         //设置允许上传图片的最大尺寸，单位M
                secureuri:false,　　　　　　　                      //是否启用安全提交，默认为false。 
                dataType:'',　　　　　　　                          //服务器返回的数据类型。可以为xml,script,json,html。如果不填写，jQuery会自动判断。
                success:null,　　　　　　　　                       //提交成功后自动执行的处理函数，参数data就是服务器返回的数据。
                error:null,  　　　　　　　　　                     //自定义参数。这个东西比较有用，当有数据是与上传的图片相关的时候，这个东西就要用到了。
                type:'',
                data:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }, 
                
            },options);
            var that = this;
           
            var file = $('#'+opt.fileInput),         //文件
                srcInput = $('#'+opt.srcInput),      //src路径
                
                oldInput = opt.oldInput?$('#'+opt.oldInput):null;     //旧路径

                  //类型判断
           if(fileType(file, opt.allowType, opt.maxSize)){

              app.preview(file);   //调用图片显示方法

              $.ajaxFileUpload({
                  url: opt.url,
                  data:opt.data, 
                  secureuri: opt.secureuri, //一般设置为false
                  fileElementId: opt.fileInput,
                  dataType: opt.dataType, //返回值类型 一般设置为json
                  success: function (data, status, headers, config){  //服务器成功响应处理函数
                      //更新图片路径(src 和 oldSrc)
                      srcInput.val(data);
                      if(oldInput){
                        oldInput.val(data);
                      }

                      opt.success && opt.success();  //图片上传成功后的回调函数
                      $('#'+opt.fileInput).on('change',function(){
                           app.upload(opt);
                      });
                  },
                  error: function (data, status, headers, config){//服务器响应失败处理函数

                      srcInput.val(oldInput.val());    //失败后吧旧路径赋予为src路径框
                    
                      opt.error && opt.error();  //图片上传失败后的回调函数
     
                  }
              });
           }else{

           }
            //文件类型检测
           function fileType(obj, _type, _size){
                var files = obj[0].files,
                    f = files[0];

                if (!isAllowFile(f.name, _type)) {
                  alert("图片类型必须是" + _type.join("，") + "中的一种"); 
                  return false;
                }
                
                var fileSize = f.size, 
                maxSize = _size*1024*1024;
                
                if(fileSize > maxSize){
                  alert('上传图片超出允许上传大小');
                  return false;
                }

                return true;
        
           }
            //获取上传文件的后缀名
           function getFileExt(fileName){
                if (!fileName) {
                  return '';
                }    
                var _index = fileName.lastIndexOf('.');
                if (_index < 1) {
                  return '';
                }
                return fileName.substr(_index+1);
           };
            //是否是允许上传文件格式   
           function isAllowFile(fileName, allowType){
                var fileExt = getFileExt(fileName).toLowerCase();
                if (!allowType) {
                  allowType = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
                }
                if ($.inArray(fileExt, allowType) != -1) {
                  return true;
                }
                return false;
           };
           return that;
     },
     addImg:function(options){
        //新增方式
        /*
          1.通过点击按钮新增
          2.通过成功后新增一个input[type='file']框
        */
        var opt = $.extend({
           addBtn:'.add-pic',
           eventType:'touchend',
           showBox:'upload-item',

           fileInput:'file',
           srcInput:'src',
           oldSrc:'oldSrc',
           defaultImg:'../images/pic_add.png',
           

        },options);
        
        $(opt.addBtn).on(opt.eventType,function(){
           //插入新增图片
           var len = $('.upload-item'),
               fileInput = $('<input type="file" id="'+opt.fileInput+len.length+'" class="hide" name="file" />'),
               srcInput = $('<input type="hidden" id="'+opt.srcInput+len.length+'" class="hide" name="file['+len.length+']" />'),
               oldSrc = $('<input type="hidden" id="'+opt.oldSrc+len.length+'" class="hide" name="oldSrc['+len.length+']" />'),
               label = $('<label class="block" for="'+opt.fileInput+len.length+'"><img src="'+opt.defaultImg+'"></label>'),
               showBox = $('<div class="'+opt.showBox+'"></div>');

            showBox.append(fileInput).append(srcInput).append(oldSrc).append(label);  
            showBox.insertBefore($(this));
           //重新获取新增图片列表
           var fileList = $('.upload-item');
           fileList.each(function(index,elem){
              var fileId = 'file'+index,
                  srcId = 'src'+index,
                  oldSrcId = 'oldSrc'+index;
              $('#'+fileId).on('change',function(){
                  app.upload({
                       fileInput:fileId,　　　　    
                       srcInput:srcId,                
                       oldInput:oldSrcId,
                  });
              });

           });

        });
     }
  });

})(window,document,jQuery,app);
