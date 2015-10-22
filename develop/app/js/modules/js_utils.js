var Utils = {
    localStorageSupported: function() {
        "use strict";
        try {
            return "localStorage" in window && window["localStorage"] !== null;
        } catch (e) {
            return false;
        }
    },
    handleIntroPanel: function() {
        "use strict";
        Norton.showIntro = (Norton.Utils.getCookie('intro')) ? false : true;
        this.setCookie("intro", "1", 1209600, location.hostname);   // 14 day expiry - always reset with each site access
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
    }
};

module.exports = Utils;
