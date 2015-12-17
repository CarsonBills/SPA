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
    }
};

module.exports = Utils;
