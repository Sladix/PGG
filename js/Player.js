/*global PIXI*/
/*global Bump */
/*global world */
/*global TWEEN*/
/*global resourcesManager*/
/*global MapGen*/

var Player = (function () {
    function Player(_position) {
        this.speed = Player.BASE_SPEED;
        
    }
    
    Player.prototype.spawn = function(_position){
        this.graphics = new PIXI.Sprite(resourcesManager["player"]);
        this.graphics.anchor.x = 0.5;
        this.graphics.anchor.y = 0.5;
        this.graphics.scale = {x:0.6,y:0.6};
        this.graphics.position.x = _position[0] * MapGen.TILE_SIZE;
        this.graphics.position.y = _position[1] * MapGen.TILE_SIZE;
        this.position = this.graphics.position;
        world.addChild(this.graphics);
    };
    
    Player.prototype.move = function(_direction){
        if(_direction == 'N')
        {
            this.graphics.position.y -= this.speed;
        }else if(_direction == 'S')
        {
            this.graphics.position.y += this.speed;
            
        }else if(_direction == 'E')
        {
            this.graphics.position.x += this.speed;
        }else if(_direction == 'W')
        {
            this.graphics.position.x -= this.speed;
        }
        
        this.position = this.graphics.position;
    }
    Player.BASE_SPEED = 1.5;
    return Player;
}());