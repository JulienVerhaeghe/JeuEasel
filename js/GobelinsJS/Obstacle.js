(function(window) {

function Ball() {

  this.initialize();

}
//p est un raccourci
var p = Ball.prototype = new createjs.Container();



// public constante:

	Ball.TOGGLE = 60;

	Ball.MAX_THRUST = 2;

	Ball.MAX_VELOCITY = 5;



// public properties:


	p.BallBody;

	

	p.timeout;

	p.thrust;

	

	p.vX;

	p.vY;

	

	p.bounds;

	p.hit;

	

// constructor:

	p.Container_initialize = p.initialize;	//unique to avoid overiding base class

	

	p.initialize = function() {

		this.Container_initialize();

		this.BallBody = new createjs.Shape();

		this.addChild(this.BallBody);

		this.makeShape();

		this.timeout = 0;

		this.thrust = 0;

		this.vX = 4;

		this.vY = 4;

	}

	

// public methods:

	p.makeShape = function() {

		//draw Ball body

		var g = this.BallBody.graphics;

		g.clear();

		g.setStrokeStyle(1);
		g.beginStroke(createjs.Graphics.getRGB(0,255,0));
		g.beginFill(createjs.Graphics.getRGB(255,0,0));
		g.drawCircle(0,0,10);

		//furthest visual element

		this.bounds = 10; 

		this.hit = this.bounds;

	}

	
	p.verticalBounce = function(){
            console.log('vertical');
            this.vX = this.vX * (-1)
            
        }
    p.horizontalBounce = function(){
            console.log('horizontal');
            this.vY = this.vY * (-1)
    }
	p.tick = function() {

		//move by velocity

		this.x += this.vX;

		this.y += this.vY;
		
		//verifier si bounce
		if (this.y <= 0 ||  this.y >= 480) {
            this.horizontalBounce();
        }
        // si la balle touche le mur vertical
        else if( this.x <= 0 ||  this.x >= 640) {
            this.verticalBounce();
        }

		

	}

	

	



window.Ball = Ball;

}(window));