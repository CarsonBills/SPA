var Backbone = require("backbone");
var $ = require('jquery');
Backbone.$ = $;

var FiltersView = Backbone.View.extend({
    el: "#filters",
    template: require("../../templates/FiltersTemplate.hbs"),
    cat: "",
    filterContent: "",
    initialize: function() {
        "use strict";
        this.on('change', this.render, this);
        console.log(this.$el);
    },
    render: function () {
        "use strict";
        this.model.each(function (filter) {
            var filterTemplate = this.template(filter.toJSON());
            this.$el.append(filterTemplate);
        }, this);

        return this;
    },
    showSelectedFilter: function(e) {
        "use strict";
        var html = '<ul class="selected-filters"><li>'+$(e.target).text()+'</li><li>X</li></ul>';
        $("#selectedFilters").append(html);
    }
});

module.exports = FiltersView;
