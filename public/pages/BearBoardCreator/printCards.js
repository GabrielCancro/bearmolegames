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
    $("#btn_config").click(async ()=>{
        $("#config_page_bg").removeClass("hidden");        
        $("#cnf_page_w").attr('placeholder',cardData.page_size_x);
        $("#cnf_page_h").attr('placeholder',cardData.page_size_y);
        $("#cnf_int_margin").attr('placeholder',cardData.internal_margin);
    }); 
    $("#btn_close_config_page").click(async ()=>{
        $("#config_page_bg").addClass("hidden");        
        apply_config();
    }); 
}

function createAllCards(){
  $('#print_work_space').html('');
  apply_css_page();
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

async function apply_config(){
    var sx = $("#cnf_page_w").val();
    if(sx!=""){
      cardData.page_size_x = sx;      
      $("#cnf_page_w").val('');
    } 
    var sy = $("#cnf_page_h").val();
    if(sy!=""){ 
      cardData.page_size_y = sy;
      $("#cnf_page_h").val('');
    }
    var im = $("#cnf_int_margin").val();
    if(im!=""){ 
      cardData.internal_margin = im;
      $("#cnf_int_margin").val('');
    }
    cnf_int_margin

    apply_css_page();
    var save_mail = fireutils.getUser().email.replace("@","_").replace(".","_");
    await fdb.write_db("bear_board_creator/"+save_mail+"/projects",cardData.projectName,cardData);
}

function apply_css_page(){
  if(!cardData.page_size_x) cardData.page_size_x = '21cm';
  if(!cardData.page_size_y) cardData.page_size_y = '29.7cm';
  $('#print_paper').css('width',cardData.page_size_x);
  $('#print_paper').css('height',cardData.page_size_y);
  if(!cardData.internal_margin) cardData.internal_margin = "0.02cm";
  $('.card_print').css('margin-bottom',cardData.internal_margin);
  $('.card_print').css('margin-right',cardData.internal_margin);
}