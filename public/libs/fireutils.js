//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
//from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { 
	getFirestore, 
	setDoc, getDocs, doc, getDoc, 
	collection, query, where 
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { 
	getAuth, signInWithEmailAndPassword,
	signOut, onAuthStateChanged,
	createUserWithEmailAndPassword,
	sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";

var db;
var current_user;

export function startFirebase(){
	console.log("startFirebase!");
	/*const firebaseConfig = {
	  apiKey: "AIzaSyCnXkA47QeESc34oyqwt4GF6i4urOuo-00",
	  authDomain: "sistema-escolar-gc.firebaseapp.com",
	  projectId: "sistema-escolar-gc",
	  storageBucket: "sistema-escolar-gc.appspot.com",
	  messagingSenderId: "985732582520",
	  appId: "1:985732582520:web:0c6c34d124a8b316e3718d",
	  measurementId: "G-YNNT9MJPS0"
	};*/
	const firebaseConfig = {
		apiKey: "AIzaSyAam2xvP1nE_35daMjYSTjegrw3xppY2DU",
		authDomain: "bearmolegames.firebaseapp.com",
		databaseURL: "https://bearmolegames-default-rtdb.firebaseio.com",
		projectId: "bearmolegames",
		storageBucket: "bearmolegames.appspot.com",
		messagingSenderId: "254964731747",
		appId: "1:254964731747:web:eb0ac9b48759ec73798d56",
		measurementId: "G-XDZT86HGJ7"
	};
	const app = initializeApp(firebaseConfig);
	const analytics = getAnalytics(app);
	db = getFirestore();
	isLogued();
	//console.log(db);
}

//USERS MANAGER
export async function login(email,password){
	const auth = getAuth();
	return await new Promise(resolve=>{
		signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed in
			const user = userCredential.user;
			//console.log("LOGUEO",user);
			current_user = user;
			resolve(user);
			// ...
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			//console.log("ERROR DE LOGUEO!",errorMessage);
			current_user = null;
			resolve(null);
		});
	});	
}

export async function isLogued(){
	const auth = getAuth();
	return await new Promise(resolve=>{
		onAuthStateChanged(auth, (user) => {
			//console.log("esta logueado",user);
			current_user = user;
			if(user) resolve(true);
			else resolve(false);
		});
	});
}

export async function logout(){
	const auth = getAuth();
	return await new Promise(resolve=>{
		signOut(auth).then(() => {
			//console.log("LOGOUT OK!");
			current_user = null;
			resolve(true);
		}).catch((error) => {
			//console.log("LOGOUT ERROR",error);
			current_user = null;
			resolve(false);
		});
	});
}

export async function createUser(email, password){
	const auth = getAuth();
	return await new Promise(resolve=>{
		createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
			const user = userCredential.user;
			current_user = user;
			resolve(current_user);
		})
		.catch((error) => {
			resolve(null);
		});
	});
}

export async function sendVerificationEmail(){
	const auth = getAuth();
	if(current_user){
		await sendEmailVerification(current_user);
		console.warn("SE ENVIO MAIL DE VERIFICACION A ",current_user.email);
		return true;
	}
	return false;
 }

export function getUser(){
	return current_user;
}

export async function refreshUser(){
	const auth = getAuth();
	await auth.currentUser.reload();
	current_user = auth.currentUser;
	return current_user;
}

export async function writeFirebase(coll_name,data){
	if (!data.id){
		console.log("ERROR: Falta el campo <id> en ",data);
		return
	}
	try {
	  const docRef = await setDoc(doc(db, coll_name, data.id), data);
	  console.log("Document written with ID: ", data.id);
	} catch (e) {
	  console.error("Error adding document: ", e);
	}
}

export async function readFirebase(coll_name,id=null){
	try {
		if(!id){
			const querySnapshot = await getDocs(collection(db, coll_name));
			querySnapshot.forEach((doc) => {
			  console.log(doc.id,"=>",doc.data());
			});
			return _docsToObject(querySnapshot);
		}else{
			const docRef = doc(db, coll_name, id);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
			  console.log("Document data:", docSnap.data());
			  return _docsToObject(docSnap);
			} else {
			  // doc.data() will be undefined in this case
			  console.log("No such document!");
			}
		}	
		return null;		
	} catch (error) {
		console.warn("@@@@ERROR",error);
		return null;
	}	
}

export async function readWhereFirebase(coll_name,paramA,opp,paramB){
	try {
		const querry = query(collection(db, coll_name), where(paramA, opp, paramB));
		const querySnapshot = await getDocs(querry);
		querySnapshot.forEach((doc) => {
		console.log(doc.id, " => ", doc.data());
		return _docsToObject(querySnapshot);
		});
	} catch (error) {
		console.warn("@@@@ERROR",error);
		return null;
	}		
	
}

function _docsToObject(docs){
	var result = {};
	docs.forEach((doc) => {
		result[doc.id] = doc.data();
	});
	return result;
}