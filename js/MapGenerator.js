/*global PIXI*/
/*global Utils*/
/*global Room*/
/*global Tile*/
/*global resourcesManager*/
/*global renderer*/
/*global stage*/
var MapGen = (function () {
    function MapGen() {
        this.tilesContainer = new PIXI.Container();
        this.maxXm = Math.floor(renderer.width / MapGen.TILE_SIZE);
        this.maxYm = Math.floor(renderer.height / MapGen.TILE_SIZE);
    }
    
    MapGen.prototype.reset = function(){
        this.roomRefs = [];
        this._tiles = [];
        this.regionIndex = 0;
        this.pathRegions = [];
        if(this.tilesContainer.children.length > 0)
        {
            stage.removeChild(this.tilesContainer);
            this.tilesContainer.destroy();
        }
        this.tilesContainer = new PIXI.Container();
    };
    
    MapGen.prototype.generate = function(){
        // On vide le conteneur
        this.reset();
        
        // On rempli les tiles avec des murs
        for(var x = 0; x < this.maxXm ;x++){
            this._tiles[x] = [];
            for(var y = 0; y < this.maxYm ;y++){
                var tile = new Tile(Tile.TYPE_WALL,x,y);
                this._tiles[x][y] = tile;
            }
        }
        // On ajoute les pièces
        this._addRooms();
        
        // Todo auto carve
        this.carveCorridors();
        
        // On crée des portes pour chaque salle (1-3)
        this.createConnections();
        
        // On enlève les dead ends
        this.removeDeadEnds();
        
        // On reconnecte quelques chemins
        this.prettyCorridors();
        
        // On peuple les pièces
        
        //On affiche les tiles
        this.displayTiles();
        
        // On ajoute la carte à la stage (elle sera cachée)
        stage.addChild(this.tilesContainer);
        
    };
    MapGen.prototype.displayTiles = function(){
        for(var x in this._tiles){
            for(var y in this._tiles[x]){
                this._tiles[x][y].display();
            }
        }
    };
    MapGen.prototype.display = function()
    {
        this.tilesContainer.visible = true;   
    };
    MapGen.prototype.carveCorridors = function(){
        // On cherche la première cellule vide 
        /*---------------------------------------*/
        for (var y = 1; y < this.maxYm; y += 2) {
          for (var x = 1; x < this.maxXm; x += 2) {
            if (this._tiles[x][y].type != Tile.TYPE_WALL) continue;
            this.carve([x,y]);
          }
        }
    };
    
    MapGen.prototype.createConnections = function(){
        // pour chaque salle, on crée une porte
        for(var r in this.roomRefs)
        {
            this.roomRefs[r].setConnectedRegions();
            var tiles = this.roomRefs[r].borderTiles;
            
            // Ajouter a la room un tableau d'index de regions
            var tries = 20;
            while(this.roomRefs[r].disconnectedRegions.length > 0)
            {
                // On évite de partir dans une boucle infini parce que c'est pas cool
                if(tries <= 0)
                    break;
                    
                var t = Utils.r.pick(tiles);
                var d = t.getOpenable();
                var index = this.roomRefs[r].disconnectedRegions.indexOf(d.connectedTo);
                
                if(d && index !== -1)
                {
                    d.changeType(Tile.TYPE_DOOR);
                    this.roomRefs[r].doors.push(d);
                    this.roomRefs[r].disconnectedRegions.splice(index, 1);
                    tries = 20;
                }else{
                    tries--;
                }
            }
            
            // On ajoute les portes entre les salles
                // On évite de partir dans une boucle infini parce que c'est pas cool;
                    
            var t = Utils.r.pick(tiles);
            var d = t.getOpenable();
            
            if(d)
            {
                var nbr = 0;
                var neighbors = d.getNeighborsTiles();
                for(var n in neighbors){
                    if(neighbors[n].type == Tile.TYPE_GROUND)
                        nbr++;
                }
                
                if( nbr == 2 )
                {
                    d.changeType(Tile.TYPE_DOOR);
                    this.roomRefs[r].doors.push(d);
                }
            }
            
        
            
            //TODO ajouter des connexions entre les salles parfois
        }
    };
    
    MapGen.prototype.removeDeadEnds = function(){
        // supprime une bonne partie des culs de sac
        for(var z = 0; z < 100; z++)
        {
            var removed = 0;
            for(var x in this._tiles){
                for(var y in this._tiles[x])
                {
                    if(this._tiles[x][y].type == Tile.TYPE_FLOOR)
                    {
                        
                        var neighbors = this._tiles[x][y].getNeighborsTiles();
                        var walls = 0;
                        for(var n in neighbors){
                            if(neighbors[n].type == Tile.TYPE_WALL)
                                walls++;
                        }
                        if(walls == 3)
                        {
                            //console.log(this._tiles[x][y]);
                            this._tiles[x][y].setRegion(0).changeType(Tile.TYPE_WALL);
                            removed++;
                        }
                    }
                }
            }
            if(removed == 0)
                break;
        }
        
    };
    
    MapGen.prototype.prettyCorridors = function(){
        var tries = 5;
        for(var i = 0; i < tries;i++){
            // On cherche un mur avec 2 corridor autour de lui et on en fait un corridor
            for(var x = 2;x<this.maxXm -1;x++){
                for(var y = 2;y<this.maxYm -1;y++){
                    if(this._tiles[x][y].type == Tile.TYPE_WALL){
                        //Check si il a deux voisins floor
                        var neighbors = this._tiles[x][y].getNeighborsTiles(1);
                        var count = 0;
                        var region = -1;
                        for (var n in neighbors){
                            if(neighbors[n].type == Tile.TYPE_FLOOR)
                            {
                                count++;
                                region = neighbors[n].region;
                            }
                                
                        }
                        if(count ==3)
                            this._tiles[x][y].setRegion(region).changeType(Tile.TYPE_FLOOR);
                    }
                }
            }
        }
    };
    
    
    MapGen.prototype._addRooms = function () {
        for(var i = 0; i < MapGen.ROOM_MAX_TRIES ; i++){
            
            var w = Math.floor(Utils.getIntRand(MapGen.MIN_ROOM_WIDTH,MapGen.MAX_ROOM_WIDTH) / 2) * 2 + 1;
            var h = Math.floor(Utils.getIntRand(MapGen.MIN_ROOM_HEIGHT,MapGen.MAX_ROOM_HEIGHT) / 2) * 2 + 1;
            // on mets à 1,-1 pour éviter qu'une sale touche le bord
            var x = Math.floor(Utils.getIntRand(0,this.maxXm - w - 2) / 2) * 2 + 1;
            var y = Math.floor(Utils.getIntRand(0,this.maxYm - h - 2) / 2) * 2 + 1;
            var room = new Room(Room.TYPE_BASE,w,h,x,y);
            
            var overlaps = false;
            for(var other in this.roomRefs)
            {
                if(room.distanceTo(this.roomRefs[other]) <= 0)
                {
                    overlaps = true;
                    break;
                }
            }
            
            if(overlaps === true)
                continue;
            room.generate();
            this.roomRefs.push(room);
        }
        
    };
    MapGen.prototype.addTile = function(x,y,_tile){
        this._tiles[x][y] = _tile;
    };

    MapGen.prototype.checkNeighborsEmpty = function(pos){
        // 0 == vertical
        // 1 == horizontal
        if(pos[1] >= this.maxYm -1 || pos[0] >= this.maxXm -1 || pos[0] <= 0 || pos[1] <= 0)
            return false;
        
        var empties = 0;
        // Get all 4 neighbors
        if(pos[1]+1 < this.maxYm -1)
        {
            empties += (this._tiles[pos[0]][pos[1]+1].type == Tile.TYPE_WALL)?1:0;
            empties += (this._tiles[pos[0]][pos[1]+1].type == Tile.TYPE_GROUND)?-2:0;
        }
        if(pos[1]-1 > 0)
        {
            empties += (this._tiles[pos[0]][pos[1]-1].type == Tile.TYPE_WALL)?1:0;
            empties += (this._tiles[pos[0]][pos[1]-1].type == Tile.TYPE_GROUND)?-2:0;
        }    
        if(pos[0]+1 < this.maxYm -1)
        {
            empties += (this._tiles[pos[0]+1][pos[1]].type == Tile.TYPE_WALL)?1:0;
            empties += (this._tiles[pos[0]+1][pos[1]].type == Tile.TYPE_GROUND)?-2:0;
        }
        if(pos[0]-1 > 0)
        {
            empties += (this._tiles[pos[0]-1][pos[1]].type == Tile.TYPE_WALL)?1:0;
            empties += (this._tiles[pos[0]-1][pos[1]].type == Tile.TYPE_GROUND)?-2:0;
        }
        
        // On enlève plus de points si un bout de salle est en diagonale
        if(pos[0]-1 > 0 && pos[1]-1 > 0)
            empties += (this._tiles[pos[0]-1][pos[1]-1].type == Tile.TYPE_GROUND)?-3:0;
        
        if(pos[0]-1 > 0 && pos[1]+1 < this.maxYm -1)
            empties += (this._tiles[pos[0]-1][pos[1]+1].type == Tile.TYPE_GROUND)?-3:0;
            
        if(pos[0]+1 < this.maxXm -1 && pos[1]-1 > 0)
            empties += (this._tiles[pos[0]+1][pos[1]-1].type == Tile.TYPE_GROUND)?-3:0;    
            
        if(pos[0]+1 < this.maxXm -1 && pos[1]+1 < this.maxYm -1)
            empties += (this._tiles[pos[0]+1][pos[1]+1].type == Tile.TYPE_GROUND)?-3:0;
            
        return (empties>=2)?true:false;
    };
    
    // On crée le labyrinthe
    MapGen.prototype.carve = function(position){
        this.regionIndex++;
        if(this.regionIndex >= resourcesManager["tiles"][Tile.TYPE_FLOOR].length)
        {
            this.regionIndex = 0;
        }
        this.pathRegions[this.regionIndex] = [];
        this._tiles[position[0]][position[1]].changeType(Tile.TYPE_FLOOR).setRegion(this.regionIndex);
        var carverMoves = [position];
        while(carverMoves.length > 0)
        {
            var pos = carverMoves[carverMoves.length-1];
            var possibleDirections = [];
            // TODO check qu'on carve pas juste à côté d'un mur
            
            var targetYS = pos[1] + 2;
            var targetYN = pos[1] - 2;
            var targetXW = pos[0] - 2;
            var targetXE = pos[0] + 2;
            
            var emptyVerticalW = this.checkNeighborsEmpty([targetXW,pos[1]]);
            var emptyVerticalE = this.checkNeighborsEmpty([targetXE,pos[1]]);
            
            var emptyHorizontalS = this.checkNeighborsEmpty([pos[0],targetYS]);
            var emptyHorizontalN = this.checkNeighborsEmpty([pos[0],targetYN]);
            
            // console.log("Empty vertical West : "+emptyVerticalW+" coords :"+targetXW+","+pos[1]);
            // console.log("Empty vertical Est : "+emptyVerticalE+" coords :"+targetXE+","+pos[1]);
            // console.log("Empty horizontal South : "+emptyHorizontalS+" coords :"+pos[0]+","+targetYS);
            // console.log("Empty horizontal North : "+emptyHorizontalN+" coords :"+pos[0]+","+targetYN);
            
            if(emptyHorizontalS && targetYS > 0 && targetYS < this.maxYm - 1 && this._tiles[pos[0]][targetYS].type == Tile.TYPE_WALL){
                 possibleDirections.push("S");
            }
            if(emptyHorizontalN && targetYN > 0 && targetYN < this.maxYm - 1 && this._tiles[pos[0]][targetYN].type == Tile.TYPE_WALL){
                 possibleDirections.push("N");
            }
            if(emptyVerticalW && targetXW > 0 && targetXW < this.maxXm - 1 && this._tiles[targetXW][pos[1]].type == Tile.TYPE_WALL){
                 possibleDirections.push("W");
            }
            if(emptyVerticalE && targetXE > 0 && targetXE < this.maxXm - 1 && this._tiles[targetXE][pos[1]].type == Tile.TYPE_WALL){
                 possibleDirections.push("E");
            }
            if(possibleDirections.length > 0){
                var move = Utils.getIntRand(0, possibleDirections.length);
                var posX = pos[0];
                var posY = pos[1];
                var tile1;
                var tile2;
                switch (possibleDirections[move]){
                      case "N": 
                           tile1 = this._tiles[posX][posY - 2];
                           tile2 = this._tiles[posX][posY - 1];
                           tile1.setRegion(this.regionIndex).changeType(Tile.TYPE_FLOOR);
                           tile2.setRegion(this.regionIndex).changeType(Tile.TYPE_FLOOR);
                           posY -= 2;
                           break;
                      case "S":
                           tile1 = this._tiles[posX][posY + 2];
                           tile2 = this._tiles[posX][posY + 1];
                           tile1.setRegion(this.regionIndex).changeType(Tile.TYPE_FLOOR);
                           tile2.setRegion(this.regionIndex).changeType(Tile.TYPE_FLOOR);
                           posY += 2;
                           break;
                      case "W":
                           tile1 = this._tiles[posX - 2][posY];
                           tile2 = this._tiles[posX - 1][posY];
                           tile1.setRegion(this.regionIndex).changeType(Tile.TYPE_FLOOR);
                           tile2.setRegion(this.regionIndex).changeType(Tile.TYPE_FLOOR);
                           posX -= 2;
                           break;
                      case "E":
                           tile1 = this._tiles[posX + 2][posY];
                           tile2 = this._tiles[posX + 1][posY];
                           tile1.setRegion(this.regionIndex).changeType(Tile.TYPE_FLOOR);
                           tile2.setRegion(this.regionIndex).changeType(Tile.TYPE_FLOOR);
                           posX += 2;
                           break;         
                 }
                 carverMoves.push([posX,posY]);
                 this.pathRegions[this.regionIndex].push(tile1);
                 this.pathRegions[this.regionIndex].push(tile2);
            }else{
                carverMoves.pop();
            }
        }
        return true;
    };
    
    
    MapGen.TILE_SIZE = 16;
    MapGen.MIN_ROOM_WIDTH = 2;
    MapGen.MAX_ROOM_WIDTH = 14;
    MapGen.MIN_ROOM_HEIGHT = 2;
    MapGen.MAX_ROOM_HEIGHT = 14;
    MapGen.ROOM_MAX_TRIES = 200;
    return MapGen;
}());
