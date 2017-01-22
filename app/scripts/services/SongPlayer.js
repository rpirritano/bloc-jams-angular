(function() {
    function SongPlayer() {
        var SongPlayer = {}; //SongPlayer variable is created and set to an empty object
        
        var currentSong = null;
        var currentBuzzObject = null;
    
/**
* @function setSong
* @desc Stops currently playing song and loads new audio file as currentBuzzObject
* @param {Object} song
*/
            
    var setSong = function(song) {
        if (currentBuzzObject) {
            currentBuzzObject.stop();
            currentSong.playing = null;
        }
 
        /**
        * @desc Buzz object audio file
        * @type {Object}
        */
        currentBuzzObject = new buzz.sound(song.audioUrl, {
            formats: ['mp3'],
            preload: true
        });
 
        currentSong = song;
    };
        
        /**
        * @function playSong
        * @desc plays the song (currentBuzzObject) and sets the song.playing to true
        * @param {object} song
        */
        var playSong = function(song) {
            currentBuzzObject.play();                                   
            song.playing = true;
        };
        
        /**
        *Here the play method takes an argument, song, which is grabbed from album view 
        *when a user clicks the play button. The ng-repeat directive used in album template
        *will dictate which song to pass into the function. The play method creates a new
        *buzz object using the songs audioUrl property and then calls Buzz's own play method
        *on the object. To trigger the SongPlayer.play method an ngClick directive must be
        *added to the play button anchor tag in album.html
        */
        /**
        * @function SongPlayer.play
        * @desc public method used to play song (Currently used in the album.html template) 
        * @param {object} song
        */
        
        SongPlayer.play = function(song) {
            if (currentSong !== song) {
                setSong(song);
                playSong(song);
                
            } else if (currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    currentBuzzObject.play();
                }  
            }
        };
        
        return SongPlayer;
}
 
    //to use SongPlayer service, must be injected as a dependency. Music will
    //be played from the album view, so it is injected in the AlbumCtrl
    
    angular
        .module('blocJams')
        .factory('SongPlayer', SongPlayer);
})();


/**
*the SongPlayer service contains:
* 1 private attribute: currentBuzzObject
* 1 public attribute: SongPlayer.currentSong
* 1 private function: setSong
* and two public methods: SongPlayer.play and SongPlayer.pause
*/