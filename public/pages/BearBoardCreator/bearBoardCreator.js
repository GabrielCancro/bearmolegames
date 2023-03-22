import * as fireutils from "../../libs/fireutils.js";
import * as fdb from "../../libs/firebase_realtime_basedata.js";
import JsonEditor from "./components/JsonEditor.js";
import * as fontLoader from "./components/FontLoader.js";
import * as main from "/js/main.js";
import * as cardGen from "./components/cardGenerator.js";

export var pageRoot = "pages/BearBoardCreator";
export async function initPage(){ 
    $('<link>').appendTo('head').attr({type: 'text/css', rel: 'stylesheet',href: 'pages/BearBoardCreator/styles.css'});
    EDITOR_JSON = new JsonEditor("json_editor"); 
    if(!window.CURRENT_BBC_PROJECT_SELECTED) window.CURRENT_BBC_PROJECT_SELECTED = "testProject01";
    await loadFile(window.CURRENT_BBC_PROJECT_SELECTED);
    loadCardList();
    set_header_actions();
    fontLoader.loadAllFonts();
}

var EDITOR_JSON;
var CURRENT_NODE_ID = null;
var CURRENT_CARD_INDEX = 0;
var CURRENT_MODE = "DESIGN"; // DESIGN-CARDS

async function set_header_actions(){
    $("#btn_project").click(()=>{
        main.changePage("bbcProjects");
    });
    $("#btn_save").click(()=>{
        saveFile(cardData,"nodesData.json");
        recalculateCardScale();
    });
    $("#btn_load").click(()=>{
        loadFile(cardData.projectName);
        
    });    
    $("#btn_apply").click(async ()=>{
        console.log("CARD DATA",cardData);
        if(!CURRENT_NODE_ID){
            deselect_node();
            return;
        }
        try{
            if(CURRENT_MODE=="DESIGN") cardData.nodes[CURRENT_NODE_ID].style = EDITOR_JSON.getData();
            if(CURRENT_MODE=="CARDS") cardData.cards["c"+CURRENT_CARD_INDEX][CURRENT_NODE_ID] = EDITOR_JSON.getData();
            updateCard(false);
            $("#btn_apply").html('APPLY');
            reselect_node();
        }catch(e){
            console.log(e);
            $("#btn_apply").html('ERROR');            
        }        
    });    
    $("#btn_print").click(async ()=>{
        main.changePage("printCards");
    });   
}

async function loadCardList(){
    var slcElem = $("#slc_cards").html('<option selected value="DESIGN"> # DISEÑO # </option>');
    var index = 0
    for(var card in cardData.cards){
        index += 1;
        let cardName = card;
        if(cardData.cards[card].cardName) cardName = cardData.cards[card].cardName;        
        slcElem.append( $('<option value="'+index+'">'+cardName+'</option>') );  
    }
    slcElem.append( $('<option value="ADD">+AGREGAR+</option>') ); 
    slcElem.change( async (e)=>{         
        var opt = slcElem.find("option:selected");
        if (opt.val()=="DESIGN"){
            CURRENT_MODE="DESIGN"
            CURRENT_CARD_INDEX = 0;
        }else if (opt.val()=="ADD"){
            let size = Object.keys(cardData.cards).length;
            let newId = "c"+(size+1);
            cardData.cards[newId] = {cardName:"card_"+(size+1)};
            loadCardList();
            slcElem.val(size+1);
        }else{
            CURRENT_MODE="CARDS"
            CURRENT_CARD_INDEX = opt.val();
        }
        updateCard();
    });
}

function updateCard(deselectNodes = true){
    if(deselectNodes) deselect_node(); 
    $('#card_space').remove();
    let div = cardGen.createCard(cardData,CURRENT_CARD_INDEX); 
    div.click(select_node); 
    $('#design_work_space').append(div);
    recalculateCardScale();
}

function recalculateCardScale(){
    var scale = 1;
    var sw = .9*$('#design_work_space').width()/$('#card_space').width();
    var sh = .9*$('#design_work_space').height()/$('#card_space').height();
    var scale = Math.min(sw,sh);
    $('#card_space').css('transform','translate(-50%,-50%) scale('+scale+')');
}

function get_json_from_pre(idElem){
    var str = $('#'+idElem).html();
    str = str.replaceAll("<div>","");
    str = str.replaceAll("</div>","");
    str = str.replaceAll("<br>","");
    //console.log("@@@"+str);
    return JSON.parse(str);
}

function select_node(e){
    let id = $(e.target).attr('id');
    if(CURRENT_NODE_ID==id){
        deselect_node();
        return;
    }
    CURRENT_NODE_ID = id;
    $('#btn_node_id').html(CURRENT_NODE_ID);    
    if( CURRENT_MODE=="DESIGN" ){
        EDITOR_JSON.select(cardData.nodes[id].style);
    }else if(cardData.cards['c'+CURRENT_CARD_INDEX]){
        if(cardData.cards['c'+CURRENT_CARD_INDEX][id] ){
            EDITOR_JSON.select(cardData.cards['c'+CURRENT_CARD_INDEX][id]);
        } else EDITOR_JSON.select({});
    } else EDITOR_JSON.deselect();  
}

function reselect_node(){
    var aux_id = CURRENT_NODE_ID;
    CURRENT_NODE_ID = null;
    select_node( {target:$("#"+aux_id)} );
}

function deselect_node(){
    CURRENT_NODE_ID = -1;
    EDITOR_JSON.deselect();
}

function saveFile(data, filename){
    var text = JSON.stringify(data);
    /*var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click();*/
    var save_mail = fireutils.getUser().email.replace("@","_").replace(".","_");
    fdb.write_db("bear_board_creator/"+save_mail+"/projects",cardData.projectName,cardData);
}

async function loadFile(projectName){
    /*
    return new Promise(resolve=>{
        $.getJSON(filename, function(data){
            resolve(data);
        }).fail(function(){
            console.log("An error has occurred.");
            resolve(null);
        });
    });    
    */
    var save_mail = fireutils.getUser().email.replace("@","_").replace(".","_");
    var data = await fdb.read_db("bear_board_creator/"+save_mail+"/projects/"+projectName);
    if(data) cardData = data;
    if(!cardData.cards) cardData['cards']= { c1:{},c2:{} };
    $("#btn_project").html(cardData.projectName);
    updateCard();
}

var cardData = {
    projectName: "defaultProject",
    size_x:"6cm",
    size_y:"10cm",
    nodes: {
        n1:{type:'text',w:'2cm',h:'2cm',style:{backgroundColor:"blue",content: 'Hola Amigo!'} },
        n2:{type:'text',w:'100%',h:'2cm',style:{backgroundColor:"yellow",padding:'.2cm',content: 'Hola Amigo!'} },
        //n3:{parent: "c1", type:'text',w:'50%',h:'2cm',tx:'sss',style:{backgroundColor:"Brawn"} },
        n4:{type:'text',w:'100%',h:'5.6cm',style:{
            background:'red  url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKQV9WKkVv6rzdewQFCVj09zGHAvq5hpZzyeWFtjTWu4opj7knKshsQD6VZkmLoQb7rr0&usqp=CAU") no-repeat center',
            backgroundSize:'100% 100%',
        } },
    },
    cards:{
        c1:{ n1:{backgroundColor:"red"} },
        c2:{},
        c3:{},
        c4:{},
    }
}
