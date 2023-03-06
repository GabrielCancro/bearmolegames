import * as fireutils from "../libs/fireutils.js";
import * as main from "../js/main.js";

export async function initPage(){    
    $("#btn_back").click(btn_back_click);
    $("#btn_create_new_account").click(btn_create_new_account_click);
}

async function btn_back_click(e){
    $(e.target).addClass("inProgress");
    await main.changePage("login");
    $(e.target).removeClass("inProgress");
}

async function btn_create_new_account_click(e){
    console.log("btn_create_new_account_click");
    $(e.target).addClass("inProgress");
    let email = $("#inp_email").val();
    let pass = $("#inp_pass").val();
    let res = await fireutils.createUser(email,pass);
    if(res){
        await fireutils.sendVerificationEmail();
        await main.changePage("home");
    }else{        
        console.error("ERROR AL CREAR LA CUENTA!!",res);
    }
    $(e.target).removeClass("inProgress");
}