var Preview = {
    delay: 150,        // delay after keystroke before updating

    timeout: null,     // store setTimout id
    mjRunning: false,  // true when MathJax is processing
    mjPending: false,  // true when a typeset has been queued
    container: null,

    update: function () {
        if (this.timeout) {clearTimeout(this.timeout)}
        this.timeout = setTimeout(this.callback,this.delay);
    },
    createPreview: function () {
        if (this.mjPending) return;
        if (this.mjRunning) {
            this.mjPending = true;
            MathJax.Hub.Queue(["createPreview",this]);
        } else {
            var content = document.getElementById(this.container).innerHTML;
            this.mjRunning = true;
            MathJax.Hub.Queue(
                ["Typeset", MathJax.Hub, content],
                ["previewDone", this]
            );
        }
    },
    previewDone: function () {
        this.mjRunning = this.mjPending = false;
    }
};
module.exports = function(container) {
    var initialize = function () {
        Preview.container = container;
        Preview.callback = MathJax.Callback(["createPreview", Preview]);
        Preview.callback.autoReset = true;  // make sure it can run more than once
    },

    render = function () {
        Preview.createPreview();
    };

    initialize();

    return {
        render: render
    }
};