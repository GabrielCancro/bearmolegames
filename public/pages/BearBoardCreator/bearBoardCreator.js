import * as fireutils from "../../libs/fireutils.js";
import * as fdb from "../../libs/firebase_realtime_basedata.js";

export var pageRoot = "pages/BearBoardCreator";
export async function initPage(){ 
	console.log("BEAR BOARD!");
    console.log("CURRENT USER",fireutils.getUser());
    loadProjectsList();
    set_header_actions();
    updateCard();
}

var CURRENT_NODE_ID = null;
var CURRENT_CARD_INDEX = 1;
var CURRENT_MODE = "DESIGN"; // DESIGN-CARDS

async function set_header_actions(){
    
    $("#btn_project").html(cardData.projectName);
    $("#btn_save").click(()=>{
        saveFile(cardData,"nodesData.json");
    });
    $("#btn_load").click(()=>{
        loadFile(cardData.projectName);
        
    });
    $('#json_editor').on('keyup', function (e) {
        $("#btn_apply").html('*APPLY*');
    });
    $("#btn_apply").click(async ()=>{
        console.log("CARD DATA",cardData);
        if(!CURRENT_NODE_ID){
            deselect_node();
            return;
        }
        try{
            var data = get_json_from_pre("json_editor");
            if(CURRENT_MODE=="DESIGN") cardData.nodes[CURRENT_NODE_ID].style = data;
            if(CURRENT_MODE=="CARDS") cardData.cards["c"+CURRENT_CARD_INDEX][CURRENT_NODE_ID] = data;
            updateCard(false);
            $("#btn_apply").html('APPLY');
        }catch(e){
            console.log(e);
            $("#btn_apply").html('ERROR');            
        }        
    });   
    $("#btn_back_card").click(()=>{
        var size = Object.keys(cardData.cards).length;
        if(CURRENT_MODE=="CARDS" && CURRENT_CARD_INDEX>1){
            CURRENT_CARD_INDEX -= 1;
            updateCard();
        }  
        if(CURRENT_MODE=="CARDS") $("#btn_mode_card").html(CURRENT_CARD_INDEX+' / '+size);
        else $("#btn_mode_card").html("DESIGN");     
    });
    $("#btn_next_card").click(()=>{
        var size = Object.keys(cardData.cards).length;
        if(CURRENT_MODE=="CARDS" && CURRENT_CARD_INDEX<size){
            CURRENT_CARD_INDEX += 1;
            updateCard();
        }     
        if(CURRENT_MODE=="CARDS") $("#btn_mode_card").html(CURRENT_CARD_INDEX+' / '+size);
        else $("#btn_mode_card").html("DESIGN");
    });  
    $("#btn_mode_card").click(()=>{
        var size = Object.keys(cardData.cards).length;
        if(CURRENT_MODE=="CARDS") CURRENT_MODE="DESIGN";
        else if(CURRENT_MODE=="DESIGN") CURRENT_MODE="CARDS";
        updateCard();
        console.log(CURRENT_MODE);
        if(CURRENT_MODE=="CARDS"){
            $("#btn_next_card").removeClass('hidden');
            $("#btn_back_card").removeClass('hidden');
            $("#btn_mode_card").html(CURRENT_CARD_INDEX+' / '+size);
        }else{
            $("#btn_next_card").addClass('hidden');
            $("#btn_back_card").addClass('hidden');
            $("#btn_mode_card").html("DESIGN");
        } 
        deselect_node();
    }); 
    
}
async function loadProjectsList(){
    var slcElem = $("#slc_projects").html("<option disabled selected value> -- select an option -- </option>");
    var save_mail = fireutils.getUser().email.replace("@","_").replace(".","_");
    var data = await fdb.read_db("bear_board_creator/"+save_mail+"/projects");
    for(var projectName in data){
        slcElem.append( $('<option value="'+projectName+'">'+projectName+'</option>') );  
    }
    slcElem.change( async (e)=>{         
        var opt = slcElem.find("option:selected");
        console.log( opt.val() );
        loadFile( opt.val() );
        //$('#card_space').html('')
    });
}

function updateCard(deselectNodes = true){
    if(deselectNodes) deselect_node(); 
    var rootElement = $('#card_space')
    rootElement.css('width',cardData.size_x);
    rootElement.css('height',cardData.size_y);
    $('#card_space').html('');  
    for(var id in cardData.nodes) create_node(id);
}

function get_json_from_pre(idElem){
    var str = $('#'+idElem).html();
    str = str.replaceAll("<div>","");
    str = str.replaceAll("</div>","");
    str = str.replaceAll("<br>","");
    //console.log("@@@"+str);
    return JSON.parse(str);
}

function create_node(id){
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
    else $('#card_space').append(child);
    child.click(select_node);
    //apply overrides 
    if(
        CURRENT_MODE=="CARDS" 
        && cardData.cards['c'+CURRENT_CARD_INDEX] 
        && cardData.cards['c'+CURRENT_CARD_INDEX][id]
    ){
        child.css( cardData.cards['c'+CURRENT_CARD_INDEX][id] );
        child.html(cardData.cards['c'+CURRENT_CARD_INDEX][id].content);
    } 
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
        $('#json_editor').html( JSON.stringify(cardData.nodes[id].style,null,2) );
    }else if(cardData.cards['c'+CURRENT_CARD_INDEX]){
        if(cardData.cards['c'+CURRENT_CARD_INDEX][id] ){
            $('#json_editor').html( JSON.stringify(cardData.cards['c'+CURRENT_CARD_INDEX][id],null,2) );
        } else $('#json_editor').html( JSON.stringify({},null,2) );
    } else $('#json_editor').html( JSON.stringify({},null,2) );    
}

function deselect_node(){
    CURRENT_NODE_ID = -1;
    $('#json_editor').html('');
    $('#btn_node_id').html('-');
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
    updateCard();
}
