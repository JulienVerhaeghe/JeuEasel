(function(window) {

function Player() {

  this.initialize();

}
//p est un raccourci
var p = Player.prototype = new createjs.Container();


	p.bounds;

	p.hit;
	p.lastPoints;// va permettre de connaire la direction a donner à la balle

	

// constructor:

	p.Container_initialize = p.initialize;	

	

	p.initialize = function() {

		this.Container_initialize();

		this.PlayerBody = new createjs.Shape();

		this.addChild(this.PlayerBody);

		this.makeShape();

		this.lastPoints = new Array();

	}

	

// public methods:

	p.makeShape = function() {

		//draw Player body

		var g = this.PlayerBody.graphics;

		g.clear();

		g.setStrokeStyle(1);
		g.beginStroke(createjs.Graphics.getRGB(0,0,0));
		g.beginFill(createjs.Graphics.getRGB(255,255,255));
		g.drawCircle(0,0,40);

		this.bounds = 40; 

		this.hit = this.bounds;

	}

	p.tick = function() {

		
		// suivre la sourie
		this.x += (stage.mouseX - this.x ) * 0.1;
		this.y += (stage.mouseY - this.y ) * 0.1;

		// recuperer la ou l'on est pour a partir de deux point calculer une trajectoire
		this.lastPoints.push({ x: this.x, y: this.y });


	}

window.Player = Player;

}(window));