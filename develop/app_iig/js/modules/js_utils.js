var Utils = {
    localStorageSupported: function() {
        "use strict";
        try {
            return "localStorage" in window && window["localStorage"] !== null;
        } catch (e) {
            return false;
        }
    },
    getCookie: function(name) {
        "use strict";
        var result = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return (result === null) ? null : result[2];
    },
    setCookie: function(name, val, exp, domain) {
        "use strict";
        var expires = new Date(new Date().getTime() + parseInt(exp) * 1000);
        document.cookie = name + "=" + val + "; expires=" + expires.toGMTString() + "; path=/; domain=." + domain;
    },
    genericError: function(err) {
        "use strict";
        NortonApp.errorPageView = new NortonApp.Views.ErrorPage();
        NortonApp.errorPageView.render();

        window.history.pushState(null,null,Norton.baseUrl);
    },

    returnToBase: function () {
        "use strict";
        window.history.pushState(null,null,Norton.baseUrl);
    },
    /**
     * buildAssetObject:
     * @param downloadAsset
     * @returns object with html code, icon for media type, filesize and URL for AWS service
     */
    buildAssetObject: function(downloadAsset) {
        'use strict';

        var data = {},
            format = downloadAsset.format,
            src = downloadAsset.src,
            size = downloadAsset.fileSize,
            url_nodes = src.split("/");

        /**
         * Amazon URL looks like https://s3.amazonaws.com/nortoniigprotectedassets/psyc/images/test.txt
         * strip off everything after bucket and build URL to cloudfront .NET service which will look like
         * //bishop:822/awsOutput.aspx?sitecode=devtest&siteversion=full&bucket=nortoniigprotectedassets&file=/psyc/images/test.txt
         */
        data.url = Norton.Constants.awsContentUrl + "sitecode=" + Norton.siteCode + "&siteversion=" + Norton.version+ "&file=";
        // Assuming 4th forward slash and beyond is the file path and name
        for (var i=4; i<url_nodes.length; i++) {
            data.url += "/" + url_nodes[i];
        }

        switch (format) {
            case "video":
                data.html = '<video src="' + data.url + '"/>';
                data.icon = "video-icon";
                break;

            case "audio":
                data.html = '<audio src="' + data.url + '"/>';
                data.icon = "audio-icon";
                break;

            default:
                data.html = "other" + ': ' + data.url;
                data.icon = "other-icon";
                break;
        }
        data.size = size;

console.log(data);
        return data;
    }
};

module.exports = Utils;
