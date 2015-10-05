var Utils = {
    localStorageSupported: function() {
        try {
            return "localStorage" in window && window["localStorage"] !== null;
        } catch (e) {
            return false;
        }
    }
}

module.exports = Utils;
