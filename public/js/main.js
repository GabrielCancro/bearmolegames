import * as fireutils from "../libs/fireutils.js";
import * as loginPage from "../pages/login.js";
import * as homePage from "../pages/home.js";
import * as newAccountPage from "../pages/newAccount.js";

var pagesRef = {
	login: loginPage,
	home: homePage,
	newAccount: newAccountPage,
}

document.addEventListener('DOMContentLoaded', initApp);
const no_require_auth = ["login","newAccount"];
async function initApp(){
  fireutils.startFirebase();
  changePage("home");
}

export async function changePage(pageName){
	let logued = await fireutils.isLogued();
	if( logued == false && !no_require_auth.includes(pageName) ) pageName = "login";
  	$("#app").load("pages/"+pageName+".html", ()=>{
		pagesRef[pageName].initPage();
	});
}
