import * as fireutils from "../libs/fireutils.js";
import * as fdb from "../libs/firebase_realtime_basedata.js";
import * as loginPage from "../pages/login.js";
import * as homePage from "../pages/home.js";
import * as newAccountPage from "../pages/newAccount.js";
import * as verificationPage from "../pages/verification.js";
import * as resetPasswordPage from "../pages/resetPassword.js";

var pagesRef = {
	login: loginPage,
	home: homePage,
	newAccount: newAccountPage,
	verification: verificationPage,
	resetPassword: resetPasswordPage,
}

document.addEventListener('DOMContentLoaded', initApp);
const no_require_auth = ["login","newAccount","resetPassword"];
async function initApp(){
  fireutils.startFirebase();
  changePage("home");
}

export async function changePage(pageName){
	let logued = await fireutils.isLogued();
	console.log("USER:",fireutils.getUser());
	if( logued == false && !no_require_auth.includes(pageName) ) pageName = "login";	
	if(logued && !fireutils.getUser().emailVerified) pageName = "verification";			
	$("#app").load("pages/"+pageName+".html", ()=>{
		pagesRef[pageName].initPage();
	});
}


