/**
For directives, the callback function (in this case, seekBar) is a factory function. It returns an object that describes the directive's behavior to Angular's HTML compiler. This object communicates the behavior through options. 
*/
(function() {
     function seekBar($document) {

         
/**
* @function calculatePercent
* @desc calculates the horizontal percent along the seek bar where the event (passed
* in from the view as $event) occured.
* @param seekBar (directive, element in this case) and an event  
*/         
         
var calculatePercent = function(seekBar, event) {
    var offsetX = event.pageX - seekBar.offset().left;
    var seekBarWidth = seekBar.width();
    var offsetXPercent = offsetX / seekBarWidth;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(1, offsetXPercent);
    return offsetXPercent;
 };
         
         return {
             templateUrl: '/templates/directives/seek_bar.html',
             replace: true,
             restrict: 'E',
             scope: {
                 onChange: '&'
             },
             link: function(scope, element, attributes) {
             // directive logic to return
                 
                 /**
                * @desc holds value of the seek bar(i.e. current playing song time/current song volume)
                * @type number
                */
                 scope.value = 0;
                 
                /**
                * @desc Holds the element that matches the directive (<seek-bar>) as a jQuery object
                * so jQuery methods can be called on it.
                * @type directive
                */
                 scope.max = 100;
                 
                 var seekBar = $(element);
                 
                 /**
                * @desc This code observes the values of the attributes we declare in the HTML by specifying the attribute name in the first argument
                * so when observed, we execute a callback to set the new scope value, to determine the location of the song and the playbck position.
                * @type directive
                */
                 
                 attributes.$observe('value', function(newValue) {
                 scope.value = newValue;
                 });
 
                 attributes.$observe('max', function(newValue) {
                 scope.max = newValue;
                 });
 
                 
                /**
                * @function percentString
                * @desc calculates a percent based on the value and max value of a seek bar
                */
                 
                 var percentString = function () {
                     var value = scope.value;
                     var max = scope.max;
                     var percent = value / max * 100;
                     return percent + "%";
                 };
                 
                /**
                * @function scope.fillStyle
                * @desc returns the width of the seek bar fill element based on calculated percent
                */
                 
                 scope.fillStyle = function() {
                     return {width: percentString()};
                 };
                 
                
                 scope.thumbStyle = function(){
                     return {left: percentString()};     
                 };
                 
                /**
                * @function scope.onClickSeekBar
                * @desc updates the seek bar value based on the seekbars width and the location of 
                * the users click on the seek bar 
                * @param event
                */
                 
                 scope.onClickSeekBar = function(event) {
                    var percent = calculatePercent(seekBar, event);
                    scope.value = percent * scope.max;
                    notifyOnChange(scope.value);
                };
                 
                /**
                * @function scope.trackThumb
                * @desc similar to scope.onClickSeekBar, but uses $apply to constantly apply the change
                * in value of scope.value as the user drags the seek bar thumb
                */
                 scope.trackThumb = function() {
                     $document.bind('mousemove.thumb', function(event) {
                         var percent = calculatePercent(seekBar, event);
                         scope.$apply(function() {
                             scope.value = percent * scope.max;
                             notifyOnChange(scope.value);
                         });
                     });
                     
                     $document.bind('mouseup.thumb', function() {
                         $document.unbind('mousemove.thumb');
                         $document.unbind('mouseup.thumb');
                     });
                 };
                 
                    /**
                    * @function notifyOnChange
                    * @desc to notify onChange that scope.value has changed
                    */ 
                     var notifyOnChange = function(newValue) {
                        if (typeof scope.onChange === 'function') {
                            scope.onChange({value: newValue});
                        }
                     };
             }
         };
     }
 
     angular
         .module('blocJams')
         .directive('seekBar', ['$document', seekBar]);
 })();