/*global PIXI*/
/*global Tile*/
/*global MapGen*/
var BASE_URL = "https://pgg-sladix.c9users.io/";

//Create the renderer
var renderer = PIXI.autoDetectRenderer(1008, 784,{backgroundColor : 0xFFFFFF});
//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

// Create a container object called the `stage`
var stage = new PIXI.Container();
var mapGen = new MapGen();
// Create a ressource holder
var resourcesManager = {
    "tiles":[]
};

function onProgressCallback(data,obj){
    console.log("Progress : "+data.progress+"%");
}

function animate() {
	
    requestAnimationFrame( animate );
    // render the stage   
   	
    renderer.render(stage);
}

function initGame(){ 
  mapGen.generate();
}
PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
PIXI.loader.add('tiles', BASE_URL+'img/roguelikeCity_magenta.png')
          .on('progress', onProgressCallback)
          .load(function (loader, resources) {
              
              // TODO ajouter des corner tiles pour le sol des pièces
              resourcesManager["tiles"][Tile.TYPE_GROUND] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(374,0, 16, 16));
              
              // Tiles des murs
              resourcesManager["tiles"][Tile.TYPE_WALL] = {};
              resourcesManager["tiles"][Tile.TYPE_WALL]['N'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(34+136,0, 16, 16));
              resourcesManager["tiles"][Tile.TYPE_WALL]['S'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(34+136,17, 16, 16));
              resourcesManager["tiles"][Tile.TYPE_WALL]['W'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(51+136,0, 16, 16));
              resourcesManager["tiles"][Tile.TYPE_WALL]['E'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(51+136,17,16,16));
              
              // Corners
              resourcesManager["tiles"][Tile.TYPE_WALL]['NW'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(0+136,0,16,16));
              resourcesManager["tiles"][Tile.TYPE_WALL]['NE'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(17+136,0,16,16));
              resourcesManager["tiles"][Tile.TYPE_WALL]['SW'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(0+136,17,16,16));
              resourcesManager["tiles"][Tile.TYPE_WALL]['SE'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(17+136,17,16,16));
              
              // T
              resourcesManager["tiles"][Tile.TYPE_WALL]['TE'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(102+136,34,16,16));
              resourcesManager["tiles"][Tile.TYPE_WALL]['TW'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(102+136,51,16,16));
              resourcesManager["tiles"][Tile.TYPE_WALL]['TN'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(119+136,34,16,16));
              resourcesManager["tiles"][Tile.TYPE_WALL]['TS'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(119+136,51,16,16));
              
              // Couloirs up/down east/west
              resourcesManager["tiles"][Tile.TYPE_WALL]['NS'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(51+136,51,16,16));
              resourcesManager["tiles"][Tile.TYPE_WALL]['WE'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(34+136,34,16,16));
              
              // Dead Ends
              resourcesManager["tiles"][Tile.TYPE_WALL]['DN'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(0+136,34,16,16));
              resourcesManager["tiles"][Tile.TYPE_WALL]['DS'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(0+136,51,16,16));
              resourcesManager["tiles"][Tile.TYPE_WALL]['DE'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(51+136,34,16,16));
              resourcesManager["tiles"][Tile.TYPE_WALL]['DW'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(17+136,34,16,16));
              
              // Center tile
              resourcesManager["tiles"][Tile.TYPE_WALL]['C'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(102+136,0,16,16)); // Tile au centre
              
              // Tiles du sol (chemins)
              // -170 sur x pour avoir la pelouse
              resourcesManager["tiles"][Tile.TYPE_FLOOR] = {};
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['N'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(187,425,16,16));
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['S'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(187,459,16,16));
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['E'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(204,442,16,16));
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['W'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(170,442,16,16));
              
              // Corners
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['NW'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(170,425,16,16));
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['NE'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(204,425,16,16));
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['SW'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(170,459,16,16));
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['SE'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(204,459,16,16));
              
              // T
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['TE'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(289,425,16,16));
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['TW'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(306,425,16,16));
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['TN'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(289,442,16,16));
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['TS'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(306,442,16,16));
              
              // Couloirs up/down east/west
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['NS'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(323,425,16,16));
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['WE'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(323,442,16,16));
              
              // Dead Ends
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['DN'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(255,459,16,16));
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['DS'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(289,459,16,16));
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['DE'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(272,459,16,16));
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['DW'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(306,459,16,16));
              
              // Center Tile
              resourcesManager["tiles"][Tile.TYPE_FLOOR]['C'] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(187,442,16,16));
              
              resourcesManager["tiles"][Tile.TYPE_DOOR] = new PIXI.Texture(resources.tiles.texture,new PIXI.Rectangle(102,17, 16, 16));
              initGame();
          });

// Tell the `renderer` to `render` the `stage`
animate();