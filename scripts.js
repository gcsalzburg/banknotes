
var max = 0;
var min = 99999999999;

var zoom = 1;
var scroll_offset = 0;

$(function(){
    var container = $("#currencies");
    container.append(Mustache.render(currency_template,banknotes));

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
function set_zoom(multiplier){
    zoom = zoom * multiplier;
    if(zoom < 1){
        zoom = 1;
    }
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
        var pos = ((euro_val - min) / (max-min))*zoom;
        $(this).css("left",(pos*100)+"%");
    });
}