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
    var data = cardData.nodes[id];
    data.id = id;
    var child = $('<div id="'+data.id+'" class="node"/>');
    apply_css(child,data);
    if(data.parent) $('#'+data.parent).append(child);
    else div.append(child);
    //CARDS OVERRIDES
    if(
        cardData.cards['c'+CURRENT_CARD_INDEX] 
        && cardData.cards['c'+CURRENT_CARD_INDEX][id]
    ) apply_css(child,cardData.cards['c'+CURRENT_CARD_INDEX][id]);
}

function apply_css(node,data){
    node.css(data);
    if(data.content) node.html(data.content);
    if(data.image) node.css('backgroundImage','url("'+data.image+'")');
}