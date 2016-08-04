var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

var PlayerControls = (function () {
    function PlayerControls(_player) {
        this.enabled = false;
        this.player = _player;
    }
    
    PlayerControls.prototype.enable = function(){
        this.enabled = true;
    };   
    
    PlayerControls.prototype.update = function(){
        if(!this.enabled)
            return;
        
        
        if(Key.isDown(Key.UP))
            this.player.move('N');
        else if(Key.isDown(Key.DOWN))
            this.player.move('S');
        else if(Key.isDown(Key.LEFT))
            this.player.move('W');
        else if(Key.isDown(Key.RIGHT))
            this.player.move('E');
            
        // TODO add diamonds movements
        
    };
    
    return PlayerControls;
}());