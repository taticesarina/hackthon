$( document ).ready( function() {
    
    //Touch the left and the right keys [ moves the character]
    
    $(window).keydown(function(event){
         if(event.keyCode==37) {
            moveleft();
            
        }
         if(event.keyCode==39) {
            moveright();
         }    
        
    });
    
    // List us the seasons
    var seasons=["beach","winter","western","fancy"];
    
    // Season from list
    var currentseason = seasons[0];
    
    // Index of current season
    var seasonindex = 0;
    
    var addClothesInterval = null;
    
    // 
    var clothes = [
    
        { 'season' : 'beach', 'name' : 'sandals' }, 
        { 'season' : 'beach', 'name' : 'hawaiian'},
        { 'season' : 'beach', 'name' : 'hat'},
        { 'season' : 'beach', 'name' : 'shorts'},
        
        { 'season' : 'winter', 'name' : 'boots'},
        { 'season' : 'winter', 'name' : 'hat'},
        { 'season' : 'winter', 'name' : 'mittens'},
        { 'season' : 'winter', 'name' : 'sweater'},
        
        { 'season' : 'western', 'name' : 'cowboyboots'},
        { 'season' : 'western', 'name' : 'cowboyhat'},
        { 'season' : 'western', 'name' : 'cowboyjacket'},
        { 'season' : 'western', 'name' : 'lasso'},
        
        { 'season' : 'fancy', 'name' : 'dress'},
        { 'season' : 'fancy', 'name' : 'suit'},
        { 'season' : 'fancy', 'name' : 'shoe'},
        { 'season' : 'fancy', 'name' : 'hat'},
                       
    ];
    
    
    function randomclothes() {
        var randomnumber = Math.floor(Math.random() * (clothes.length));
        return clothes[randomnumber];
            
    }
    
    
    // Starts the game and change the background
    
    $("#buttons").find(".characters").on("click",function(){
        
        $("#buttons").addClass("hide");
       var character= $(this).data("character");
       $("#person").addClass(character);
        startseason();
        
    });


    // Start season winter 
    
    function startseason(){
        $("#background").removeClass().addClass(currentseason+'-background');
        scoredisplay();

        if(seasonindex===0){
          screensize();  
        } 
       
       clearInterval( addClothesInterval );
       
       addClothesInterval = setInterval(moveclothes,20);
       
    }
    
    // The score
    
    var scoreValue = 0;
    var scoremax = 2;
    var scoremin = -5;
    
    function scoredisplay(){
        $('#score span').text( scoreValue );
    }
    
    function scoreup(){
        scoreValue++;
        scoredisplay();
    }
    
    function scoredown(){
        scoreValue--;
        scoredisplay();
    }
    
    function score(caughtseason) {
        if(currentseason===caughtseason){
            scoreup(); 
        }
        else{
            scoredown();
        }
        
        if(scoreValue===scoremax){
            
            $( window ).trigger( 'NextSeason' );
            
        }
        
        if(scoreValue === scoremin) {
            
             $( window ).trigger( 'YouLose' );

        }
        
    }
    
     $(window).on( 'NextSeason', function(){
        scoreValue = 0;
        seasonindex++;
    
        
        if( seasonindex > ( seasons.length - 1 ) ){
            $(window).trigger( 'YouWin' );
            return;
        }
        
        currentseason=seasons[seasonindex];
        startseason();
    });
    
    $(window).on( 'YouWin', function(){
        clearInterval( addClothesInterval );
        $('.clothes').remove();
        $('#winner').removeClass('hide');
    } );
    
     $(window).on( 'YouLose', function(){
        clearInterval( addClothesInterval );
         $('.clothes').remove();
        $('#loser').removeClass('hide');
    } );
    
//Take the width of your screen
    function screensize() {
      
        var width = $("#container").width();  
        var widthsize =width % 100 ;
        var clothingcounts = Math.floor(width/100);
        var closetmargin =widthsize/2+"px";
         insertclothes(clothingcounts);
       $("#closet").css({"margin-left":closetmargin}) ;
    }


    function insertclothes(clothingcounts) {
        var clothescontainer =$("#closet") ;
        for (var i = 0; i < clothingcounts; i++) {
            var left= Math.random()*window.innerWidth;
            var top= Math.random() * -1000 
            var random = randomclothes();
            var classname= random.season+"-"+random.name;
            
            $('<div/>')
                .addClass("clothes")
                .addClass(classname)
                .attr( 'data-season', random.season )
                .css({left:left, top:top})
                .appendTo(clothescontainer);
    
        }
        
    }
    
    function moveclothes() {
        
        var clothes = $('.clothes');
        for(var i = 0; i <  clothes.length; i++){
           var item = $(clothes[i])
           var top= item.position().top;
           var newposition = top +20;
           
           
          item.css("top", newposition);
          
          // collision dectection
          var rect1 = $("#person")[0].getBoundingClientRect();
          var rect2 = $(item)[0].getBoundingClientRect();

            if (rect1.left< rect2.left + rect2.width &&
               rect1.left + rect1.width > rect2.left &&
               rect1.top < rect2.top + rect2.height &&
               rect1.height + rect1.top > rect2.top) {
                // collision detected!
               item.remove();
               score(item.data('season'));
             insertclothes(1)
                
            }
            
            
            if(newposition>window.innerHeight){
          item.remove()
           insertclothes(1)
                
            }
        }
        
        
    }


    function moveleft() {
        
      var left = $("#person").position().left;
      
      var newposition = left -18;
      if(newposition<=0) {
          newposition=0
      }
    $('#person').css("left",newposition)    
    }
    
    
     function moveright() {
        var right = $("#person").position().left;
        var newposition = right +18;
      if(newposition>=window.innerWidth -$("#person").width()) {
          newposition=window.innerWidth -$("#person").width()
      }
        
         $('#person').css("left",newposition);
    }  

});