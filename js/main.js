/*global PIXI*/
/*global Tile*/
/*global Camera*/
/*global Player*/
/*global PlayerControls*/
/*global MapGen*/
/*global TWEEN*/
/*global p2*/
/*global rStats*/
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
var debug = new PIXI.Container();
var player;
var p2world;
var groundMaterial = new p2.Material(),
enemyMaterial = new p2.Material(),
characterMaterial = new p2.Material();
var rS = new rStats();

var DEBUG_ACTIVE = false;

function initGame(){
    
    mapGen = new MapGen(Math.floor(renderer.width / MapGen.TILE_SIZE),Math.floor(renderer.height / MapGen.TILE_SIZE));
    // on génère la map
    mapGen.generate();
    
    // On initialise le p2 monde
    p2world = new p2.World({
        gravity:[0, 0]
    });
    p2world.defaultContactMaterial.friction = 0;
    
    // On Crée le joueur et on le place
    var spawnLocation = mapGen.findPlayerPosition();
    player = new Player(spawnLocation);
    p2world.addBody(player.body);
    world.addChild(player);
    
    var dummy = new Player([spawnLocation[0]+1,spawnLocation[1]]);
    world.addChild(dummy);
    p2world.addBody(dummy.body);
    
    for(var m in mapGen.collidableTiles){
        p2world.addBody(mapGen.collidableTiles[m].body);
    }
    
    var charGroundCM = new p2.ContactMaterial(characterMaterial, groundMaterial,{
      friction : 0, // Between boxes and ground
    });
    p2world.addContactMaterial(charGroundCM);
    
    var charCharCM = new p2.ContactMaterial(characterMaterial, enemyMaterial,{
      friction : 0,
    });
    p2world.addContactMaterial(charCharCM);
    
    
    // On instancie la caméra et on se place sur le joueur
    camera = new Camera(world,rendererDimensions);
    camera.follow(player);
    
    // Contrôles du joueur
    pc = new PlayerControls(player);
    pc.enable();    
    
    p2world.on('postStep', function(){
        // Mouse position update
        // Enculé de calcul de merde
        var x = (renderer.plugins.interaction.mouse.global.x - camera.world.position.x) / camera.scale;
        var y = (renderer.plugins.interaction.mouse.global.y - camera.world.position.y) / camera.scale;
        Mouse.setPosition({x:x,y:y});
        
        // Player controls update
        pc.update();
        dummy.update();
        
        // Player update
        player.update();
    });
    
    //On ajoute je debug
    if(DEBUG_ACTIVE)
        world.addChild(debug);
        
    // On rend le monde visible
    stage.addChild(world);
    
    
    
    
    // Tell the `renderer` to `render` the `stage`
    animate();
}
function resetMap(){
    mapGen.generate();
}
var fixedTimeStep = 1 / 60; // seconds
var maxSubSteps = 10; // Max sub steps to catch up with the wall clock
var lastTime;
function animate(time) {
    rS( 'frame' ).start();
    rS( 'FPS' ).frame();
    var deltaTime = lastTime ? (time - lastTime) / 1000 : 0;

    rS( 'physics' ).start();  
    //Physics engine
    p2world.step(fixedTimeStep, deltaTime, maxSubSteps);
    rS( 'physics' ).end();

    rS( 'render' ).start();
    // render the stage
    renderer.render(stage);
    rS( 'render' ).end();
    
    // Camera update
    camera.update();
    
    // render the tweens
    TWEEN.update(time);
    
    //Stats
    rS( 'frame' ).end();
    rS().update();
    
    requestAnimationFrame( animate );
}