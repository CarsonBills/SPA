'use strict';
$("#jquery_jplayer_1").jPlayer({
	ready: function () {
		$(this).jPlayer("setMedia", {
	  		m4v: '{{{videoSrc}}}',
	    	poster: '{{{stillImageSrc}}}'
		});
	},
	supplied: "m4v",
	size: {
		width: "auto",
		height: "auto",
	},
	useStateClassSkin: true,
	autoBlur: true,
	smoothPlayBar: true,
	keyEnabled: true,
	toggleDuration: true
});