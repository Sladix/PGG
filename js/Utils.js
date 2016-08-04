/*global MapGen*/
/*global Random*/
function Utils(){};
Utils.r = new Random();
Utils.getIntRand = function(min,max){
    return this.r.integer(min,max);
};

Utils.intersects = function(rect1,rect2) {
    var x1 = rect1.x;
    var y1 = rect1.y;
    var h1 = rect1.height * MapGen.TILE_SIZE;
    var w1 = rect1.width * MapGen.TILE_SIZE;
    
    var x2 = rect2.x;
    var y2 = rect2.y;
    var h2 = rect2.height * MapGen.TILE_SIZE;
    var w2 = rect2.width * MapGen.TILE_SIZE;
    
    w2 += x2;
    w1 += x1;
    if (x2 > w1 || x1 > w2) return false;
    h2 += y2;
    h1 += y1;
    if (y2 > h1 || y1 > h2) return false;
  return true;
}