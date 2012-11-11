(function ($) {
	window.Game = {
		version : 1.2,
		
		// Propriétés avec valeur par défaut
		HEIGHT : 480,
		WIDTH  : 640,
		preload : new createjs.PreloadJS(),
		canvas : "",
		stage : "",
		score : 0,
		lvl : 0,
		
		// objets crées à partir de classes
		player : '',
		ball: '',
		target :'',
		
		// Champs textes
		messageField :'' ,
		timeField : '',
		scoreField : '',
	  	// essayer de les mettre ailleurs car utilisé qu'au début'
		loadingInterval : "",
	    preload : '', 
	    
	    totalTime : 60*60 ,
	    isReady : false,
	    
	    isTactil : false,
		// méthodes
		init : function(){
			
			
			
		    this.miseAZero();	
			
			// this désigne l'objet Game
			this.canvas = document.getElementById("canvas");
			
			//si taille plus petite que celle prevu, recuperer la taille de la fenetre.
			var currentWidth = $(window).width();
			var currentHeight = $(window).height();
			if(currentWidth < this.WIDTH){
				this.WIDTH = currentWidth
				$('#content').width(currentWidth);
			}
			this.canvas.width = this.WIDTH;
			
			if(currentHeight<this.HEIGHT){
				this.HEIGHT = currentHeight;
				$('#content').height(currentHeight);
			}
			this.canvas.height = this.HEIGHT;
			
			this.messageField = new createjs.Text("Loading", "bold 24px Arial", "#000");
			this.messageField.maxWidth = this.HEIGHT;
            this.messageField.textAlign = "center";
            this.messageField.x = this.canvas.width / 2;
            this.messageField.y = this.canvas.height / 2;
            
            this.scoreField = new createjs.Text("0", "bold 12px Arial", "#000");
            this.scoreField.textAlign = "right";
            this.scoreField.x = canvas.width - 10;
            this.scoreField.y = 22;
            this.scoreField.maxWidth = 1000;
            
            this.timeField = new createjs.Text("", "bold 12px Arial", "#000");
            this.timeField.textAlign = "right";
            this.timeField.x = canvas.width - 10;
            this.timeField.y = 44;
            this.timeField.maxWidth = 1000;
            
            // création du stage
            this.stage = new createjs.Stage(this.canvas)
            this.stage.addChild(this.messageField);
            this.stage.update();
            
            // preloader
            this.preload = new createjs.PreloadJS();
            this.preload.onComplete = this.onDownloadComplete;
            this.preload.installPlugin(createjs.SoundJS);
            
            //créations d'instance de classe
            this.ball = new Ball();
            this.ball.constrainBall(this.WIDTH, this.HEIGHT);
			
			this.player = new Player(this.stage);
			
			
			this.player.onPress = function(evt) {
						evt.onMouseMove = function(ev){
							Game.player.x = ev.stageX;
							Game.player.y = ev.stageY;
							Game.stage.update();
					}
				}
			
			this.target = new Target();
			this.target.randomize();
			
			Game.isReady = true;
			
            
            //variable temporaire car utilisé qu'au début'
            var manifest = [{id:"bounce", src:"assets/Bounce.mp3"},{id:"bgMusic", src:"assets/Maggots.mp3"}]; // tout les fichiers à telecharger avec preload.js
            this.preload.loadManifest(manifest);
           
            // demander à afficher une animation lors du chargement
            this.loadingInterval = setInterval(this.updateLoading, 200);
            
		},
		playMusic : function(){
       		createjs.SoundJS.play("bgMusic", createjs.SoundJS.INTERRUPT_NONE, 0, 0, -1, 0.4);
       	},
		miseAZero : function(){
			Game.score = 0;
			Game.totalTime = 60*60;
		},
		// animatation à afficher au cour du chargement des fichiers
		updateLoading : function() {
			
            Game.messageField.text = "Loading " + (Game.preload.progress*100|0) + "%"
            Game.stage.update();
       	},
       	onDownloadComplete : function(){
       		clearInterval(Game.loadingInterval);
			this.isTactil = createjs.Touch.enable(this.stage);
            // start the music
           
			Game.startScreen();
       	},
       	
       	startScreen : function(){
       		Game.playMusic();
       		var g = new createjs.Graphics();
		
			
			g.beginFill(createjs.Graphics.getRGB(255,255,255));
			g.drawRect(0,0,Game.WIDTH,Game.HEIGHT);
			var rect = new createjs.Shape(g);
       		Game.messageField.text = "Pousser la balle rouge et obtenez toute les balles roses";
			
       		Game.stage.addChild(rect);
       		Game.stage.addChild(Game.messageField);
			
			Game.stage.update(); 	
			
			Game.stage.onPress = Game.handleKeyDown;
       	},
       	
       	handleKeyDown : function(){
       		// supprimer les ecouteurs
       		Game.stage.onPress = null;
    
			Game.startGame();	
       	},
       	tick : function(){
       		
       		// montrer le temps qu'il reste'
       		Game.timeField.text = 'temps : ' + Game.totalTime;
       		
       		Game.totalTime --;
       		// raffraichir le canvas
       		
       		Game.ball.tick();
       		Game.player.tick(Game.stage,Game.isTactil);
       		
       		if(Game.ball.hitRadius(Game.player.x,Game.player.y,Game.player.hit) == true){
				Game.playerToBall();	
			}else if(Game.ball.hitRadius(Game.target.x,Game.target.y,Game.target.hit) == true){
				Game.onTargetHit();
			}
			
			if(Game.totalTime<=0){
				Game.gameOver();
			}
			Game.stage.update();
       	},
       	playerToBall : function(){
       
			p1 = Game.player.lastPoints[Game.player.lastPoints.length - 1];
            p2 = Game.player.lastPoints[Game.player.lastPoints.length - 10];
           
            angle = Math.atan2(p1.y - p2.y, p1.x - p2.x);

			
            Game.ball.vX = Math.cos(angle) *5;
            Game.ball.vY = Math.sin(angle) * 5;
                
       	},
       	
       	onTargetHit : function(){
			Game.target.x = Math.random()* canvas.width;
			Game.target.y = Math.random()* canvas.height;
			createjs.SoundJS.play("bounce");
			
			//augmenter le score
			Game.lvl++;
			Game.score += 10 * Game.lvl;
			Game.scoreField.text = 'score : ' + Game.score;
		},
       	startGame : function(){

			Game.stage.removeAllChildren();
			createjs.Ticker.setPaused(false);

			createjs.Ticker.setFPS(60);
			createjs.Ticker.addListener(Game);
			
			Game.timeField.text = 'temps : ' + Game.totalTime;
			Game.stage.addChild(Game.scoreField);
			Game.stage.addChild(Game.timeField);
			
			// ajout sur le stage des objets
			Game.stage.addChild(Game.ball);
			Game.stage.addChild(Game.player);
			Game.stage.addChild(Game.target);
			
       	},
       	gameOver : function(){
       		
			// supprimer tout les enfants du stage 
			Game.stage.removeAllChildren();
			
			createjs.Ticker.setPaused(true);
			
			// creer un score
			// @todo probléme de securité => le joueur peut tricher et changer son score via le setter de backbone
			window.score = new window.Score();
			window.score.set({score: Game.score});
			window.app.navigate("gameFinish", {trigger: true});

       	},
       	pause : function(){
       		
       	},
       	resume : function(){
       		
       	},
		
		
		
	}

} (jQuery));