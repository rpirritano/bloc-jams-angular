 (function() {
     function CollectionCtrl(Fixtures) {
         this.albums = Fixtures.getCollection();
     }
 
     angular
         .module('blocJams')
         .controller('CollectionCtrl', ['Fixtures', CollectionCtrl]);
 })();







