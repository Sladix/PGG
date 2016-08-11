/*global PIXI*/
/*global MapGen*/
/*global mapGen*/
/*global p2*/
/*global resourcesManager*/
/*global groundMaterial*/

/*global debug*/

var Tile = (function () {
    function Tile(_type,_x,_y) {
        this.type = _type;
        this.region = 0;
        this.position = {x:_x,y:_y};
        this.connectedTo = null;
        this.debug = null;
    }
    
    Tile.prototype.display = function(){
        this.graphics = new PIXI.Sprite();
        this.graphics.position.x = this.position.x * MapGen.TILE_SIZE;
        this.graphics.position.y = this.position.y * MapGen.TILE_SIZE;
        if(this.type == Tile.TYPE_FLOOR || this.type == Tile.TYPE_WALL){
            // Trouver quelle tile on affiche pour ce bout de mur
            var index = this.getTileIndex();
            this.graphics.texture = resourcesManager["tiles"][this.type][index];
            if(index != 'C' && this.type == Tile.TYPE_WALL)
            {
                var tile = new p2.Box({
                    width:MapGen.TILE_SIZE,
                    height:MapGen.TILE_SIZE,
                });
                this.body = new p2.Body({
                    mass: 0,
                    position : [this.graphics.position.x,this.graphics.position.y]
                });
                this.body.type = p2.Body.KINEMATIC;
                this.body.addShape(tile);
                this.body.material = groundMaterial;
                this.debug = new PIXI.Graphics();
                // set the line style to have a width of 5 and set the color to red
                this.debug.lineStyle(1, 0x0000FF);
                
                // draw a rectangle
                this.debug.drawRect(this.body.position[0], this.body.position[1], this.body.shapes[0].width, this.body.shapes[0].height);
                
                debug.addChild(this.debug);
                
                mapGen.collidableTiles.push(this);
            }
        }else{
            this.graphics.texture = resourcesManager["tiles"][this.type];
        }
        
        mapGen.tilesContainer.addChild(this.graphics);
    }
    
    Tile.prototype.changeType = function(_newType){
        this.type = _newType;
        if(this.type == Tile.TYPE_GROUND)
            this.region = Tile.ROOM_REGION;
        return this;
    };
    
    Tile.prototype.setRegion = function(regionIndex){
        this.region = regionIndex;
        return this;
    }
    
    Tile.prototype.getNearestRegionIndex = function(){
        var tiles = this.getNeighborsTiles(2);
        for(var t in tiles){
            if(tiles[t].type == Tile.TYPE_FLOOR && tiles[t].region != -1)
                return tiles[t].region;
        }
        return false;
    }
    
    Tile.prototype.getOpenable = function(){
        //get surrounding tiles
        var neighbors = this.getNeighborsTiles();
        for(var n in neighbors){
            var openable = false;
            var connectedTo = -1;
            if(neighbors[n].type == Tile.TYPE_WALL)
            {
                var nn = neighbors[n].getNeighborsTiles();
                for(var ln in nn)
                {
                    if(nn[ln].type == Tile.TYPE_FLOOR || nn[ln].type == Tile.TYPE_GROUND && nn[ln] != this)
                    {
                        openable = true;
                        connectedTo = nn[ln].region;
                    }
                        
                    
                    if(nn[ln].type == Tile.TYPE_DOOR)
                        openable = false;
                }
                if(openable)
                {
                    neighbors[n].connectedTo = connectedTo;
                    return neighbors[n];
                    
                }
            }
        }
        return false;
    }  
    
    Tile.prototype.getTileIndex = function(){
        var neighbors = this.getOrderedNeighborsTiles();
        // Indexes :
        // 0 : S
        // 1 : N
        // 2 : E
        // 3 : W
        // 4 : SW
        // 5 : NW
        // 6 : SE
        // 7 : NE
        var walls = 0;
        for(var n in neighbors){
            if(neighbors[n].type == this.type)
                walls++;
        }
        if(walls == 3){
            // T blocks
            var diags = this.getDiagonalNeighbors();
            var aw = 0;
            for(var d in diags){
                if(diags[d].type == this.type)
                    aw++;
            }
            if(aw == 0)
            {
                if(neighbors['N'] && neighbors['N'].type != this.type)
                    return 'TS';
                else if (neighbors['S'] && neighbors['S'].type != this.type)
                    return 'TN';
                else if (neighbors['W'] && neighbors['W'].type != this.type)
                    return 'TE';
                else if (neighbors['E'] && neighbors['E'].type != this.type)
                    return 'TW';
            }
            
            //Edge
            if((neighbors['E'] && neighbors['E'].type != this.type) || !neighbors['E']){
                return 'E';
            }else if((neighbors['S'] && neighbors['S'].type != this.type) || !neighbors['S']){
                return 'S';
            }else if((neighbors['N'] && neighbors['N'].type != this.type) || !neighbors['N']){
                return 'N';
            }else if((neighbors['W'] && neighbors['W'].type != this.type) || !neighbors['W']){
                return 'W';
            }
        }else if(walls == 2){
            // Angle
            if(neighbors['S'] && neighbors['E'] && neighbors['S'].type == this.type && neighbors['E'].type == this.type)
            {
                return 'NW';
            }else if(neighbors['N'] && neighbors['E'] && neighbors['N'].type == this.type && neighbors['E'].type == this.type){
                return 'SW';
            }else if(neighbors['S'] && neighbors['W'] && neighbors['S'].type == this.type && neighbors['W'].type == this.type){
                return 'NE';
            }else if(neighbors['N'] && neighbors['W'] && neighbors['N'].type == this.type && neighbors['W'].type == this.type){
                return 'SE';
            }
            // Bordures
            if(neighbors['N'] && neighbors['S'] && neighbors['N'].type == this.type && neighbors['S'].type == this.type){
                return 'NS';
            }else if(neighbors['E'] && neighbors['W'] && neighbors['E'].type == this.type && neighbors['W'].type == this.type){
                return 'WE';
            }
        }else if(walls == 1){
            // Cul de sac ou a côté d'une porte
            if(neighbors['W'] && neighbors['W'].type == this.type)
                return 'DE';
            else if(neighbors['E'] && neighbors['E'].type == this.type)
                return 'DW';
            else if (neighbors['N'] && neighbors['N'].type == this.type)
                return 'DS';
            else if(neighbors['S'] && neighbors['S'].type == this.type)
                return 'DN';
            
        }
        return 'C';
    }
    
    Tile.prototype.getOrderedNeighborsTiles = function(_distance){
        if(typeof _distance == "undefined")
            _distance = 1;
            
        var tiles = {};
        if(this.position.y+_distance <= mapGen.maxYm - 1)
        {
            tiles['S'] = mapGen._tiles[this.position.x][this.position.y+_distance];
        }
        if(this.position.y-_distance >= 0)
        {
            tiles['N'] = mapGen._tiles[this.position.x][this.position.y-_distance];
        }    
        if(this.position.x+_distance <= mapGen.maxXm - 1)
        {
            tiles['E'] = mapGen._tiles[this.position.x+_distance][this.position.y];
        }
        if(this.position.x-_distance >= 0)
        {
            tiles['W'] = mapGen._tiles[this.position.x-_distance][this.position.y];
        }
        return tiles;
    }
    
    Tile.prototype.getNeighborsTiles = function(_distance){
        if(typeof _distance == "undefined")
            _distance = 1;
            
        var tiles = [];
        if(this.position.y+_distance <= mapGen.maxYm - 1)
        {
            tiles.push(mapGen._tiles[this.position.x][this.position.y+_distance]);
        }
        if(this.position.y-_distance >= 0)
        {
            tiles.push(mapGen._tiles[this.position.x][this.position.y-_distance]);
        }    
        if(this.position.x+_distance <= mapGen.maxXm - 1)
        {
            tiles.push(mapGen._tiles[this.position.x+_distance][this.position.y]);
        }
        if(this.position.x-_distance >= 0)
        {
            tiles.push(mapGen._tiles[this.position.x-_distance][this.position.y]);
        }
        return tiles;
    }
    
    Tile.prototype.getDiagonalNeighbors = function(){
        var tiles = {};
        //SW
        if(this.position.x-1 >= 0 && this.position.y-1 >= 0)
            tiles['SW'] = mapGen._tiles[this.position.x-1][this.position.y-1];
        
        //NW
        if(this.position.x-1 >= 0 && this.position.y+1 <= mapGen.maxYm -1)
            tiles['NW'] = mapGen._tiles[this.position.x-1][this.position.y+1];
        
        //SE
        if(this.position.x+1 <= mapGen.maxXm -1 && this.position.y-1 > 0)
            tiles['SE'] = mapGen._tiles[this.position.x+1][this.position.y-1];    
        
        //NE  
        if(this.position.x+1 <= mapGen.maxXm -1 && this.position.y+1 <= mapGen.maxYm -1)
            tiles['NE'] = mapGen._tiles[this.position.x+1][this.position.y+1];
            
        return tiles;
    }
    
    Tile.getTileAt = function(pos){
        var position = {
          x:0,
          y:0
        };
        
        position.x = Math.floor(pos.x/MapGen.TILE_SIZE);
        position.y = Math.floor(pos.y/MapGen.TILE_SIZE);
        
        return mapGen._tiles[position.x][position.y];
    }
    Tile.ROOM_REGION = -2;
    Tile.TYPE_WALL = 1;
    Tile.TYPE_GROUND = 0;
    Tile.TYPE_FLOOR = 2;
    Tile.TYPE_DOOR = 3;
    
    return Tile;
}());
