var JSConstants = {
    noMyItems: '<div class="empty-list">You have not added any items to your List yet.</div>',
    emptySeach: 'Please put in search query',
    creditsUrl: '/json/credits.json',
    loginUrl: '//books.wwnorton.com/books//ssl/WebLogin.aspx',
    invalidSiteCodeUrl: '//books.wwnorton.com/books/index.aspx',
    siteConfigUrl: 'http://bishop:822/ars.svc/v1/getsiteconfig?',
    searchUrl: 'http://bishop:821/ars.svc/v1//search',
    getDetailPageUrl: 'http://bishop:822/ars.svc/v1/getpagedetail?',
    saveTrackingUrl: 'http://bishop:822/Ars.svc/v1/SaveTracking',
    getTrackingUrl: 'http://bishop:822/Ars.svc/v1/trackingbyasset',
    likeAssetUrl: 'http://bishop:822/Ars.svc/v1/LikeAsset ',
    unlikeAssetUrl: 'http://bishop:822/Ars.svc/v1/UnLikeAsset ',
    getSavedFavsUrl: 'http://bishop:822/Ars.svc/v1/getfavorites',

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