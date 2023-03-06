import * as fireutils from "../libs/fireutils.js";
import * as main from "../js/main.js";

//$(document).ready(initPage);

export async function initPage(){ 
    console.log("@@@@@@@@@");   
    $("#btn_login").click(btn_login_click);
    $("#btn_new_account").click(btn_new_account_click);
}

async function btn_login_click(e){
    $(e.target).addClass("inProgress");
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
}

async function btn_new_account_click(e){
    console.log("btn_new_account_click",e);
    $(e.target).addClass("inProgress");    
    await main.changePage("newAccount");
}

