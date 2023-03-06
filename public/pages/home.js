import * as fireutils from "../libs/fireutils.js";
import * as main from "../js/main.js";

export async function initPage(){ 
	console.log(fireutils.getUser());
    if(fireutils.getUser()) $("#tx_username").html(fireutils.getUser().email)
    $("#btn_logout").click(async (e)=>{
        $("#btn_logout").addClass("inProgress");
        await fireutils.logout();  
        main.changePage("login");      
    });
}