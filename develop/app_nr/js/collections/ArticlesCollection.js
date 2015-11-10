var Backbone = require('backbone'),
    _ = require('underscore'),
    ErrorsManager = require('../modules/errors_manager');

var ArticlesCollection = Backbone.Collection.extend({
    model: NortonApp.Models.Article,
    url: Norton.Constants.searchUrl,
    totalRecords: 0,
    recordStart: 0,
    recordEnd: 0,
    filters: null,
    showGridView: false,
    initialize: function() {
    },
    parse: function(res) {
        'use strict';

        var response = res.data,
            that = this;

        if (res.code !== 200) {
            this.status = ErrorsManager.FAIL_STATE;
            ErrorsManager.showGeneric();
            return false;
        }

        // Inject return data to collection for later use in view
        this.totalRecords = response.totalRecordCount;
        this.recordStart = response.pageInfo.recordStart;
        this.recordEnd = response.pageInfo.recordEnd;
        this.filters = response.availableNavigation;

        _.each(response.records, function(record) {
            // Keep track of last record loaded to place focus on record previous to new page request - for accessibility
            // Norton.lastArticleLoaded = record.attributes.allMeta.pname;

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

        return response.records;
    },

    isNotValid: function() {
        'use strict';
        /*return _.every(this.models, function(model){
            return model.isValid();
        });*/
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
            return params.records[idx].allMeta.pname;
        }
        return null;
    },

    /*prev: function(model) {
        'use strict';

        var idx = this.current(model);
        idx -= 1;

        if (idx > 0) {
            return this.at(idx - 1).attributes.allMeta.pname;
        }

        return null;
    },
    next: function(model) {
        'use strict';

        var idx = this.current(model);
        idx += 1;

        if (idx < (this.length - 1)) {
            return this.at(idx + 1).attributes.allMeta.pname;
        }
        return null;
    },
    current: function(id) {
        'use strict';
        console.log(this.models)
        return this.indexOf(id);
    },*/

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
    }
});

module.exports = ArticlesCollection;
