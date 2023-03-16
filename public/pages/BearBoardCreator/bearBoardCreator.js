export var pageRoot = "pages/BearBoardCreator";
export async function initPage(){ 
	console.log("BEAR BOARD!")
    updateCard();
}

function updateCard(){
    var rootElement = $('#card_space')
    rootElement.css('width',cardData.size_x);
    rootElement.css('height',cardData.size_y);
    $('#card_space').html('');
    for(var nodeData of cardData.nodes) create_node(nodeData)
    $("#btn_save").click(()=>{
        saveFile(cardData,"nodesData.json");
    });
    $("#btn_load").click(async ()=>{
        var data = await loadFile("pages/BearBoardCreator/nodesData.json");
        if(data) cardData = data;
        updateCard();
    });
}

var nodeId = 0;
function create_node(n){
    console.log("create_node ",n)
    nodeId += 1;
    if(!n.name) n.name = 'cardnode'+nodeId;
    var child = $('<div id="'+n.name+'"/>');
    n.id = 'cardnode'+nodeId;
    if(n.type=="text"){
        child.addClass('node')
        .css('width',n.w)
        .css('height',n.h)
        .html(n.tx);
        if(n.style) child.css(n.style);
    }
    if(n.parent) $('#'+n.parent).append(child);
    else $('#card_space').append(child);
    $('.node').click(select_node);
}

function select_node(nodeElement){
    console.log(nodeElement);
}

var cardData = {
    size_x:"6cm",
    size_y:"10cm",
    nodes: [
        {type:'text',w:'2cm',h:'2cm',tx:'Hola Amigo!',style:{backgroundColor:"blue"} },
        {name: "c1", type:'text',w:'100%',h:'2cm',tx:'Hola Amigo!',style:{backgroundColor:"yellow",padding:'.2cm'} },
        //{parent: "c1", type:'text',w:'50%',h:'2cm',tx:'sss',style:{backgroundColor:"Brawn"} },
        
        {type:'text',w:'100%',h:'5.6cm',tx:'',style:{
            background:'red  url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKQV9WKkVv6rzdewQFCVj09zGHAvq5hpZzyeWFtjTWu4opj7knKshsQD6VZkmLoQb7rr0&usqp=CAU") no-repeat center',
            backgroundSize:'100% 100%',
        } },
    ]
}

function saveFile(data, filename){
    var text = JSON.stringify(data);
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click();
}

async function loadFile(filename){
    return new Promise(resolve=>{
        $.getJSON(filename, function(data){
            resolve(data);
        }).fail(function(){
            console.log("An error has occurred.");
            resolve(null);
        });
    });    
}
