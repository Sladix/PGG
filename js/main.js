/*global PIXI*/
/*global Tile*/
/*global Camera*/
/*global Player*/
/*global PlayerControls*/
/*global MapGen*/
/*global TWEEN*/
/*global Bump*/
var BASE_URL = "https://pgg-sladix.c9users.io/";
//Degueu
var pc = null;
//Create the renderer
var rendererDimensions = {
    width:1008,
    height:784
}
var renderer = PIXI.autoDetectRenderer(rendererDimensions.width, rendererDimensions.height,{backgroundColor : 0xEFEFEF});
//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

var bump = new Bump(PIXI);
// Create a container object called the `stage`
var stage = new PIXI.Container();
// Create a ressource holder
var resourcesManager = {
    "tiles":[]
};

function onProgressCallback(data,obj){
    console.log("Progress : "+data.progress+"%");
}


PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
PIXI.loader.add('tiles', BASE_URL+'img/roguelikeCity_magenta.png')
            .add('characters', BASE_URL+'img/roguelikeChar_transparent.png')
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
                
                // Player
                resourcesManager["player"] = new PIXI.Texture(resources.characters.texture,new PIXI.Rectangle(0,0, 16, 16));
                initGame();
          });
var mapGen;
var camera;
var world = new PIXI.Container();
function initGame(){
    
    mapGen = new MapGen(Math.floor(renderer.width / MapGen.TILE_SIZE),Math.floor(renderer.height / MapGen.TILE_SIZE));
    // on génère la map
    mapGen.generate();
    
    // On Crée le joueur et on le place
    var player = new Player();
    player.spawn(mapGen.findPlayerPosition());
    
    
    pc = new PlayerControls(player);
    pc.enable();
    // On instancie la caméra et on se place sur le joueur
    camera = new Camera(world,rendererDimensions);
    camera.follow(player);
    // On rend le monde visible
    stage.addChild(world);
    
    
    
    
    // Tell the `renderer` to `render` the `stage`
    animate();
}
function resetMap(){
    mapGen.generate();
}

function animate(time) {
	
    requestAnimationFrame( animate );
    // render the stage
    renderer.render(stage);
    // Player controls update
    pc.update();
    // Camera update
    camera.update();
    // render the tweens
    TWEEN.update(time);
}