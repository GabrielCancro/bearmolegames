import * as fireutils from "../../libs/fireutils.js";
import * as fdb from "../../libs/firebase_realtime_basedata.js";

export var pageRoot = "pages/BearBoardCreator";
export async function initPage(){ 
	console.log("BEAR BOARD!");
    console.log("CURRENT USER",fireutils.getUser());
    loadProjectsList();
    updateCard();
}

var CURRENT_NODE_ID = -1;

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
    });
}

function updateCard(){    
    $("#btn_project").html(cardData.projectName);
    var rootElement = $('#card_space')
    rootElement.css('width',cardData.size_x);
    rootElement.css('height',cardData.size_y);
    $('#card_space').html('');
    for(var id in cardData.nodes) create_node(id);
    $("#btn_save").click(()=>{
        saveFile(cardData,"nodesData.json");
    });
    $("#btn_load").click(()=>{
        loadFile(cardData.projectName);
        
    });
    $('#design_edit_panel').on('keyup', function (e) {
        $("#btn_apply").html('*APPLY*');
    });
    $("#btn_apply").click(async ()=>{
        try{
            var data = get_json_from_pre("design_edit_panel");
            cardData.nodes[CURRENT_NODE_ID] = data;
            updateCard();
            $("#btn_apply").html('APPLY');
        }catch(e){
            //get_json_from_pre("design_edit_panel");
            console.log(e);
            $("#btn_apply").html('ERROR');            
        }        
    });    
}

function get_json_from_pre(idElem){
    var str = $('#'+idElem).html();
    str = str.replaceAll("<div>","");
    str = str.replaceAll("</div>","");
    str = str.replaceAll("<br>","");
    //console.log("@@@"+str);
    return JSON.parse(str);
}

var nodeId = 0;
function create_node(id){
    var n = cardData.nodes[id];
    n.id = id;
    var child = $('<div id="'+n.id+'"/>');
    if(n.type=="text"){
        child.addClass('node')
        .css('width',n.w)
        .css('height',n.h)
        .html(n.tx);
        if(n.style) child.css(n.style);
    }
    if(n.parent) $('#'+n.parent).append(child);
    else $('#card_space').append(child);
    child.click(select_node);
}

function select_node(e){
    let id = $(e.target).attr('id');
    CURRENT_NODE_ID = id;
    //console.log(cardData.nodes[id]);
    $('#design_edit_panel').html( JSON.stringify(cardData.nodes[id],null,2) );
}

var cardData = {
    projectName: "defaultProject",
    size_x:"6cm",
    size_y:"10cm",
    nodes: {
        n1:{type:'text',w:'2cm',h:'2cm',tx:'Hola Amigo!',style:{backgroundColor:"blue"} },
        n2:{type:'text',w:'100%',h:'2cm',tx:'Hola Amigo!',style:{backgroundColor:"yellow",padding:'.2cm'} },
        //n3:{parent: "c1", type:'text',w:'50%',h:'2cm',tx:'sss',style:{backgroundColor:"Brawn"} },
        n4:{type:'text',w:'100%',h:'5.6cm',tx:'',style:{
            background:'red  url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKQV9WKkVv6rzdewQFCVj09zGHAvq5hpZzyeWFtjTWu4opj7knKshsQD6VZkmLoQb7rr0&usqp=CAU") no-repeat center',
            backgroundSize:'100% 100%',
        } },
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
    updateCard();
}
