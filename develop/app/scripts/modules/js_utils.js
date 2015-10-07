var Utils = {
    localStorageSupported: function() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    },
    handleIntroPanel: function() {
        Norton.showIntro = (Norton.Utils.getCookie('intro')) ? false : true;
        this.setCookie('intro', '1', 1209600, location.hostname);   // 14 day expiry - always reset with each site access
    },
    getCookie: function(name) {
        var result = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return (result === null) ? null : result[2];
    },
    setCookie: function(name, val, exp, domain) {
        var expires = new Date(new Date().getTime() + parseInt(exp) * 1000);
        document.cookie = name + '=' + val + '; expires=' + expires.toGMTString() + '; path=/; domain=.' + domain;
    },
};

module.exports = Utils;
