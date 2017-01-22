(function() {
    function AlbumCtrl(){
        this.album = [];
        for (var i=0; i < 12; i++) {
            this.album.push(angular.copy(albumPicasso));
        }
    }
    
    angular
        .module('blocJams')
        .controller('AlbumCtrl', AlbumCtrl);
})();









 