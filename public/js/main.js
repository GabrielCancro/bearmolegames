import * as fireutils from "../libs/fireutils.js";

document.addEventListener('DOMContentLoaded', initApp);

async function initApp(){
  fireutils.startFirebase();
  changePage("login");
}

function changePage(pageName){
  console.log("CHANGE PAGE ",pageName);
  $("#app").load("pages/"+pageName+".html");
}
