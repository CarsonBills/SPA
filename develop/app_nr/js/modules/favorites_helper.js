
var Backbone = require('backbone'),
	_ = require('underscore'),
    DocumentExport = require('../modules/document_export'),
    WindowManager = require('../modules/window_manager'),

	Favorites = (function() {
    'use strict';

        var LEGEND = ['Title', 'Author', 'Page Number'],
            link,
            type,
            filename,

            save = function (params) {

                params.legend = LEGEND;

                link = document.createElement('a');
                type = params.type;
                filename = (params.title !== '') ? params.title: 'my_favorites';
                filename += ('.' + params.type);

                // Chrome and FF
                if (typeof link.download === 'string') {
                    link.href = DocumentExport.getContent(params);
                    link.download = filename;
                    
                    //Firefox requires the link to be in the body
                    document.body.appendChild(link);
                    $(link).css({'visibility': 'hidden'});

                    link.click();

                    //remove the link when done
                    document.body.removeChild(link);

                } else {
                // Safari
                    WindowManager.open(params);
                }
            
        };


        return {
            save: save
        };
}());

module.exports = Favorites;


/*


    downloadYourFavs: function(type) {
        'use strict';
        var that = this,
            data = $('#yourFavsTitle').text() + '\t\t\n' +
            'Title, Author, Page Number\n';
        this.collection.each(function(article) {
            data += article.attributes.title + '\t' +
                article.attributes.authorFirstName + " " + article.attributes.authorLastName + '\t' +
                'page number' + '\n';
        }, this);


        var blob = new Blob([data], 
                { type: 'text/plain;charset=utf-8;' }
            ),
            //url = URL.createObjectURL(blob),
            lnk = document.createElement('a'),
            uri = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(data),
            filename = ($("#yourFavsTitle").html() !== "") ? $("#yourFavsTitle").html() : "my_items";
            filename += ('.' + type);


        $(lnk).attr({
            'href': uri,
            //'target': '_blank',
            'download': filename
        })

        //lnk.setAttribute('href', url);
        //lnk.setAttribute('download', filename);
        //lnk.style.visibility = 'hidden';
        document.body.appendChild(lnk);
        lnk.click();
        document.body.removeChild(lnk);
    },
*/