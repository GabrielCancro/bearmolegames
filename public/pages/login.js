import * as fireutils from "../libs/fireutils.js";
import * as main from "../js/main.js";

$(document).ready(initPage);

async function initPage(){    
    $("#btn_login").click(async (e)=>{
        $("#btn_login").addClass("inProgress");
        $("#tx_error").html("precessing..");
        let email = $("#inp_email").val();
        let pass = $("#inp_pass").val();
        let res = await fireutils.login(email,pass);
        if(res){
            $("#tx_error").html("LOGUEO OK!!");
            main.changePage("home");
        }else{
            $("#tx_error").html("ERROR AL INTENTAR LOGUEARSE");
        }        
        $("#btn_login").removeClass("inProgress");
    });
}