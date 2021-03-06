var Backbone = require('backbone'),
    _ = require('underscore'),
    ErrorsManager = require('../modules/errors_manager'),
    EventManager = require('../modules/event_manager');

var ArticlesCollection = Backbone.Collection.extend({
    MODULE: 'ArticlesCollection',
    model: NortonApp.Models.Article,
    url: Norton.Constants.searchUrl,
    evtMgr: EventManager.getInstance(),
    totalRecords: 0,
    recordStart: 0,
    recordEnd: 0,
    filters: null,
    showGridView: false,
    currentPage: null,
    
    initialize: function() {
    },

    parse: function(res) {
        'use strict';

        var response = res.data,
            that = this;

        if (res.code !== 200) {
            this.status = ErrorsManager.FAIL_STATE;
            ErrorsManager.showGeneric();
            Logger.get(this.MODULE).error(res);
            return false;
        }


        // Inject return data to collection for later use in view
        this.totalRecords = response.totalRecordCount;
        this.recordStart = response.pageInfo.recordStart;
        this.recordEnd = response.pageInfo.recordEnd;
        this.filters = response.availableNavigation;

        _.each(response.records, function(record, index) {
            /**
             * Next/prev links
             */
            record.prevId = that.getPName({
                inc: -1,
                records: response.records,
                record: record
            });
            record.nextId = that.getPName({
                inc: 1,
                records: response.records,
                record: record
            });
            record.baseUrl = Norton.baseUrl;

        });

        if (response.totalRecordCount === 0) {
            this.evtMgr.trigger(EventManager.EMPTY_RESULTS, {});
        }

        return response.records;
    },

    update: function () {
        'use strict';
        var index = this.recordStart - 1, // zero based index
            prev = index - 1,
            item, // the first article just fetched
            prevItem; // previous last fetched article

        /* used to reinsert prevId/nextId */
        if (prev >= 0 && prev < this.length) {
            item = this.at(index);
            prevItem = this.at(prev);

            // backbone model form
            item.set('prevId', prevItem.get('allMeta').pname);
            prevItem.set('nextId', item.get('allMeta').pname);
        }
    },

    isNotValid: function() {
        'use strict';
        return this.status === ErrorsManager.FAIL_STATE || this.models.length === 0;
    },
    /**
     * For next/prev, index comes from the data so it may not be sequential
     */
    getPName: function (params) {
        'use strict';

        var idx = _.indexOf(params.records, params.record);
        idx += params.inc;

        if (idx >= 0 && idx < params.records.length) {
            // raw model form
            return params.records[idx].allMeta.pname;
        }
        return null;
    },

    setShowGrid: function (bool) {
        'use strict';
        this.showGridView = bool;
    },

    showGrid: function () {
        'use strict';
        return this.showGridView;
    },
    hasMore: function () {
        'use strict';
        var bool = false;
        if (this.totalRecords !== 0 && this.recordEnd < this.totalRecords) {
            bool = true;
        }

        return bool;
    },
    cleanupAndReset: function() {
        'use strict';
        this.reset(null);
        this.recordEnd = 0;
    },

    getModelByAttribute: function (attr, value) {
        'use strict';
        var model =  _.find(this.models, function(model) {
            return model.get('allMeta')[attr] === value;
        });

        return model;
    },

    saveCurrentPageDetail: function (model) {
        'use strict';
        if (model) {
            this.currentPage = model;
        }
    },

    getCurrentPageDetail: function (id) {
        'use strict';
        if (this.currentPage.get('id') === id) {
            return this.currentPage;
        }
        return null;
    }
});

module.exports = ArticlesCollection;
