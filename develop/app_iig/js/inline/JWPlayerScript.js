'use strict';
jwplayer.key = "IAnTXUOVov4d9Q1UI0zaycdQi/g6KXCIenM3Girr/B4=";

var loadPlayer = function (captionSrc) {
	console.log(captionSrc)
	var image_src = '{{{stillImageSrc}}}',
		autoplay = '{{autoplay}}',
		defaults = {
        width: "100%",
        aspectratio: "4:3",
        //height: "100%",
        autostart: false,
		controls: true,
		primary: 'html5',
		skin: {"name": "six"},
		//skin: "skin/blue.xml",

        //set right-click about text and link location
        abouttext: "Norton Media Player, v0.1",
        aboutlink: "//www.wwnorton.com",
        logo: {
        	//position: "top-right", 
        	//margin: "10", 
            file: '//dsbst55b1909i.cloudfront.net/player/assets/norton_logo.svg',
            link: '//wwnorton.com',
            hide: false
        },
        //set sharing
        //set Google Analytics tracking
        //ga: {}
		
		events: {
			onPlay: function (event) {
			}				
		}
	},
	track = {
        file: '{{{videoSrc}}}',
		startparam: "starttime",
	}
	defaults.autostart = (autoplay === "true") ? true: false;
	if (image_src) {
		track.image = image_src;
	}
	if (captionSrc) {
		track.tracks = [{
            file: captionSrc, 
            kind: "captions", 
            label:"English",
            default: true,
            option: {
            	//withCredentials: true
            }
        }]
	}
	defaults.playlist = [track];
	jwplayer('{{playerID}}').setup(defaults);

	jwplayer('{{playerID}}').on('error', function(e) {
		if (e.message) {
			showError(e.message);
		}
	});
},

showError = function (mesg) {
	console.log(mesg);
},

getURL = function (params) {
	var res;
	$.ajax({
		type: 'GET',
		url: params.url,
        xhrFields: params.options,
        success: function (data) {
        	if ((/{([\s\S]+?)\}/).test(data)) {
        		res = JSON.parse(data);
        		if (res.code === 401) {
        			showError('Fail to load resource! ' + res.status);
        		}
        	} else {
        		params.callback(data);
        	}
        },
        error: function(xhr, textStatus) {
			if (xhr.status === 0 || xhr.readyState === 0) {
        		showError('Ajax request aborted!');
			}
        }
	});
};

$(function(){
	var captionSrc = '{{{captionSrc}}}';
	if (captionSrc !== '') {
		getURL({
			options: {
            	withCredentials: true
			},
			url : captionSrc,
			callback: loadPlayer
		});
	} else {
		loadPlayer();
	}
});