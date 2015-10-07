(function(){

  var now = require('lumine-now'),
      bézier = require('cubic-bezier');

  var RESOLUTION = 'seconds';

  /**
   * Creates an object that manages tweening progress
   * @param options
   * @constructor
   */
  function Tween(options){

    var opts = options || {};

    this.duration = opts.duration || 1000; // duration in ms
    this.curve = opts.curve || [ .25, .1, .25, 1 ];

    this.bézier = bézier.apply(null, this.curve.concat(2 * this.duration));

    this.tweening = false;

  }

  Tween.prototype.start = function(sTime, fromTo, done){
    this._sTime = sTime || now();
    this._cTime = 0;

    this.tweening = true;
    this.from = fromTo.from;
    this.to = fromTo.to;
    this._done = done;
  };

  Tween.prototype.stop = function(){
    this.tweening = false;
    if(this._done) this._done(this.to);
  };

  Tween.prototype.update = function(to){
    delete this.to;
    this.to = to;
  };

  Tween.prototype.progress = function(time){
    return this.bézier(Math.min((toString.call(time) === '[object Number]' ? time : this._cTime) / this.duration, 1));
  };

  Tween.prototype.getTime = function(){
    return this._sTime + this._cTime;
  };

  Tween.prototype.tick = function(delta){
    var progress = this.progress( this._cTime += delta );
    if(progress >= 1) this.stop();
    return progress;
  };

  module.exports = Tween;

})();