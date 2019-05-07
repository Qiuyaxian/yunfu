(function(){
	//控制section高度

	window.initHeight = function() {
		var Osection = $('.j-login-section').get(0);
		var Oheight = document.documentElement.clientHeight;
		var headerH = $('.j-login-header').get(0).offsetHeight;
		var footerH = $('.j-login-footer').get(0).offsetHeight;

		var height = Oheight - headerH - footerH;
		if( Osection.offsetHeight <= height ){
			Osection.style.minHeight = height + 'px';
			if(document.querySelector('.j-login-contain')){
				var Oj_section = document.querySelector('.j-login-contain');
				Oj_section.style.minHeight = height + 'px';
			}
		}else{
			Osection.style.height = 'auto';
		}

	}

	initHeight();

})();
