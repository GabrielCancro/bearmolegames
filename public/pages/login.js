import * as fireutils from "../libs/fireutils.js";
$(document).ready(initPage);

async function initPage(){    
    $("#btn_login").click(async (e)=>{
        $("#btn_login").addClass("inProgress");
        $("#tx_error").html("precessing..");
        let email = $("#inp_email").val();
        let pass = $("#inp_pass").val();
        console.log(email+"/"+pass);
        let res = await fireutils.login(email,pass);
        if(res){
            $("#tx_error").html("LOGUEO OK!!");
        }else{
            $("#tx_error").html("ERROR AL INTENTAR LOGUEARSE");
        }        
        $("#btn_login").removeClass("inProgress");
    });
}