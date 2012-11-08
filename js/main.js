$(function() {
    //init
    var stage = new createjs.Stage(document.getElementById('canvas'));

    //other
    Holder.prototype = new createjs.Container();
    function Holder(adr,x,y)
    {
        console.log('hdhdh');
        createjs.Container.apply(this);
        this.bmp = new createjs.Bitmap(adr);
        this.bmp.x = x;
        this.bmp.y = y;
        this.bmp.regX = this.x + this.bmp.image.width/2;
        this.bmp.regY = this.y + this.bmp.image.height/2;
        this.addChild(this.bmp);
    };

    var h1 = new Holder('http://lorempixel.com/output/abstract-q-c-100-100-4.jpg', 100, 100);
    stage.addChild(h1);
    h1.alpha = 0.5;

    var h2 = new Holder('http://lorempixel.com/output/abstract-q-c-100-100-1.jpg', 300, 100);
    stage.addChild(h2);
             
    stage.update();
});

