import * as fireutils from "../libs/fireutils.js";
import * as main from "../js/main.js";

var i=0;
export async function initPage(){ 
	setInterval(checkVerification, 2000);
	$("#tx_useremail").html(fireutils.getUser().email);
}

function checkVerification(){
	fireutils.isLogued()	

	if(fireutils.getUser().emailVerified) main.changePage("home");
	else console.log("MAIL NO VERIFICADO ",i);
	i+=1;
}