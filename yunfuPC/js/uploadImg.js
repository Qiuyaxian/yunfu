/**
*图片上传&文件上传(默认为提交图片)
*options{
*iptid: string  文件上传input标签的id值【默认为:'doc'】;
*imgid: string  用于展示预览图片的img标签的id值【默认为:'',dom结构需要按固定格式】【tip:如果需要兼容低版本ie,img标签需要有外层容器】;
*srcid: string  提交上传文件地址的input的id值【默认为:'src'】;
*url:   string  提交文件的的接口【默认为:'/base/imageUpload'】;
*size:  number  提文件的最大限制【默认为:15】【tip:单位为M】;
*reg:   RegExp||Boole  文件后缀限制的正则表达式;【默认为：图片后缀检查正则】【tip: 不想验证后缀请设为false】;
*type:  string  文件类型文字提示【默认: '图片'】;
*data:  Object  附带参数【默认:有 true】;
*success function 成功回调方法;
*error  function 错误回调方法;
*lock:  Boole   文件上传就绪才能进行下一个上传操作【默认为：否 false】;
*change:  Boole   文件元素改变就进行上传？【默认为：否 false】;
*}
*/
window.mccms = {
    upload: function(options){
        var defaultOptions = {
            lock: false,
            iptid: "doc",
            srcid: "src",
            url: "/base/imageUpload",
            imgid: "",
            type: "图片",
            data: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            change:true,
            size: "15",
            reg: new RegExp('\\.gif$|\\.png$|\\.jpg$|\\.bmp$|\\.jpeg$','i')
        },
        opt = $.extend(defaultOptions, options),
        fileName = $("#" + opt.iptid).val(),
        iptEle = $("#" + opt.iptid),
        srcEle = $("#" + opt.srcid),
        imgEle = opt.imgid ? $("#" + opt.imgid) : iptEle.parent().find('img'),
        imgOldSrc = imgEle.length > 0 ? imgEle.attr('src') : '';
        if(window.imglock){
            layer.msg('请等待另一个' + opt.type + '上传完成', {time:1000});
            return;
        }else if(opt.size && document.getElementById(opt.iptid).files[0].size > opt.size * 1024 * 1024){
            layer.msg('不能上传超过' + opt.size + 'M的' + opt.type, {time:1000});
            return;
        }else if(opt.reg && !opt.reg.test(fileName.toLowerCase())){
            layer.msg('请确保上传文件为' + opt.type, {time:1000});
            return;
        }else{
            if(opt.lock === true){window.imglock = true;}
            if(opt.type === "图片"){
                mccms.setImagePreview(opt.iptid, opt.imgid);
            }
            imgEle.parent().show();
            iptEle.next('img').length > 0
             ? iptEle.next('img').show()
             : iptEle.after('<img class="loadFile" style="width: 100px;height: 7px" src="images/loadFile.gif" alt="正在上传">');
            $.ajaxFileUpload({
                url: /*mccms.domain[0] +*/ opt.url,
                data: opt.data,
                secureuri: false, //一般设置为false
                fileElementId: opt.iptid,
                dataType: 'json', //返回值类型 一般设置为json
                success: function (data, status, headers, config){  //服务器成功响应处理函数
                    console.log("图片上传成功");
                    iptEle.next('img').hide();
                    $(".loadFile").hide();
                    srcEle.val(data.result);
                    if(opt.change){
                        $("#" + opt.iptid).off().on('change', function(){
                            mccms.upload(opt);
                        })
                    }
                    typeof(opt.success) === "function" && opt.success(data);
                    delete window.imglock;
                },
                error: function (data, status, headers, config){//服务器响应失败处理函数
                    console.log("图片上传失败");
                    var str = data.responseText;
                    var substr = str.substring(str.indexOf("{"),str.lastIndexOf("}")+1);
                    var json = JSON.parse(substr);
                    iptEle.next('img').hide();
                    $(".loadFile").hide();
                    srcEle.val(json.result);
                    data.result && layer.msg(data.result, {time:1000});
                    if(opt.type === "图片"){
                        iptEle.parent().find('img').attr('src',json.result);
                    }
                    if(opt.change){
                        $("#" + opt.iptid).off().on('change', function(){
                            mccms.upload(opt);
                        })
                    }
                    typeof(opt.error) === "function" && opt.error(data);
                    delete window.imglock;
                }
            })
        }
    },
    /*
    *图片预览
    *inputId：input的id值,默认为：'doc';
    *imgId：img的id值;【默认为：'',dom结构需要按固定格式】
    *如果需要兼容低版本ie,需要给img标签添加外层容器
    */
    setImagePreview: function(inputId, imgid){
        var docObj = document.getElementById(inputId) || document.getElementById('doc'),  
            fileName = docObj.value;
        if(imgid !== ''){
            var imgObjPreview = document.getElementById(imgid),
                imgCotent = imgObjPreview.parentNode;
        }else{
            var imgCotent = (docObj.previousSibling.nodeType == 1) ? docObj.previousSibling : docObj.previousSibling.previousSibling,
                imgObjPreview = (imgCotent.firstChild.nodeType == 1) ? imgCotent.firstChild : imgCotent.firstChild.nextSibling;
        }
        if (docObj.files && docObj.files[0]){  
            //火狐下，直接设img属性 
            //imgObjPreview.src = docObj.files[0].getAsDataURL(); 
            imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
        } else {  
            //IE下，使用滤镜  
            docObj.select();
            docObj.blur();
            var imgSrc = document.selection.createRange().text;  
            var localImagId = imgCotent;  
            //设置初始大小  
            localImagId.style.width = docObj.currentStyle.width;  
            localImagId.style.height = docObj.currentStyle.Height;
            //图片异常的捕捉，防止用户修改后缀来伪造图片
            try {                  
                localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";  
                localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;  
            } catch (e) {  
                layer.msg("您上传的图片格式不正确，请重新选择！", {time:1000});  
                return false; 
            }  
            imgObjPreview.style.display = 'none';  
            document.selection.empty();  
        }  
        return true; 
    }
}