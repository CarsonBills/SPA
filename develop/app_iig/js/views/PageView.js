/**
 * PageView is the detail view of an article. It is instantiated in AppView.showDetailPage() and the model is populated in the same method.
 *
 * Its template is shown in a Bootstrap Modal
 *
 * @type {exports|module.exports}
 */
var Backbone = require('backbone'),
    $ = require('jquery'),
    jPlayer = require('jplayer'),
    ModalManager = require('../modules/modal_manager'),
    ErrorsManager = require('../modules/errors_manager'),
    VideoPlayer = require('../modules/video_player');

var PageView = Backbone.View.extend({
    MODULE: 'details',
    PLUS: 'glyphicon-heart',
    MINUS: 'glyphicon-heart-empty',
    PLAYER: '.jp-video',
    template: require('../../templates/PageTemplate.hbs'),
    templateLoading: require("../../templates/PageLoadingTemplate.hbs"),
    content: '.modal-content',
    body: '.modal-body',
    favorites: null,
    $glyphicon: null,

    initialize: function(params) {
        'use strict';
        var that = this;
        // renders loading screen
        if (this.model !== undefined) {
            this.getPage();
        }
        this.favorites = params.favorites;

        this.favorites.on('update', this.isFaved, this);
    },

    showLoading: function () {
        'use strict';
        var $div = $('<div></div>');
        $div.html(this.templateLoading());

        ModalManager.show({
            content: $div,
            module: this.MODULE
        });

        return this;
    },

    render: function() {
        'use strict';
        var $div = $('<div></div>');

        $div.html(this.template(this.model.toJSON()));

        ModalManager.show({
            content: $div,
            module: this.MODULE
        });

        /*if (this.$('div[data-type=video]').length > 0){
            this.showVideo();
        }*/

        if (ModalManager.shown()) {
            TweenLite.from(this.body, 1, {autoAlpha: 0, ease: Quad.easeOut});
        }

        return this;
    },
    isFaved: function (e) {
        'use strict';
        var id = this.model.get('id'),
            found = this.favorites.getModelByAttribute('pname', id),
            faved;

        this.$glyphicon = this.$('.savelist-lnk > .glyphicon');
        
        if (found !== undefined) {
            this.$glyphicon.removeClass(this.PLUS).addClass(this.MINUS);
            faved = true;
        } else {
            this.$glyphicon.removeClass(this.MINUS).addClass(this.PLUS);
            faved = false;
        }
        this.model.set('faved', faved);

    },

    getPage: function () {
        var that = this;
        this.showLoading();
        this.model.fetch({
            xhrFields: {
                withCredentials: true
            },
            success: $.proxy (function(data) {
                that.render();
            }, this),
            error: function(xhr, response, error) {
                Logger.get(that.MODULE).error('Detail Page not available.');
                ErrorsManager.showGeneric();
            }
        });
    },

    showVideo: function () {
        console.log(this.model.toJSON());
        VideoPlayer.show(this.$(this.PLAYER));
    },

    cleanUp: function () {
        'use strict';
        VideoPlayer.cleanUp();
 
        this.unbind(); // Unbind all local event bindings
    }
});

module.exports = PageView;
