var currency_template= '{{#currencies}} \
    <div class="currency" id="{{code}}" data-exchange-rate="{{exchange-rate}}"> \
        <h2>{{code}}</h2> \
        <h3>{{name}}</h3> \
        <ul class="notes"> \
        {{#notes}} \
            {{#.}} \
            <li class="banknote" data-value="{{.}}" data-euro-value="">{{.}}</li> \
            {{/.}} \
        {{/notes}} \
        </ul> \
    </div> \
{{/currencies}}';