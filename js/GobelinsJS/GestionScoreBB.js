(function ($) {
	//-------------------------------------//
	//         Models     				   //
	//-------------------------------------//
	//Modele de score 
    window.Score = Backbone.Model.extend({
		urlRoot :'http://julien-verhaeghe.fr/GobelinsJS/api/index.php/scores',
        defaults: {
            name: "",
            lastname: '',
            score: "0",
            sexe: "",
            photo: "/img/placeholder.png"
        },
		
    });
	//-------------------------------------//
	//         Routeur     				   //
	//-------------------------------------//
	var ScoreRouteur = Backbone.Router.extend({
	    routes: {
	        "gameFinish" : 'showFinishGame',
	        "score" : 'showScore',
	        "recScore" : 'showRecScore',
	        "filter/:type": "urlFilter",
	        "*actions" : "showGame"
	    },
	    showGame : function(){
	        gameView.render();
	    },
	   showRecScore: function(){
			window.recScoreView = new RecScoreView({
				model : window.score
			});
			recScoreView.render();
		},
		urlFilter: function (type) {
            directory.filterType = type;
            directory.trigger("change:filterType");
        },
	    
	    showFinishGame : function(){
	    	window.gameFinishView = new GameFinishView({
	    		model : window.score
	    	});
			gameFinishView.render();
	       
	    },
	    showScore : function(){
	    	window.directoryView.render();
			window.directoryView.collection.fetch();
	    	
	    }
	});
	
	//-------------------------------------//
	//         Collection				   //
	//-------------------------------------//
	//-----Collection qui contient l'ensemble des scores 
	//que l'on va chercher dans la base de donnée via
	//slim php
	
    //define directory collection
    var Directory = Backbone.Collection.extend({
		url:"http://julien-verhaeghe.fr/GobelinsJS/api/index.php/scores",
        model: Score
    });
    
	
    //-------------------------------------//
	//         Views     				   //
	//-------------------------------------//
	//define master view Game
	var GameFinishView = Backbone.View.extend({
	    el: $("#content"),
	 	tagName: "div",
        className: "gameFinish",
        template: _.template($("#gameFinishTemplate").html()),
        
	    render: function () {
			$('#content').height('auto')    
			var template = this.template(this.model.toJSON());
	        //this.$el.fadeOut(500); => ne marche pas
	        $('#content').fadeOut(500,function(){
	        	$('#content').html(template);
	        	$('#content').slideDown(500);
	        });
	        
	        
	      return this;
	    },
	   
	})
	var RecScoreView = Backbone.View.extend({
        el: "#content",

        template: _.template($("#formulaireTemplate").html()),
        
		initialize:function(){
			 _.bindAll(this, "saveScore");
		},
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        
        
		events:{	
			
			"click .save":"saveScore"
		},
		
		saveScore:function () {
			this.model.set({
				name:$('#name').val(),
				lastname:$('#lastname').val(),
				name:$('#name').val(),
				sexe:$('#sexe').val(),
			});
			
			this.model.save();
			window.app.navigate('score',{trigger: true});
			
		},

    });
	 //define master view Scores
    var DirectoryView = Backbone.View.extend({
        el: $("#content"),
		
        initialize: function () {
            this.collection = new Directory();

            this.render();
            this.collection.on("reset", this.render, this);
            
            this.on("change:filterType", this.filterByType, this);
            this.collection.on("reset", this.render, this);
           
        },

        render: function () {
            /*this.$el.find("article").remove();
            this.$el.html('<header><div id="filter"><label>Show me:</label></div></header>');
*/			this.$el = $('#content');

			this.$el.html('<a href="#"  id="replay">rejouer</a>');
            _.each(this.collection.models, function (item) {
                this.renderScore(item);
            }, this);
			
        },

        renderScore: function (item) {
            var contactView = new ScoreView({
                model: item
            });
            this.$el.append(contactView.render().el);
        },

        

        
        
    });
	//define master view Game
	var GameView = Backbone.View.extend({
	    el: $("#content"),
	 	template: _.template($("#game").html()),
	 	
	    render: function () {
	        // adapter la taille de l'appli selon le périhérique
	        
	        $('#content').html(this.template);
	        Game.init();
	        return this;
	    },
	
	});
	var ScoreView = Backbone.View.extend({
		
        tagName: "div",
        className: "score-container",
        template: _.template($("#scoreTemplate").html()),
        

        render: function () {
			
            //this.$el.html(this.template(this.model.toJSON()));
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
    });
	
	
	
	$(function() {
 		// Handler for .ready() called.
 		//create router instance
	    window.app = new ScoreRouteur();
	    window.gameView = new GameView();
		window.directoryView = new DirectoryView();
   		//window.directoryView =' dee'; => fonctionne
	    Backbone.history.start();
	});
	
    
} (jQuery));