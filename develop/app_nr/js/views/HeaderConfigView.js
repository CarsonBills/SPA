var Backbone = require('backbone'),
    $ = require('jquery'),
    ModalManager = require('../modules/modal_manager');

var HeaderConfigView = Backbone.View.extend({
    el: '#siteHeader',
    MODULE: 'credits',
    templateNR: require('../../templates/NortonReaderHeaderTemplate.hbs'),
    templateIig: require('../../templates/IigHeaderTemplate.hbs'),
    templateCredits: require('../../templates/HeaderCreditsTemplate.hbs'),
    initialize: function() {
        'use strict';
    },
    render: function() {
        'use strict';
        var img = this.model.get('headerImage'),
            headerConfigTemplate;

        if (Norton.siteCode === 'nortonreader') {
            headerConfigTemplate = this.templateNR(this.model.toJSON());
        } else {
            headerConfigTemplate = this.templateIig(this.model.toJSON());
        }
        this.$el.append(headerConfigTemplate);

        // insert background image url (full/short are different)
        if (img) {
            this.$('.header-bg').css('background', 'url("' + img + '") top/cover no-repeat');
        }
    },

    events: {
        'click .links a': 'onLinks'
    },

    showCredits: function (credits) {
        'use strict';
        var $div = $('<div></div>');

        $div.html(this.templateCredits(credits));

        ModalManager.show({
            content: $div,
            module: this.MODULE
        });
    },

    getCredits: function (url) {
        'use strict';

        var that = this;

        $.ajax({
            url: url,
            dataType: "json",
            success: function(response) {
                that.showCredits(response);
            },
            error: function(xhr, response, error) {
                console.debug('Credits Page not available.');
                ErrorsManager.showGeneric();
            }
        });

    },

    onLinks: function (e) {
        'use strict';

        var $target = $(e.currentTarget);
        if ($target.prop('target') === 'modal') {

            this.getCredits($target.prop('href'));

            return false;
        }

    }
}); 

module.exports = HeaderConfigView;
