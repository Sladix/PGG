/*global characterMaterial*/
/*global DEBUG_ACTIVE*/
/*global camera*/
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
        this.player.body.material = characterMaterial;
    }
    
    PlayerControls.prototype.enable = function(){
        this.enabled = true;
    };   
    
    PlayerControls.prototype.update = function(){
        if(!this.enabled)
            return;
        
        
        if(Key.isDown(Key.UP))
            this.player.move('N');
        if(Key.isDown(Key.DOWN))
            this.player.move('S');
        if(Key.isDown(Key.LEFT))
            this.player.move('W');
        if(Key.isDown(Key.RIGHT))
            this.player.move('E');
        
    };
    
    return PlayerControls;
}());