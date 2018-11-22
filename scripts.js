
var max = 0;
var min = 99999999999;

var MIN_ZOOM = 1;
var MAX_ZOOM = 10000;
var ZOOM_RATE = 1.2;

var zoom = 1;
var scroll_offset = 0;

$(function(){
    var container = $("#currencies");
    container.append(Mustache.render(currency_template,banknotes));

    // Add scroll zoom handling
    document.getElementById("currencies").addEventListener("wheel",function(e){
        set_zoom(Math.sign(e.deltaY)*-1);
        return false;
    }, false);

    // Add handler for mouse movement
    $(".notes").on("mousemove",function(e){
        set_scrolloffset((e.pageX - $(this).offset().left)/$(this).width()); // should cache these!
    });

    // Initial positioning
    calculate_exchange_rates();
    update_positions();

    
    // Build array of currency codes to send to Fixer IO
    var curr_codes = [];
    $.each(banknotes.currencies, function(i,elem){
        curr_codes.push(elem.code);
    });

    // Now get latest exchange rate data from Fixer.io API
    var fixer_api_url = "http://data.fixer.io/api/latest?access_key="+fixer_api_key+"&base=EUR&symbols="+curr_codes.join(",")+"&format=1";
    $.getJSON(fixer_api_url,function(data){
        $.each(data.rates,function(k,v){
            $("#"+k).data("exchange-rate",1/v); // inverse to get 1 whatever in EUROs
        });

        // Update positions based on new information
        calculate_exchange_rates();
        update_positions();
    });

    // Handlers for zoom in/out buttons
    $(".zoom_button").on("click",function(e){
        e.preventDefault();
        set_zoom($(this).data("increment"));
    });
});


// Zoom handler
function set_zoom(direction){
    var multiplier = 1;
    if(direction > 0){
        multiplier = ZOOM_RATE; 
    }else if(direction < 0){
        multiplier = 1/ZOOM_RATE;
    }
    zoom = zoom * multiplier;
    if(zoom < MIN_ZOOM){
        zoom = MIN_ZOOM;
    }else if(zoom > MAX_ZOOM){
        zoom = MAX_ZOOM;
    }
    update_positions();
}

// Scroll offset handler
function set_scrolloffset(percentage){
    scroll_offset = percentage;
    update_positions();
}

// Set exchange rates for each note
function calculate_exchange_rates(){
    $(".banknote").each(function(){
        var x_rate = $(this).parents(".currency").data("exchange-rate");
        var euro_val = x_rate*$(this).data("value");
        $(this).data("euro-value",euro_val);
        if(euro_val < min){
            min = euro_val;
        }
        if(euro_val > max){
            max = euro_val;
        }
    });
}

// Position banknotes
function update_positions(){
    $(".banknote").each(function(){
        var euro_val = $(this).data("euro-value");
        var pos = ((euro_val - min) / (max-min));   // calculate raw percentage
        pos = pos*zoom;                             // multiple by zoom
        pos = pos + (scroll_offset * (1-zoom));     // shift position based upon mouse location
        
        $(this).css("left",(pos*100)+"%");
    });
}