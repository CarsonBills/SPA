var Backbone = require('backbone');

var ArticleModel = Backbone.Model.extend({

    defaults: {
        totalRecordCount: null,
        pageInfo: {
            recordStart: null,
            recordEnd: null,
        },
        records: [
            {
                allMeta: {
                    author_first: '',
                    chapter: '',
                    site_code: '',
                    abstract: '',
                    title: '',
                    mode: '',
                    category_id: '',
                    author_last: '',
                    ebook_node: '',
                    genre: '',
                    theme: '',
                    categories: [

                    ],
                    id: '',
                    keyword: '',
                    pname: '',
                },
                _id: '',
            },
        ],
    },

    /**
     * First object is always incomplete with no data (why????) so we need to trap it to ignore it.
     */
    initialize: function() {
        'use strict';
        /*        Try {

                    var pn = this.get("allMeta").title.toLowerCase();
                    pn = pn.replace(/ /g, "-");

                    console.log(this.get("allMeta"));

                    this.set("allMeta.pname", pname);

                    console.log(this.get("allMeta"));

                    var rd = this.set("recordData");
                    rd.push(pname);

                    this.set("recordData", rd);

                    console.log(this.get("allMeta").pname);
                }catch(e){
                    //console.log(this);
                }


        console.log(this.attributes);
         */
    },

});


module.exports = ArticleModel;
