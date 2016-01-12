
var Backbone = require('backbone'),
	_ = require('underscore'),
	evtMgr = (function() {
    'use strict';
        var instance;
        return {
            // Event constants
            GRID_VIEW: 'icon-grid-view',
            LIST_VIEW: 'icon-list-view',
            DEEPLINK: 'deeplink',
            // Events
            // gird/list view change
            CONTENT_VIEW_CHANGE: 'content_view_change',
            // tag click
            TAG_LINK_CLICK: 'tag_link_click',
            // reset filter
            FILTERS_RESET: 'filters_reset',
            SEARCH_CLEAR: 'search_clear',
            REWRITE_PAGE: 'rewritePage',
            WINDOW_RESIZE: 'windowResizeEvent',

            getInstance: function() {
                if (instance === undefined) {
                    instance = _.extend({}, Backbone.Events);
                }
                return instance;
            },
        };
}());

module.exports = evtMgr;