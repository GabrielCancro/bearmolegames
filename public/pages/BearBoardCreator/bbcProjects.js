import * as fireutils from "../../libs/fireutils.js";
import * as fdb from "../../libs/firebase_realtime_basedata.js";
import * as main from "/js/main.js";

export var pageRoot = "pages/BearBoardCreator";
export async function initPage(){     
    console.log("CURRENT USER",fireutils.getUser());
    loadProjectsList();
}

async function loadProjectsList(){
    $("#project_list").html("");
    var save_mail = fireutils.getUser().email.replace("@","_").replace(".","_");
    var data = await fdb.read_db("bear_board_creator/"+save_mail+"/projects");
    for(var projectName in data){
        var btn = $('<div class="ds_btn">'+projectName+'</div>');
        btn.click( (e)=>{
            console.log( "CLICK EN ",$(e.target).html() );
            window.CURRENT_BBC_PROJECT_SELECTED = $(e.target).html();
            main.changePage("bearBoardCreator");
        })
        $("#project_list").append(btn);
    }
}