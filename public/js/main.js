import * as fireutils from "../libs/fireutils.js";

document.addEventListener('DOMContentLoaded', initApp);

async function initApp(){
  fireutils.startFirebase();
  changePage("home");
}

export async function changePage(pageName){
	let logued = await fireutils.isLogued();
	if( logued == false) pageName = "login";
  	$("#app").load("pages/"+pageName+".html");
}
