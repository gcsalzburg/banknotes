
$(function(){
    var container = $("#currencies");
    container.append(Mustache.render(currency_template,banknotes));

    var max = 0;
    var min = 99999999999;

    // Save exchange rates per item
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

    // Position banknotes
    $(".banknote").each(function(){

        var euro_val = $(this).data("euro-value");
        var pos = (euro_val - min) / (max-min);
        $(this).css("left",(pos*100)+"%");
        console.log({euro_val,pos});

    });



    console.log({min,max});


});