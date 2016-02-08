var Backbone = require('backbone'),
    $ = require('jquery'),
    ModalManager = require('../modules/modal_manager'),
    CookieHelper = require('../modules/cookie_helper'),
    HeaderLoader = require('../modules/header_loader'),
    TrackManager = require('../modules/track_manager');

var HeaderConfigView = Backbone.View.extend({
    el: '#siteHeader',
    SITE: 'IIG -- ',
    MODULE: 'headerView',
    ACCOUNT: '.my-account',
    templateNR: require('../../templates/modules/NortonReaderHeaderTemplate.hbs'),
    templateIig: require('../../templates/modules/IigHeaderTemplate.hbs'),

    initialize: function() {
        'use strict';

        var that = this,
            title = this.model.get('displayTitle'),
            css = Norton.Constants.siteAssetsUrl + '/css/sites/' + Norton.siteCode + '.css';

        $('html').addClass(Norton.siteCode);
        if (title) {
            document.title = this.SITE + title;
        }

        HeaderLoader.load(css).then(function(mesg) {
            Logger.get(that.MODULE).info(mesg);
            that.render();
        }, function(err) {
            Logger.get(that.MODULE).error(err);
            that.render();
        });
    },

    render: function() {
        'use strict';
        var headerConfigTemplate,
            context = this.model.toJSON();

        context.baseUrl = Norton.baseUrl;

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
            
        }
        this.$el.append(headerConfigTemplate);
    },

    events: {
        //'click .links a': 'onLinks',
        'click .sign-in': 'onSignIn',
        'click .header-title a': 'onClickLink',
        'click .links a': 'onClickLink'
    },

    onSignIn: function (e) {
        'use strict';

        //WindowManager.openURL(Norton.Constants.loginUrl);
        window.location = Norton.Constants.loginUrl;

        return false;
    },

    onClickLink: function (e) {
        'use strict';
        var url = $(e.currentTarget).attr('href');
        TrackManager.doEvent('headerLink', url);
    },

    onLinks: function (e) {
        'use strict';

        var $target = $(e.currentTarget);
        if ($target.prop('target') === 'modal') {
            this.getCredits($target.prop('href'));
        }
        return false;
    }
}); 

module.exports = HeaderConfigView;
