import * as fireutils from "../libs/fireutils.js";
import * as main from "../js/main.js";

var i=0;
var verify_interval;
export async function initPage(){ 
	verify_interval = setInterval(checkVerification, 2000);
	$("#tx_useremail").html(fireutils.getUser().email);
	$("#btn_logout").click(btn_logout_click);
}

async function checkVerification(){
	var user = await fireutils.refreshUser();	
	if(user.emailVerified){
		main.changePage("home");
		clearInterval(verify_interval);
	}
}

async function btn_logout_click(){
	$("#btn_logout").addClass("inProgress");
	await fireutils.logout();  
	main.changePage("login"); 
}