var Backbone = require("backbone"),
    $ = require('jquery'),
    _ = require("underscore"),
    Refinements = require('../modules/refinements');

var FiltersView = Backbone.View.extend({
    el: "#filters",
    template: require("../../templates/FiltersTemplate.hbs"),
    refinements: Refinements.getInstance(),
    //cat: "",
    filterContent: "",
    delay: true,
    initialize: function() {
        "use strict";
        this.collection.on('update', this.render, this);
    },
    render: function () {
        "use strict";
        var that = this,
            filterTemplate,
            cat,
            i;

        if (this.collection.length > 0 && this.delay) {
            this.delay = false;
            setTimeout(function () {
                that.refinements.compare(this.collection);
            }, 500);
        }

        this.$('.filters-container').remove();

        // Since this refreshes on each Load More event, do not keep appending
        $(this.$('.filters-content')).empty();

        _.each(this.collection.filters, function (filter) {
            filter.cat_display = filter.displayName;

            for (i=0; i<filter.refinements.length; i++) {
               filter.refinements[i].cat = filter.name;
            }

            filterTemplate = this.template(filter);
            this.$el.append(filterTemplate);
        }, this);

        return this;
    },
    /**
     * Display select filter with removal indicator
     * Change URL to include filter
     * Call Searchandiser for refinements
     * Display filtered content (refresh ArticleView)
     * @param e
     */
    showSelectedFilter: function(e) {
        "use strict";
        var tgt = $(e.target);
        var cat = tgt.attr('data-filter-cat');
        var name = tgt.attr('data-filter-name');

        var html = '<div class="selected-filters"><div>' + name +
            '&nbsp;&nbsp;&nbsp;&nbsp; <span data-close-filter-name="' + tgt.attr('data-filter-name') +
            '" data-close-filter-cat="' + cat +
            '" class="close-filter" style="cursor:pointer;font-weight:bold;">X</span></div></div>';

        $("#selectedFilters").append(html);

        var url = this.buildFilterUrl(window.location.href.substr(0, window.location.href.indexOf("#")));

        window.history.pushState(null,null,url);

        // call searchandiser, and refresh AppView with results. Remember to leave filter open with selected filters
    },
    /**
     * Remove filter from selected filters list
     * Remove URL from filter
     * Call Searchandiser for refinements
     * Display filtered content (refresh ArticleView)
     * @param e
     */
    removeSelectedFilter: function(e, typ) {
        "use strict";
        var sel ='';
        var tgt = $(e.target);

        if (typ == 'cb') {  // checkbox was clicked to remove
            sel = "span[data-close-filter-name='" + tgt.attr('data-filter-name') + "']" +
                "[data-close-filter-cat='" + tgt.attr('data-filter-cat') + "']";
            tgt.attr('checked', false);
            $(sel).parents('.selected-filters').remove();
        } else {    // close indicator (X) was clicked to remove
            sel = "input[data-filter-name='" + tgt.attr('data-close-filter-name') + "']" +
                "[data-filter-cat='" + tgt.attr('data-close-filter-cat') + "']";
            $(sel).attr('checked', false);
            tgt.parents('.selected-filters').remove();
        }

        var url = this.buildFilterUrl(window.location.href.substr(0, window.location.href.indexOf("#")));

        window.history.pushState(null,null,url);

        // call searchandiser, and refresh AppView with results. Remember to leave filter open with selected filters
    },

    buildFilterUrl: function(url) {
        "use strict";
        var cats = [],
            query = "",
            cat,
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

        Norton.refinements = cats;

        for (var key in cats) {
            query += cats[key] + "&";
        }
        return url + "#/filters/?" + query.slice(0, -1);
    }
});

module.exports = FiltersView;
