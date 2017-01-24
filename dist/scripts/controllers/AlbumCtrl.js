(function() {
         function AlbumCtrl(Fixtures, SongPlayer) {
             this.albumData = Fixtures.getAlbum();
             this.songPlayer = SongPlayer;
    
         
         //songPlayer property holds SongPlayer service and makes it accesible in album view
        this.songPlayer = SongPlayer;
         
         }
    
    angular
        .module('blocJams')
        .controller('AlbumCtrl', ['Fixtures', 'SongPlayer', AlbumCtrl]);
})();









 