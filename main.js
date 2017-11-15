// I used the tutorial from this link to create this game: http://www.lessmilk.com/tutorial/flappy-bird-phaser-1
var form_selector = "#mturk_form";


//function for getting URL parameters
function gup(name) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if(results == null)
    return "";
  else return unescape(results[1]);
}




var mainState = {
    preload: function() { 
           // Load the bird sprite
        game.load.image('bird', 'assets/smallbee.png'); 
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 
        game.load.image('pipe', 'assets/flower50.png');
    },

    addOnePipe: function(x, y) {
    // Create a pipe at the position x and y
    var pipe = game.add.sprite(x, y, 'pipe');

    // Add the pipe to our previously created group
    this.pipes.add(pipe);

    // Enable physics on the pipe 
    game.physics.arcade.enable(pipe);

    // Add velocity to the pipe to make it move left
    pipe.body.velocity.x = -200; 

    // Automatically kill the pipe when it's no longer visible 
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {

    this.score += 1;
     $("#scoreID").val(this.score);
    this.labelScore.text = this.score;
    // Randomly pick a number between 1 and 5
    // This will be the hole position
    var hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 pipes 
    // With one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1) 
            this.addOnePipe(400, i * 60 + 10);   
    },

    create: function() { 

    this.score = 0;
    $("#scoreID").val(this.score);
    
    this.labelScore = game.add.text(20, 20, "0", 
     {font: "30px Arial", fill: "#ffffff" });   

        // Create an empty group
    this.pipes = game.add.group(); 

    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

            // Change the background color of the game to blue
    game.stage.backgroundColor = '#7fd192';

    // Set the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Display the bird at the position x=100 and y=245
    this.bird = game.add.sprite(100, 245, 'bird');

    // Add physics to the bird
    // Needed for: movements, gravity, collisions, etc.
    game.physics.arcade.enable(this.bird);

    // Add gravity to the bird to make it fall
    this.bird.body.gravity.y = 1000;  

    // Call the 'jump' function when the spacekey is hit
    var spaceKey = game.input.keyboard.addKey(
                    Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);    
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc.  
    },


    update: function() {

            // If the bird is out of the screen (too high or too low)
    // Call the 'restartGame' function
    if (this.bird.y < 0 || this.bird.y > 490)
        this.restartGame();
        // This function is called 60 times per second    
        // It contains the game's logic 

    game.physics.arcade.overlap(
    this.bird, this.pipes, this.restartGame, null, this);

    },
    // Make the bird jump 
    
    jump: function() {
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;
    },

    // Restart the game
    restartGame: function() {
        if(score >= 5){
         // Start the 'main' state, which restarts the game
         $("#mturk_form").submit();
        }else{
        game.state.start('main');
    }
    },
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
//game.state.start('main');

$(document).ready(function (){
    $("#scoreID").val(0);

    if((aid = gup("assignmentId"))!="" && $(form_selector).length>0) {

    // If the HIT hasn't been accepted yet, disabled the form fields.
    if(aid == "ASSIGNMENT_ID_NOT_AVAILABLE") {
        //$('input,textarea,select').attr("DISABLED", "disabled");
        //game.state.stop('main');  
        game.state.start('main');
    }else{
        game.state.start('main');
    }
    

    // Add a new hidden input element with name="assignmentId" that
    // with assignmentId as its value.
    var aid_input = $("<input type='hidden' name='assignmentId' value='" + aid + "'>").appendTo($(form_selector));

    // Make sure the submit form's method is POST
    $(form_selector).attr('method', 'POST');

    // Set the Action of the form to the provided "turkSubmitTo" field
    if((submit_url=gup("turkSubmitTo"))!="") {
      $(form_selector).attr('action', submit_url + '/mturk/externalSubmit');
    }
  }
});