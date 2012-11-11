(function(window) {

function Ball() {

  this.initialize();

}
//p est un raccourci
var p = Ball.prototype = new createjs.Container();

// public properties:

	p.BallBody;
	
	p.vX;

	p.vY;	

	p.bounds;

	p.hit;
	
	p.largeurDeplacement;

	p.hauteurDeplacement;

// constructor:

	p.Container_initialize = p.initialize;	//unique to avoid overiding base class

	

	p.initialize = function() {

		this.Container_initialize();

		this.BallBody = new createjs.Shape();

		this.addChild(this.BallBody);

		this.makeShape();
		
		this.vX = 4;

		this.vY = 4;

	}

	

// public methods:

	p.makeShape = function() {

		//Cercle

		var g = this.BallBody.graphics;

		g.clear();

		g.setStrokeStyle(1);
		g.beginStroke(createjs.Graphics.getRGB(0,255,0));
		g.beginFill(createjs.Graphics.getRGB(255,0,0));
		g.drawCircle(0,0,10);

		//radius pour savoir si on touche ou pas

		this.bounds = 10; 

		this.hit = this.bounds;

	}

	// faire un rebond vertical
	p.verticalBounce = function(){
        this.vX = this.vX * (-1)
    }
	// idem horizontal    
    p.horizontalBounce = function(){
        this.vY = this.vY * (-1)
    }
    p.hitRadius = function(tX, tY, tHit) {

		// savoir si il est en dehors de la zone hauteur largeur

		if(tX - tHit > this.x + this.hit) { return  'not'; }

		if(tX + tHit < this.x - this.hit) { return  'not'; }

		if(tY - tHit > this.y + this.hit) { return  'not'; }

		if(tY + tHit < this.y - this.hit) { return  'not'; }
		
		//verifier les bords arrondiees
		return this.hit + tHit > Math.sqrt(Math.pow(Math.abs(this.x - tX),2) + Math.pow(Math.abs(this.y - tY),2));

	},
	//limitter le déplacement de a balle sur une hauteur et une taille donné
	
	p.constrainBall = function(largeur,hauteur){
		
		this.largeurDeplacement = largeur;
		
		this.hauteurDeplacement = hauteur;
		
	},
	p.tick = function(player) {
		
		// deplacer
		this.x += this.vX;

		this.y += this.vY;
		
		//verifier si bounce
		if (this.y <= 0 ||  this.y >= this.hauteurDeplacement) {
			if(this.y <= 0 ){
				this.y = 0;
			}else{
				this.y = this.hauteurDeplacement;
			}
            this.horizontalBounce();
            
        }
        // si la balle touche le mur vertical
        else if( this.x <= 0 ||  this.x >= this.largeurDeplacement) {
        	if(this.x <= 0 ){
        		this.x = 0;
        	}else{
        		this.x = this.largeurDeplacement;
        	}
            this.verticalBounce();
            
        }
      

		

	}

	

	



window.Ball = Ball;

}(window));