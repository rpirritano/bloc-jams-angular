(function() {
    function SongPlayer($rootScope, Fixtures) {
        
        //SongPlayer variable is created and set to an empty object
        var SongPlayer = {};                                        
        
        /**
        * @desc album object using the Fixtures.getAlbum() method, which returns album picasso
        * @type {object}
        */
        var currentAlbum = Fixtures.getAlbum();
        
        /**
        * @function getSongIndex
        * @desc determines the index of the current song in the current album 
        * @param {object} song
        */
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };
        
        /**
        * @desc song object from songs list in album. Public attribute so that it can be used in the player bar
        * @type {object} 
        */
        SongPlayer.currentSong = null;
        
         /**
         * @desc Current playback time (in seconds) of currently playing song
         * @type {Number}
         */
         SongPlayer.currentTime = null;
        
         SongPlayer.max = 100;
        
        /**
         * @desc Volume of currently playing song
         * @type {Number}
         */
         SongPlayer.volume = null;
        
        
        /**
        * @function setVolume
        * @desc Sets volume of currently playing song
        * @param {Number} volume
        */
        SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
                SongPlayer.volume = volume;
            }
        }
        
        
        /**
        * @desc Buzz object audio file
        * @type {object}
        */
        var currentBuzzObject = null;
        
        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject){                                  
                currentBuzzObject.stop();                            
                SongPlayer.currentSong.playing = null;                                                                                     
               }                                                        
           
            currentBuzzObject = new buzz.sound(song.audioUrl, {     
               formats: ['mp3'],                                         
                preload: true                                           
            });                     
            
            /**
            The bind() method adds an event listener to the Buzz sound object – in this case, we listen for a timeupdate event. When the song playback time updates, we execute a callback function. This function sets the value of SongPlayer.currentTime to the current playback time of the current Buzz object using another one of the Buzz library methods: getTime(), which gets the current playback position in seconds. Using  $apply, we apply the time update change to the $rootScope.
            */
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();    
                });    
            })
            
            SongPlayer.currentSong = song;
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
        * @function stopSong
        * @desc stops the song (currentBuzzObject) and sets the song.playing to null
        * @param {object} song
        */
        var stopSong = function(song) {
            currentBuzzObject.stop();
            song.playing = null;
        
        };
        
        
        /**
        * @function SongPlayer.play
        * @desc public method used to play song (Currently used in the album.html template) 
        * @param {object} song
        */
        SongPlayer.play = function(song) {                              
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song){
               setSong(song);
               playSong(song);
                if (SongPlayer.muted === true) {
                    SongPlayer.mute();
                }
                                                                        
            } else if (SongPlayer.currentSong === song) {      
                if (currentBuzzObject.isPaused()) {
                    currentBuzzObject.play();
                    if (SongPlayer.muted === true) {
                    SongPlayer.mute();
                }
                }
            }
        }
        
        /**
        * @function SongPlayer.pause
        * @desc public method used to pause the current song (Currently used in the album.html template) 
        * @param {object} song
        */
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        }
        
        
        /**
        * @function SongPlayer.previous
        * @desc function for the previous button on the player bar. Determines current song index,
        * decrements by one, and then plays the song at that index (or stops if less than zero)
        */
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            
            if (currentSongIndex < 0) {
                stopSong(SongPlayer.currentSong);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
                /**
        * @function SongPlayer.next
        * @desc function for the next button on the player bar. Determines current song index,
        * increments by one, and then plays the song at that index 
        */
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            
            if (currentSongIndex > currentAlbum.songs.length) {
                stopSong(SongPlayer.currentSong);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
            
        };
        
        /**
        * @function setCurrentTime
        * @desc Set current time (in seconds) of currently playing song
        * @param {Number} time
        */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };
        

        
        /**The service (factory in this case) returns this object, making its 
        *properties and methods public to the rest of the application 
        */
        return SongPlayer;                                            
    }                                                               
                                                                
    
    
    //to use SongPlayer service, must be injected as a dependency. Music will
    //be played from the album view, so it is injected in the AlbumCtrl
    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);                         
})();


/**
*the SongPlayer service contains:
* 1 private attribute: currentBuzzObject
* 1 public attribute: SongPlayer.currentSong
* 1 private function: setSong
* and two public methods: SongPlayer.play and SongPlayer.pause
*/