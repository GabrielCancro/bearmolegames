import * as fireutils from "../../libs/fireutils.js";
import * as fdb from "../../libs/firebase_realtime_basedata.js";

export var pageRoot = "pages/BearBoardCreator";
var CURRENT_CARD_INDEX = 0;
var cardData;

export async function initPage(){ 
    $('<link>').appendTo('head').attr({type: 'text/css', rel: 'stylesheet',href: 'pages/BearBoardCreator/styles.css'}); 
    $('<link>').appendTo('head').attr({type: 'text/css', rel: 'stylesheet',href: 'pages/BearBoardCreator/print_styles.css'}); 
    //$('<link>').appendTo('head').attr({type: 'application/javascript',href: 'pages/BearBoardCreator/components/html2pdf.bundle.min'}); 
    await loadFile(window.CURRENT_BBC_PROJECT_SELECTED);
    $("#btn_print").click(async ()=>{
        print('print_work_space');
    }); 

}

function createAllCards(){
	$('#print_work_space').html('');
	for( let c in cardData.cards){
		console.log(c);
		CURRENT_CARD_INDEX += 1;
		createCard();
	}
}

function createCard(){
    var div = $('<div id="card_space" class="card_print"></div>');
    div.css('width',cardData.size_x);
    div.css('height',cardData.size_y);
    $('#print_work_space').append(div);
    for(var id in cardData.nodes) create_node(div,id);
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

async function loadFile(projectName){
    var save_mail = fireutils.getUser().email.replace("@","_").replace(".","_");
    var data = await fdb.read_db("bear_board_creator/"+save_mail+"/projects/"+projectName);
    if(data) cardData = data;
    if(!cardData.cards) cardData['cards']= { c1:{},c2:{} };
    $("#btn_project").html(cardData.projectName);
    createAllCards();
}

export function print(id){
	window.print();
	return;
	var element = document.getElementById(id);
	html2pdf(element);
	return;
  var elem = document.getElementById(id);
  var tab = window.open('', 'PRINT', 'height=400,width=600');
  tab.document.write('<html><head><title>CARD PRINT</title>');
  tab.document.write('</head><body width="7cm" height="10cm">');
  tab.document.write(elem.innerHTML);
  tab.document.write('</body></html>');
  tab.document.close();
  tab.focus();
  tab.print();
  tab.close();
  return true;
}
