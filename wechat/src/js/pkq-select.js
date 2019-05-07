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
