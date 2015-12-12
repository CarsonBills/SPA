var Backbone = require('backbone'),
    $ = require('jquery'),
    ModalManager = require('../modules/modal_manager'),
    CookieHelper = require('../modules/cookie_helper');
    //WindowManager = require('../modules/window_manager');

var HeaderConfigView = Backbone.View.extend({
    el: '#siteHeader',
    MODULE: 'credits',
    ACCOUNT: '.my-account',
    templateNR: require('../../templates/modules/NortonReaderHeaderTemplate.hbs'),
    templateIig: require('../../templates/modules/IigHeaderTemplate.hbs'),

    initialize: function() {
        'use strict';
    },

    render: function() {
        'use strict';
        var headerConfigTemplate,
            context = this.model.toJSON();

        context.baseUrl = Norton.baseUrl;

        $('html').addClass(Norton.siteCode);

        if (Norton.siteCode === 'nortonreader') {
            headerConfigTemplate = this.templateNR(context);
        } else {
            // only /full shows the login
            if (context.baseUrl.indexOf('/full') === -1 ) {
                context.hide = 'hide';
            }
            context.user = CookieHelper.getUser('ecm2:username');
            context.signedIn = (context.user !== CookieHelper.ANON);
            headerConfigTemplate = this.templateIig(context);

            // show bg pattern
            this.$el.addClass('bg');
        }
        this.$el.append(headerConfigTemplate);
    },

    events: {
        'click .links a': 'onLinks',
        'click .sign-in': 'onSignIn'
    },

    onSignIn: function (e) {
        'use strict';

        //WindowManager.openURL(Norton.Constants.loginUrl);
        window.location = Norton.Constants.loginUrl;

        return false;
    },

    onLinks: function (e) {
        'use strict';

        var $target = $(e.currentTarget);

        return false;

    }
}); 

module.exports = HeaderConfigView;
