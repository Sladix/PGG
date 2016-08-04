/*global PIXI*/
/*global MapGen*/
/*global mapGen*/
/*global Tile*/

var Room = (function () {
    function Room(_type,_width,_height,_x,_y) {
        this.type = _type;
        this.width = _width;
        this.height = _height;
        this.x = _x * MapGen.TILE_SIZE;
        this.y = _y * MapGen.TILE_SIZE;
        this.position = {x : _x, y : _y};
        this.roomTiles = [];
        this.borderTiles = [];
        this.doors = [];
        this.disconnectedRegions = [];
        
        //TODO ajouter une tinte générée
        
        this.left = Math.min(this.position.x, this.position.x + this.width);
        this.top = Math.min(this.position.y, this.position.y + this.height);
        this.right = Math.max(this.position.x, this.position.x + this.width);
        this.bottom = Math.max(this.position.y, this.position.y + this.height);
    }
    Room.prototype.generate = function()
    {
        for (var i = 0; i < this.width; i++ ) {
            for (var j = 0; j < this.height; j++ ) {
                mapGen._tiles[this.position.x + i][this.position.y + j].changeType(Tile.TYPE_GROUND);
                if( j == 0 || i == 0 || i == this.width - 1 || j == this.height -1 )
                {
                  this.borderTiles.push(mapGen._tiles[this.position.x + i][this.position.y + j]);
                }else
                {
                  this.roomTiles.push(mapGen._tiles[this.position.x + i][this.position.y + j]);
                }
                  
                this.roomTiles.push(mapGen._tiles[this.position.x + i][this.position.y + j]);
            }
        }
    };
    
    Room.prototype.setConnectedRegions = function(){
      for(var t in this.borderTiles){
        var index = this.borderTiles[t].getNearestRegionIndex();
        if(index !== false && this.disconnectedRegions.indexOf(index) === -1)
          this.disconnectedRegions.push(index)
      }
    }
    
    Room.prototype.distanceTo = function(other) {
        var vertical;
        if (this.top >= other.bottom) {
          vertical = this.top - other.bottom;
        } else if (this.bottom <= other.top) {
          vertical = other.top - this.bottom;
        } else {
          vertical = -1;
        }
    
        var horizontal;
        if (this.left >= other.right) {
          horizontal = this.left - other.right;
        } else if (this.right <= other.left) {
          horizontal = other.left - this.right;
        } else {
          horizontal = -1;
        }
    
        if ((vertical == -1) && (horizontal == -1)) return -1;
        if (vertical == -1) return horizontal;
        if (horizontal == -1) return vertical;
        return horizontal + vertical;
      }
    
    Room.TYPE_BASE = 0;
    Room.TYPE_L = 1;
    Room.MAX_R2R_DOORS = 3;
    Room.MIN_R2R_DOORS = 1;
    return Room;
}());