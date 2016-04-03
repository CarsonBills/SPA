
//var Mathjax = require('mathjax');
module.exports = (function() {
    var MJ = { 
        "MathML": { 
            extensions: ["mml3.js", "content-mathml.js"]
        },
        "HTML-CSS": {
            preferredFont: "STIX"
        }
    },

    config = function () {
        window.MathJax = $.extend({}, MJ);
        var script = document.createElement("script");
            script.type = "text/javascript";
            script.src  = "//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
        document.getElementsByTagName("head")[0].appendChild(script);
    };
    /*MathJax.Hub.Config({
        extensions: ["tex2jax.js"],
        jax: ["input/TeX", "output/HTML-CSS"],
        tex2jax: {
        inlineMath: [ ['$','$'], ["\\(","\\)"] ],
            displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
            processEscapes: true
        },
        "HTML-CSS": { 
            availableFonts: ["TeX"] 
        }
    });*/
    /*window.MathJax = { 
        "MathML": { 
            extensions: ["mml3.js", "content-mathml.js"]
        },
        "HTML-CSS": {
            preferredFont: "STIX"
        }
    };*/
    return {
        config: config
    }
})();