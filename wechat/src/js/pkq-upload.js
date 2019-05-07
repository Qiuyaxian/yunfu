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
