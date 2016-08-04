/*global PIXI*/
/*global Tween*/

var Camera = (function () {
    // Add tween to camera
    function Camera(_world,_viewportDimensions) {
        this.scale = Camera.DEFAULT_SCALE;
        this.world = _world;
        this.dimensions = _viewportDimensions;
        this.world.scale.set(this.scale);
    }
    Camera.prototype.center = function(_position)
    {
        var _x = (0-_position[0]) * this.scale + this.dimensions.width / 2;
        var _y = (0-_position[1]) * this.scale + this.dimensions.height / 2;
        var tween = PIXI.tweenManager.createTween(this.world);
        tween.time = 1000;
        // Le tween est supprimé quand il est terminé
        tween.expire = true;
        tween.easing = PIXI.tween.Easing.inOutQuad();
        tween.to({
            position:{
                x:_x,
                y:_y
            }
        });
        tween.start();
    };
    Camera.prototype.zoomTo = function(_scale){
        
    }
    Camera.DEFAULT_SCALE = 2;
    
    return Camera;
}());