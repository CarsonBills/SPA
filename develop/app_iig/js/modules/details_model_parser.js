
var Backbone = require('backbone'),
    $ = require('jquery'),
	_ = require('underscore');

	DetailsParser = (function() {
    'use strict';

        /**
         * Amazon URL looks like https://s3.amazonaws.com/nortoniigprotectedassets/psyc/images/test.txt
         * strip off everything after bucket and build URL to cloudfront .NET service which will look like
         * //bishop:822/awsOutput.aspx?sitecode=devtest&siteversion=full&bucket=nortoniigprotectedassets&file=/psyc/images/test.txt
         */
        
        var parseUrl = function (src) {
            var i,
                url,
                nodes;

            if (src === undefined) {
                return false;
            }
            nodes = src.split('/');

            url = Norton.Constants.awsContentUrl + "sitecode=" + Norton.siteCode + "&siteversion=" + Norton.version+ "&file=";
            // Assuming 3rd forward slash and beyond is the file path and name
            // allows php to detect bucket name
            for (i = 3; i < nodes.length; i++) {
                url += "/" + nodes[i].replace("+", "%2b");
            }
            return url;
        },

        // https://s3.amazonaws.com/nortoniigprotectedassets/econ/images/TIP_035.jpg
        replaceURL = function (text) {
            var prefix = Norton.Constants.awsContentUrl + "sitecode=" + Norton.siteCode + "&siteversion=" + Norton.version+ "&file=",
                exp = /http(s?):\/\/s3.amazonaws.com/ig,
                frag;

                frag = text.replace(exp, prefix);

            return frag;
        },

        parseBlock = function (block) {
            switch (block.type) {
                case 'text only':
                    block.copy = replaceURL(block.copy);
                break;
                case 'image':
                    block.imageSrc = parseUrl(block.imageSrc);
                    block.copy = replaceURL(block.copy);
                break;
                case 'video':
                    block.stillImageSrc = parseUrl(block.stillImageSrc);
                    block.videoSrc = parseUrl(block.videoSrc);
                    block.blurb = replaceURL(block.blurb);
                break;
            }
        },

        process = function(raw) {
            // download aset
            if (raw.data.abstract) {
                raw.data.abstract = replaceURL(raw.data.abstract);
            }

            if (raw.data.introCopy) {
                raw.data.introCopy = replaceURL(raw.data.introCopy);
            }

            if (raw.data.downloads.src) {
                raw.data.downloads.href = replaceURL(raw.data.downloads.src);
            }

            if (raw.data.headerImage.videoSrc) {
                raw.videoSrc = parseUrl(raw.data.headerImage.videoSrc);
            }

            if (raw.data.headerImage.src) {
                raw.stillImageSrc = parseUrl(raw.data.headerImage.src);
            }

            // blocks
            _.each(raw.data.sections, function (section) {
                _.each(section.blocks, function (block) {
                    parseBlock(block);
                });
            });
            return raw;
        };

        return {
            process: process,
            parseUrl: parseUrl
        };
}());

module.exports = DetailsParser;



/* if (response.data.data.downloadAsset != undefined) {
    var assetData = Norton.Utils.buildAssetObject(response.data.data.downloadAsset);
    this.set({
        "assetHtml": assetData.html,
        "assetIcon": assetData.icon,
        "assetSize": assetData.size,
        "assetURL": assetData.url
    });
}*/