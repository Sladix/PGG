/*global PIXI*/
/*global TWEEN*/
/*global Utils*/
/*global rendererDimensions*/
var Mouse = {
    _isDown : {},
    _position : {},
    isDown: function(_e){
        
    },
    setPosition:function(pos){
        this._position = pos;
    },
    getPosition: function(){
        return this._position;
    }
}

var Camera = (function () {
    // Add tween to camera
    function Camera(_world,_viewportDimensions) {
        this.scale = Camera.DEFAULT_SCALE;
        this.world = _world;
        this.dimensions = _viewportDimensions;
        this.tween = new TWEEN.Tween(this.world.position);
        this.tween.onComplete(this.handleTweens);
        this.world.scale.set(this.scale);
        this.isMoving = false;
        this.queue = [];
        
        this.target = null;
        this.isFollowing = false;
        this.world.interactive = true;
        this.world.on('mousemove',this.onMouseMove);
    }
    Camera.prototype.update = function(){
        // Déplacement
        if(this.isFollowing && !this.isMoving)
        {
            //this.moveTo([this.target.graphics.position.x,this.target.graphics.position.y],3000,true);
            this.center([this.target.position.x,this.target.position.y]);
        }
        
        // Cacher les objets qui ne sont pas dans le viewport
    };
    
    Camera.prototype.onMouseMove = function(_e){
        //Mouse.setPosition(_e.data.global);
        
    }
    
    Camera.prototype.follow = function(_target){
        this.target = _target;
        this.isFollowing = true;
    };
    
    Camera.prototype.handleTweens = function(){
        console.log("moved");
        if(this.queue.length > 0)
        {
            this.tween = this.queue.shift();
            this.tween.start();
            this.isMoving = true;
        }
        else
            this.isMoving = false;
    }
    
    Camera.prototype.moveTo = function(_position,speed,center)
    {
        if(typeof center == undefined)
            center = false;
            
        if(typeof speed == undefined)
            speed = 1000;
            
        var self = this;
        var _x = (0-_position[0]) * this.scale ;
        var _y = (0-_position[1]) * this.scale ;
        if(center)
        {
            _x += this.dimensions.width/2;
            _y += this.dimensions.height/2;
        }
        var t = new TWEEN.Tween(this.world.position);
        t.easing(TWEEN.Easing.Cubic.InOut);
        
        t.onComplete(function(){
            self.handleTweens();
        });
        
        t.to({
            x:_x,
            y:_y
        },speed);
        
        if(this.isMoving)
            this.queue.push(t);
        else
        {
            this.tween = t;
            this.tween.start();
            this.isMoving = true;
        }
        
        return this;
    };
    Camera.prototype.mapTour = function(){
        this.isFollowing = false;
        this.moveTo([Math.floor(rendererDimensions.width - rendererDimensions.width/this.scale),0],1500*this.scale);
        this.moveTo([Math.floor(rendererDimensions.width - rendererDimensions.width/this.scale),Math.floor(rendererDimensions.height - rendererDimensions.height/this.scale)],1500*this.scale);
        this.moveTo([0,Math.floor(rendererDimensions.height - rendererDimensions.height/this.scale)],1500*this.scale);
        this.moveTo([0,0],1500*this.scale);
    };
    Camera.prototype.center = function(_position){
        var _x = (0-_position[0]) * this.scale + this.dimensions.width/2;
        var _y = (0-_position[1]) * this.scale + this.dimensions.height/2;
        
        if(_x > 0)
            _x = 0;
        if(_y > 0)
            _y = 0;
        
        if(_x < (0-rendererDimensions.width)*this.scale + rendererDimensions.width)
        {
            _x = (0-rendererDimensions.width)*this.scale + rendererDimensions.width;
        }
        if(_y < (0-rendererDimensions.height)*this.scale + rendererDimensions.height)
        {
            _y = (0-rendererDimensions.height)*this.scale + rendererDimensions.height;
        }
            
        this.world.position.x = Math.round(_x);
        this.world.position.y = Math.round(_y);
        return this;
    };
    
    Camera.prototype.zoomTo = function(_scale){
    };
    
    
    
    Camera.DEFAULT_SCALE = 4;
    
    return Camera;
}());