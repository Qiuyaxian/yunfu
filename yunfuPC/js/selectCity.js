(function(){
	var wrap = $("#citySelect"),
	 	prov = wrap.find(".prov"),
	 	city = wrap.find(".city"),
	 	dist = wrap.find(".dist");
	$.ajax({
		url: '',
		type: 'POST',
		dataType: 'json',
		data: {
			param1: 'value1'
		},
		success:function(data){
			for (var i = Things.length - 1; i >= 0; i--) {
				Things[i]
			}
		}
	})
	$(".city").on("change",function(){
		var provId = prov.val();
		$.ajax({
			url: '',
			type: 'POST',
			dataType: 'json',
			data: {
				provId:provId
			},
			success:function(data){

			}
		})
	})
	$(".dist").on("change",function(){
		var provId = prov.val();
		$.ajax({
			url: '',
			type: 'POST',
			dataType: 'json',
			data: {
				provId:provId
			},
			success:function(data){

			}
		})
	})
})();