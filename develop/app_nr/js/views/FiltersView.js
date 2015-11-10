/*jshint -W089 */ // for in error

var Backbone = require("backbone"),
    $ = require('jquery'),
    _ = require("underscore"),
    Refinements = require('../modules/refinements'),
    ScrollHelper = require('../modules/scroll_helper');

var FiltersView = Backbone.View.extend({
    el: "#filters",
    template: require("../../templates/FiltersTemplate.hbs"),
    refinements: Refinements.getInstance(),
    //cat: "",
    filterContent: "",
    delay: true,
    app: null,
    ACTIVE: "#chapter",
    active: "",
    adjustHeight: null,

    initialize: function(params) {
        'use strict';
        this.collection.on('update', this.preRender, this);
        this.app = params.app;

        this.active = this.ACTIVE;

        this.adjustHeight = this.adjustHeigthWrapper();

        ScrollHelper.setQue({
            func: ScrollHelper.adjustHeight,
            callback: this.adjustHeight
        });
    },
    preRender: function() {
        'use strict';
        if (this.collection.isNotValid()) {
            return false;
        }

        this.collection.filters = this.refinements.compare(this.collection.filters);
        this.render();
    },

    render: function () {
        'use strict';
        var that = this,
            filterTemplate,
            i;

        $('.filter-item-cat').remove();
        $('.filter-item').remove();

        _.each(this.collection.filters, function (filter) {
            filter.cat_display = filter.displayName;

            for (i=0; i<filter.refinements.length; i++) {
               filter.refinements[i].cat = filter.name;
            }

            filterTemplate = this.template(filter);
            this.$el.append(filterTemplate);
        }, this);

        this.$('.filter-item').on('show.bs.collapse', function () {
            that.$('.filter-item-cat').addClass('collapsed');
            that.$('.filter-item').removeClass('in');
        });

        this.showActive();
        this.adjustHeight();


        return this;
    },

    events: {
       "click .filter-item-cat" : "toggleItem",
        "click .filter-checkbox": function(e) {
            'use strict';
            if ($(e.target).prop('checked')) {
                this.showSelectedFilter();
            } else {
                this.removeSelectedFilter(e, "cb");
            }
        },
        "click #removeAllFilters": function(e) {
            'use strict';
            this.removeAllFilters(e);
        },
        "click .clear-filter": function(e) {
            'use strict';
            this.removeSelectedFilter(e, "X");
        }
    },

    adjustHeigthWrapper: function () {
        'use strict';
        var that = this,
            top,
            doc,
            delta,
            dist;
        return function () {
            top = $('#container').offset().top;
            doc = ScrollHelper.winHeight();

            // window stick
            if ($('.container.stick').length > 0) {
                delta = doc - top -10;
            } else {
                top = ScrollHelper.winTop();
                delta = doc - top -10;
            }

            //console.log('container ' + $('#container').offset().top);
            //that.$el.css({'height': delta + 'px'});
        };
    },

    showActive: function () {
        'use strict';
        this.$('.filter-item-cat').addClass('collapsed');
        this.$('div[data-target=' + this.active + ']').removeClass('collapsed');

        this.$('.filter-item').removeClass('in');
        this.$(this.active).addClass('in');

    },

    toggleItem: function (e) {
        'use strict';
        var target = $(e.currentTarget).data('target');

        if (target) {
            this.active = target;
            // this.$('.filter-item-cat').addClass('collapsed');
            // this.$('div[data-target=' + this.active + ']').removeClass('collapsed');
            //this.showActive();
        }
    },
    /**
     * Display select filter with removal indicator
     * Change URL to include filter
     * Call Searchandiser for refinements
     * Display filtered content (refresh ArticleView)
     * @param e
     */
    showSelectedFilter: function() {
        'use strict';
        var html = "";

        $("#selectedFilters").empty();

        $(".filter-checkbox").each(function() {
            if ($(this).prop('checked')) {
                html += '<div class="selected-filters"><div class="active-filter">' + $(this).attr('data-filter-name') +
                    '&nbsp;&nbsp;&nbsp;&nbsp; <span data-close-filter-name="' + $(this).attr('data-filter-name') +
                    '" data-close-filter-cat="' + $(this).attr('data-filter-cat') +
                    '" class="clear-filter">x</span></div></div>';
            }
        });

        if (html) {
            html = '<div class="remove-all-filters" id="removeAllFilters">Remove all filters</div>' + html;
        }

        $("#selectedFilters").append(html);

        var url = this.buildFilterUrl(window.location.href.substr(0, window.location.href.indexOf("#")));

        window.history.pushState(null,null,url);
    },
    removeSelectedFilter: function(e, typ) {
        'use strict';
        var sel ='';
        var tgt = $(e.target);

        if (typ) {
            sel = "input[data-filter-name='" + tgt.attr('data-close-filter-name') + "']" +
                "[data-filter-cat='" + tgt.attr('data-close-filter-cat') + "']";
            $(sel).attr('checked', false);
        }

        this.showSelectedFilter();
    },
    /**
     * Remove all filters, remove saved refinements, reset to baseUrl and do getArticles
     */
    removeAllFilters: function(e) {
        'use strict';
        $('.selected-filters').remove();
        $('.filter-checkbox').attr('checked', false);
        $('.remove-all-filters').remove();
        Norton.savedRefinements = null;

        var url = Norton.baseUrl;

        window.history.pushState(null,null,url);

        this.app.formatRefinements();   // call getArticles() in AppView


        this.active = this.ACTIVE;

    },
    buildFilterUrl: function(url) {
        'use strict';
        var cats = [],
            query = "",
            cat,
            key,
            name;

        $( "input[data-filter-name]" ).each(function() {
            if ($( this ).prop('checked')) {
                name = $( this ).attr('data-filter-name');
                cat = $( this ).attr('data-filter-cat');
                if (cats[cat]) {
                    cats[cat] += "," + encodeURIComponent(name);
                } else {
                    cats[cat] = encodeURIComponent(cat) + "=" + encodeURIComponent(name);
                }
            }
        });

        Norton.savedRefinements = cats;
        this.app.formatRefinements();   // call getArticles() in AppView

        for (key in cats) {
            query += cats[key] + "&";
        }

        // query will be empty when last filter is removed
        return url + ((query) ? "#/filters/?" + query.slice(0, -1) : "");
    },
    buildRefinementsFromUrl: function() {
        'use strict';
        var refs = [],
            cats,
            splt,
            that = this;

        var qs = window.location.href.substr( (window.location.href.indexOf("?") + 1) , window.location.href.length);

        cats = (qs) ? qs.split("&") : ""; // don't want cat's to be 1 element array with empty key-val
        var obj;
        for (var cat in cats) {
            splt = cats[cat].split("=");
            refs[splt[0]] = cats[cat];
        }

        Norton.savedRefinements = refs;
        this.app.formatRefinements();   // call getArticles() in AppView

        if (this.app.dataReady) {
            this.showSelectedFilter();
        } else {
            this.app.deferred.promise().done(function () {
                that.showSelectedFilter();
            });
        }
    }
});

module.exports = FiltersView;
