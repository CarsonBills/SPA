/**
 * PageView is the detail view of an article. It is instantiated in AppView.showDetailPage() and the model is populated in the same method.
 *
 * Its template is shown in a Bootstrap Modal
 *
 * @type {exports|module.exports}
 */
var Backbone = require('backbone'),
    $ = require('jquery'),
    ModalManager = require('../modules/modal_manager'),
    ErrorsManager = require('../modules/errors_manager'),
    VideoPlayer = require('../modules/video_player'),
    EventManager = require('../modules/event_manager'),
    MaxJax = require('../modules/mathjax')('modal-container');

var PageView = Backbone.View.extend({
    evtMgr: EventManager.getInstance(),
    MODULE: 'details',
    HEART: 'glyphicon-heart',
    HEART_EMPTY: 'glyphicon-heart-empty',
    PLAYER: '.jp-video',
    deferred: $.Deferred(),
    template: require('../../templates/modules/PageTemplate.hbs'),
    templateLoading: require("../../templates/modules/PageLoadingTemplate.hbs"),
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
        this.evtMgr.on(EventManager.TAG_LINK_CLICK, this.tagLinkClicked, this);
    },

    showLoading: function () {
        'use strict';
        var $div = $('<div></div>');
        $div.html(this.templateLoading());

        ModalManager.show({
            content: $div,
            module: this.MODULE,
            loading: true
        });

        return this;
    },

    render: function() {
        'use strict';
        var $div = $('<div></div>');
        // if modal is closed before data ready, block redner()
        if (ModalManager.shown()) {
            $div.html(this.template(this.model.toJSON()));    
            ModalManager.show({
                content: $div,
                module: this.MODULE,
                loading: false
            });
            
            TweenLite.from(this.body, 1, {autoAlpha: 0, ease: Quad.easeOut});
        }
        
        if (ModalManager.hasMathExpr()) {
            MaxJax.render();
        }

        return this;
    },

    tagLinkClicked: function (params) {
        'use strict';
        if (params.tag !== undefined || params.tag !== '') {
            if (ModalManager.shown()) {
                ModalManager.hide();
            }
        }
    },

    isFaved: function (e) {
        'use strict';
        var id = this.model.get('id'),
            found = this.favorites.getModelByAttribute('pname', id),
            faved;

        this.$glyphicon = this.$('.savelist-lnk > .glyphicon');
        
        if (found !== undefined) {
            this.$glyphicon.removeClass(this.HEART_EMPTY).addClass(this.HEART);
            faved = true;
        } else {
            this.$glyphicon.removeClass(this.HEART).addClass(this.HEART_EMPTY);
            faved = false;
        }
        this.model.set('faved', faved);

    },

    getPage: function () {
        'use strict';
        var that = this;
        this.showLoading();
        this.model.fetch({
            xhrFields: {
                withCredentials: true
            },
            success: $.proxy (function(data) {
                that.deferred.resolve(data.toJSON());
                that.render();
            }, this),
            error: function(xhr, response, error) {
                Logger.get(that.MODULE).error('Detail Page not available.');
                ErrorsManager.showGeneric();
            }
        });
        return this.deferred.promise();
    },

    showVideo: function () {
        'use strict';
        VideoPlayer.show(this.$(this.PLAYER));
    },

    cleanUp: function () {
        'use strict';
        VideoPlayer.cleanUp();
 
        this.unbind(); // Unbind all local event bindings
    }
});

module.exports = PageView;
