import * as fireutils from "../../libs/fireutils.js";
import * as fdb from "../../libs/firebase_realtime_basedata.js";
import * as cardGen from "./components/CardGenerator.js";
import * as main from "/js/main.js";

export var pageRoot = "pages/BearBoardCreator";
var cardData;

export async function initPage(){ 
    $('<link>').appendTo('head').attr({type: 'text/css', rel: 'stylesheet',href: 'pages/BearBoardCreator/styles.css'}); 
    $('<link>').appendTo('head').attr({type: 'text/css', rel: 'stylesheet',href: 'pages/BearBoardCreator/print_styles.css'}); 
    //$('<link>').appendTo('head').attr({type: 'application/javascript',href: 'pages/BearBoardCreator/components/html2pdf.bundle.min'}); 
    cardData = window.CARD_DATA_TO_PRINT;
    console.log(cardData)
    createAllCards();
    $("#btn_print").click(async ()=>{
        print('print_paper');
    }); 
    $("#btn_back").click(async ()=>{
        main.changePage("bearBoardCreator");
    }); 
}

function createAllCards(){
    $('#body').html('');
    $('#print_paper').css('width','21cm'); //21cm
    $('#print_paper').css('height','30.6cm'); //29.7cm
	  $('#print_work_space').html('');
	for( let c in cardData.cards){
        let amount = 1;
        if(cardData.cards[c] && cardData.cards[c].amount) amount = cardData.cards[c].amount
        console.log(c+": "+amount);
        for (let i=0; i<amount; i++) {
            console.log("    -",);
            let div = cardGen.createCard(cardData,c);
		    $('#print_work_space').append(div);
        }		
	}
    $('.card_print').css('margin-bottom','0.01cm');
    $('.card_print').css('margin-right','0.01cm');
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
