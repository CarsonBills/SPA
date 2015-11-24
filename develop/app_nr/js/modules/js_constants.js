/* 822 for QA
    821 for Dev
*/

var JSConstants = {
    noMyItems: '<div class="empty-list">You have not added any items to your List yet.</div>',
    emptySeach: 'Please put in search query',
    creditsUrl: '/json/credits.json',
    loginUrl: '//books.wwnorton.com/books//ssl/WebLogin.aspx',
    invalidSiteCodeUrl: '//books.wwnorton.com/books/index.aspx',
    siteConfigUrl: 'http://10.0.10.149:821/ars.svc/v1/getsiteconfig?',
    searchUrl: 'http://10.0.10.149:821/ars.svc/v1//search',
    getDetailPageUrl: 'http://10.0.10.149:821/ars.svc/v1/getpagedetail?',
    saveTrackingUrl: 'http://10.0.10.149:821/Ars.svc/v1/SaveTracking',
    getTrackingUrl: 'http://10.0.10.149:821/Ars.svc/v1/trackingbyasset',
    likeAssetUrl: 'http://10.0.10.149:821/Ars.svc/v1/LikeAsset ',
    unlikeAssetUrl: 'http://10.0.10.149:821/Ars.svc/v1/UnLikeAsset ',
    getSavedFavsUrl: 'http://10.0.10.149:821/Ars.svc/v1/getfavorites',

    tabletLandspaceWidth: 1024,
    tabletPortaitWidth: 768,
    mobileWidth: 480,
    mobileWidthSM: 320,
    
//siteConfigUrl: 'http://dev-books.wwnorton.com:2999/api/getsiteconfig/',
//getDetailPageUrl: 'http://localhost:2999/api/getdetailpage/',
//searchUrl: '/php/searchandiser.php',
    defaultPageSize: 10
};

module.exports = JSConstants;