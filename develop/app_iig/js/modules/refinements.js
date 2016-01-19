
// Data constructor
var NavigationCollection = require('../collections/NavigationCollection'),
    $ = require('jquery'),
    _ = require('underscore'),
    ErrorsManager = require('../modules/errors_manager'),

    Navigation = function (options) {
        'use strict';
        this.initialize();
    };

Navigation.prototype = {
    collection: null,
    MODULE: 'refinements',
    url: Norton.Constants.filterNavUrl,
    deferred: $.Deferred(),
    savedFilters: null,

    initialize: function () {
        'use strict';
        this.collection = new NavigationCollection();

    },
    fetch: function () {
        'use strict';
        var that = this;
        var getdata = '?sitecode=' + Norton.siteCode +
            '&siteversion=' + Norton.version +
            '&skip=0' +
            '&pageSize=1' +
            '&searchRepo=' + Norton.searchRepo +
            '&navMetadata=' + encodeURIComponent(JSON.stringify(Norton.navMetadata));

        this.collection.fetch({
            method: "GET",
            datatype: "json",
            url: this.url + getdata,
            success: function(data) {
                if (that.collection.status !== ErrorsManager.FAIL_STATE) {
                    that.deferred.resolve(data);
                    that.savedFilters = data;
                } else {
                    that.deferred.reject(ErrorsManager.FAIL_STATE);
                }
            },
            error: function(collection, res, options) {
                Logger.get(that.MODULE).error(res);
                that.deferred.reject(res);
            }
        });

        return this.deferred.promise();

    },

    getMetaData: function (meta, prop) {
        'use strict';
        var result;

        _.each(meta, function(item) {
            if (item.key === prop) {
                result = item.value;
            }
        });
        return result;
    },

    getSavedFilters: function(filters) {
        // cloning object: http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object
        this.savedFilters = filters;
        var savedRefs = (Norton.savedRefinements == undefined) ? [] : Norton.savedRefinements,
            originalNav = JSON.parse(JSON.stringify(this.savedFilters)),
            selRefs = [];

        // build simple array of selected filters
        for (var i=0; i<savedRefs.length; i++) {
            if (savedRefs[i].navigationName == "siteversion") {
                continue;
            }

            selRefs.push(savedRefs[i].value);
        }
        // iterate over nav object to get selected state
        for(var i=0; i<originalNav.length; i++) {
            if (!originalNav[i].refs) {
                continue;
            }

            for (var j=0; j<originalNav[i].refs.length; j++) {
                originalNav[i].refs[j].checked = this.checkSelRefs(selRefs, originalNav[i].refs[j].fullName);

                if (originalNav[i].refs[j].subnav != undefined && originalNav[i].refs[j].subnav.length > 0) {
                    this.iterateSubNav(originalNav[i].refs[j].subnav, selRefs);
                }
            }
        }

        return originalNav;
    },

    checkSelRefs: function(selRefs, ref) {
        for (var i=0; i<selRefs.length; i++) {
            if (ref == selRefs[i]) {
                return "checked";
            }
        }

        return "";
    },

    // recursive subnav check for selected filters; may be up to 3 levels of subnav
    iterateSubNav:  function(navObj, selRefs) {
        for (var i=0; i<navObj.length; i++) {
            navObj[i].checked = this.checkSelRefs(selRefs, navObj[i].fullName);
            if (navObj[i].subnav != undefined && navObj[i].subnav.length > 0) {
                this.iterateSubNav(navObj[i].subnav,selRefs );
            }
        }
    }
};

var Refinements = (function() {
    'use strict';
        var navigation;

        return {
            getInstance: function() {
                if (navigation === undefined) {
                    navigation = new Navigation();
                }
                return navigation;
            }
        };
}());

module.exports = Refinements;
