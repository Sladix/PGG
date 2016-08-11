/*global PIXI*/
/*global Bump */
/*global TWEEN*/
/*global resourcesManager*/
/*global p2*/
/*global MapGen*/
/*global enemyMaterial*/
/*global debug*/


var Player = (function () {
    
    
    Player = function (_position) {
        PIXI.Container.call(this);
    // 	this.size = Player.DEFAULT_SIZE;
    // 	this.allDirections = [];
    // 	var tempTexture;
    // 	this.currentAnimation;
    // 	for (var i = 0; i < 8; i++) {
    // 		var animationTextures = [];
    // 		for (var j = 0; j < 8; j++) {
    // 			tempTexture = new PIXI.Texture(this.texture, {x:j*this.size, y: i * this.size, width:this.size, height:this.size});
    // 			PIXI.TextureCache[(i*8)+j] = tempTexture;
    // 			animationTextures.push(tempTexture);
    // 		};
    // 		var oneWayAnimation = new PIXI.MovieClip(animationTextures);
    // 		oneWayAnimation.stop();
    // 		oneWayAnimation.visible = false;
    // 		if (i == 7)
    // 		{
    // 			oneWayAnimation.stop();
    // 			oneWayAnimation.visible = true;
    // 			this.currentAnimation = oneWayAnimation;
    
    // 		}
    // 		oneWayAnimation.position.x = 400-40;
    // 		oneWayAnimation.position.y = 300-40;
    // 		stage.addChild(oneWayAnimation);
    // 		this.allDirections.push(oneWayAnimation);
    // 	};
        
        //Player sprite
        this.sprite = new PIXI.Sprite(resourcesManager['player']);
        this.sprite.scale = {x:0.6,y:0.6};
        this.addChild(this.sprite);
        
        this.weapon = new PIXI.Graphics();
        this.weapon.height = 12;
        this.weapon.width = 2;
        this.weapon.beginFill(0X000000);
        this.weapon.drawRect(0,0,2,12);
        this.weapon.pivot.x = 1;
        this.weapon.pivot.y = 12;
        this.weapon.position.x = this.width/2;
        this.weapon.position.y = this.height/2;
        this.addChild(this.weapon);
        
        this.speed = Player.BASE_SPEED;
        
        //this.pivot = {x: 0- (MapGen.TILE_SIZE/2 - this.sprite.width/2),y:0-(MapGen.TILE_SIZE/2 - this.sprite.height/2)};
        
        this.position.x = _position[0] * MapGen.TILE_SIZE;
        this.position.y = _position[1] * MapGen.TILE_SIZE;
        
        this.pivot = {x: this.sprite.width/2,y:this.sprite.height/2};
        
        var box = new p2.Box({
            height:this.sprite.height,
            width:this.sprite.width,
        });
        this.body = new p2.Body({
            mass: 1,
            damping: 0.99,
            position:[this.position.x,this.position.y]
        });
        this.body.material = enemyMaterial;
        this.body.addShape(box);
        this.debug = new PIXI.Graphics();
        // set the line style to have a width of 5 and set the color to red
        this.debug.lineStyle(1, 0xFF0000);
        
        // draw a rectangle
        this.debug.drawRect(0, 0, this.body.shapes[0].width, this.body.shapes[0].height);
        
        debug.addChild(this.debug);
        this.debug.position.x = this.body.position[0];
        this.debug.position.y = this.body.position[1];
    }
    
    Player.prototype = Object.create( PIXI.Container.prototype );
    Player.prototype.constructor = Player;
    
    Player.prototype.update = function(){
            
        // TODO add diamonds movements
        this.position = {x:this.body.position[0]+this.sprite.width-1,y:this.body.position[1]+this.sprite.height-1};
        if(DEBUG_ACTIVE)
        {
            this.debug.position = {x:this.body.position[0]+this.pivot.x-1,y:this.body.position[1]+this.pivot.y-1};
        }
        
        //Rotate weapon if we have one
        var p = Mouse.getPosition();
        var direction = {x:p.x-this.position.x,y:p.y-this.position.y};
        
    }
    
    Player.prototype.move = function(_direction){
        var nextPosition = {
            x:this.position.x,
            y:this.position.y
        }
        if(_direction == 'N')
        {
            this.body.applyForce([0,0-this.speed]);
        }else if(_direction == 'S')
        {
            this.body.applyForce([0,this.speed]);
            
        }else if(_direction == 'E')
        {
            this.body.applyForce([this.speed,0]);
        }else if(_direction == 'W')
        {
            this.body.applyForce([0-this.speed,0]);
        }
        
    }
    Player.BASE_SPEED = 500;
    Player.DEFAULT_SIZE = 16;
    return Player;
}());