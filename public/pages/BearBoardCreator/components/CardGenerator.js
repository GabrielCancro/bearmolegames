var CURRENT_CARD_INDEX = 0;
var cardData;

export function createCard(_cardData,index=0){
    cardData = _cardData;
    CURRENT_CARD_INDEX = index;
    var div = $('<div id="card_space" class="card_print"></div>');
    div.css('width',cardData.size_x);
    div.css('height',cardData.size_y);
    for(var id in cardData.nodes) create_node(div,id);
    return div;
}

function create_node(div,id){
    var n = cardData.nodes[id];
    n.id = id;
    var child = $('<div id="'+n.id+'"/>');
    if(n.type=="text"){
        child.addClass('node')
        .css('width',n.w)
        .css('height',n.h)
        .html(n.style.content);
        if(n.style) child.css(n.style);
    }
    if(n.parent) $('#'+n.parent).append(child);
    else div.append(child);
    //apply overrides 
    if(
        cardData.cards['c'+CURRENT_CARD_INDEX] 
        && cardData.cards['c'+CURRENT_CARD_INDEX][id]
    ){
        child.css( cardData.cards['c'+CURRENT_CARD_INDEX][id] );
        child.html(cardData.cards['c'+CURRENT_CARD_INDEX][id].content);
    } 
}