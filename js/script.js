"use strict";

//-----------------------------------------------------------------------------------------------
//IMPORTACIÓN DE COMPONENTES --------------------------------------------------------------------
import emojis from "./emojis.js";
import {readImg, gallery, documents, resetFiles} from "./read_files.js";
import {camara, galleryCam} from "./camara.js";
import {ubication, position} from "./ubication.js";
import {sliderPrevisual, resetSliderPrev} from "./slider_previsual.js";
import {modal, slider} from "./slider.js";
import {addZeros, messageTime} from "./time.js";

//-----------------------------------------------------------------------------------------------
//DECLARACIÓN DE VARIABLES Y CONSTANTES ---------------------------------------------------------
const container = document.querySelector(".container");
const header = document.querySelector(".header");
const channel = document.querySelector(".channel");
const messenger = document.querySelector(".messenger");
const emoticons = document.querySelector(".emoticons");
const messageBox = document.querySelector(".messageBox");
const message = document.querySelector(".message");
const attach = document.querySelector(".attach");
const send = document.querySelector(".send");
//-----------------------------------------------------------------------------------------------
//APERTURA DE CANALES ---------------------------------------------------------------------------
const Channel = new BroadcastChannel("myChannel");
const Channel2 = new BroadcastChannel("myChannel2");

//-----------------------------------------------------------------------------------------------
//REGISTRO DE SERVICE WORKER --------------------------------------------------------------------
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register("sw.js")
		.then(reg => console.log("Registro de SW exitoso", reg))
		.catch(err => console.log("Error al tratar de registrar el SW", err))
}


//-----------------------------------------------------------------------------------------------
//APERTURA DE LA BASE DE DATOS INDEXEDDB --------------------------------------------------------

const IDBRequest = indexedDB.open("chatDB", 1);

IDBRequest.addEventListener("upgradeneeded", () => {
	const db = IDBRequest.result;
	db.createObjectStore("chatting", {
		autoIncrement: true
	})
	console.log("La base de datos fue creada correctamente");
})

IDBRequest.addEventListener("success", () => {
	console.log("La apertura fue realizada exitosamente");
	readObject();
})

IDBRequest.addEventListener("error", () => {
	console.log("Ocurrió un error al abrir la base de datos");
})


//------------------------------------------------------------------------------------------------
//MANEJO DE LA BASE DE DATOS INDEXEDDB -----------------------------------------------------------
function addObject(object) {
	console.log("Agregando objeto");
	const db = IDBRequest.result;
	const transaction = db.transaction("chatting", "readwrite");
	const objectStore = transaction.objectStore("chatting");	

	const request = objectStore.add(object);

	request.addEventListener("success", () => {
		let key = request.result;
		console.log("Objeto agregado correctamente");
		if (object.type === "sent") {
			let newHTML = createHTML(key, object.type, object.message, object.documents, object.gallery, object.time);
			channel.appendChild(newHTML);
			channel.scrollTop = "999999";
		}
		else {
			let newHTML = createHTML(key, object.type, object.message, object.documents, object.gallery, object.time);
			channel.appendChild(newHTML);
			channel.scrollTop = "999999";			
		}
	})

	transaction.addEventListener("complete", () => {
		if (object.type === "sent") {
			Channel.postMessage([object.message, object.documents, object.gallery]);
		}
		console.log("Transacción finalizada");
	})
}	

let infoDB = [];
function readObject() {
	return new Promise (resolve => {
		console.log("Leyendo objetos");
		const db = IDBRequest.result;
		const transaction = db.transaction("chatting", "readonly");
		const objectStore = transaction.objectStore("chatting");
		
		const cursor = objectStore.openCursor();
		
		cursor.addEventListener("success", () => {
			if(cursor.result) {
				let value = cursor.result.value;
				console.log("Objeto leído correctamente");
				console.log(value);

				if (value.name === "Chat B") {
					let key = cursor.result.key;
					infoDB.push([key, value]);
				}
				cursor.result.continue();
			} else {
				console.log("Todos los datos fueron leídos")

				infoDB.reverse();
				console.log(infoDB);
			}
		})

		transaction.addEventListener("complete", () => {
			console.log("Transacción finalizada");
			if (infoDB.length > 0) {
				loadHTML(8).then(result => {
					channel.scrollTop = channel.scrollHeight;
				})
			}
		})
		
		resolve(true);
	}) 	
}

function modifyObject(key, modified, className) {
	console.log("Obteniendo objeto");
	const db = IDBRequest.result;
	const transaction = db.transaction("chatting", "readwrite");
	const objectStore = transaction.objectStore("chatting");

	const request = objectStore.get(key);

	request.addEventListener("success", () => {
		const object = request.result;
		console.log("Objeto obtenido correctamente");		

		console.log("Modificando objeto");
		object.message = modified;
		console.log(object);
		const requestUpdate = objectStore.put(object, key);

		requestUpdate.addEventListener("success", () => {
			console.log("Objeto modificado correctamente");
		})
	})

	transaction.addEventListener("complete", () => {
		Channel2.postMessage([modified, className]);
		console.log("Transacción finalizada");
	})
}

function deleteObject(key) {
	console.log("Eliminando objeto");
	const db = IDBRequest.result;
	const transaction = db.transaction("chatting", "readwrite");
	const objectStore = transaction.objectStore("chatting");
		console.log("Transacción finalizada");

	const del = objectStore.delete(key);

	transaction.addEventListener("complete", () => {
		console.log("Objeto eliminado correctamente");
	})
}

//--------------------------------------------------------------------------------------------------
//FORMATO HTML DINAMICO DE LOS MENSAJES ENVIADOS O RECIBIDOS ----------------------------------------------------
let contS = 0;
let contR = 0;

const createHTML = (key, type, message, documents, gallery, time) => {
	console.log("Creando elemento HTML");
	const contain = document.createElement("DIV");

	const content = document.createElement("DIV");
	const text = document.createElement("P");

	const clock = document.createElement("DIV");
	const hours = document.createElement("DIV");
	const minutes = document.createElement("DIV");
	
	contain.classList.add(type);
	content.classList.add("content");
	text.classList.add("text");
	clock.classList.add("clock");

	hours.textContent = time[0] + ":";
	minutes.textContent = time[1];

	content.innerHTML = message;
	clock.appendChild(hours);
	clock.appendChild(minutes);

	contain.appendChild(content);
	contain.appendChild(clock);

	if (type === "sent") {
		content.classList.add(`content-S${contS}`);	
		contS++;
		oilS = true;
		//Creamos los botones modificar y eliminar
		let refMsg = message;
		modifyHTML(key, refMsg, contain, content, text, clock);		
	}
	if (type === "received") {
		content.classList.add(`content-R${contR}`);
		contR++;
		oilR = true;
	}
	//-----------------------------------------------------------------------------------------	
	const fragment = document.createDocumentFragment();
	/*for (let i = 0; i < documents.length; i++) {
		const buttDoc = document.createElement("BUTTON");
		const doc = document.createElement("IMG");

		buttDoc.classList.add("buttDoc");
		doc.setAttribute("src", "assets/documento.png");

		buttDoc.style.background = "#30498f";
		buttDoc.style.border = "none";

		buttDoc.appendChild(doc);

		fragment.appendChild(buttDoc);
		if (type === "sent" && document.querySelectorAll(".channel > .modalPrevisual").length !== 0) {
			console.log("Eliminando previsualizadas");
			const modalPrev = document.querySelector(".modalPrevisual");
			channel.removeChild(modalPrev);
		}

		if (i === documents.length-1 && document.querySelectorAll(".messenger > .attach").length === 0) {
			const messTwo = document.querySelector(".messengerTwo");
			console.log(messenger);
			container.replaceChild(messenger, messTwo);
			messenger.insertBefore(messageBox, attach);
			messenger.appendChild(send);
		}

		buttDoc.addEventListener("click", () => {
			console.log("Hola");
			const modalDoc = document.createElement("DIV");
			const readDoc = document.createElement("DIV");
			const text = document.createElement("P");
			const quit = document.createElement("DIV");
			const imgQuit = document.createElement("IMG");

			text.textContent = documents[i];
			modalDoc.classList.add("modalDoc");
			readDoc.classList.add("readDoc");
			text.classList.add("text");
			quit.classList.add("quit");

			imgQuit.setAttribute("src", "assets/equis.png");

			quit.appendChild(imgQuit);
			readDoc.appendChild(text);
			readDoc.appendChild(quit);

			modalDoc.appendChild(readDoc);
			channel.appendChild(modalDoc);

			quit.addEventListener("click", () => {
				channel.removeChild(modalDoc);
			})
		})

		document.querySelector(".quit").addEventListener("click", () => {
			channel.removeChild(document.querySelector(".modalDoc"));
		})}}*/

	//En caso de existir SliderPrev, eliminarlo
	if (type === "sent" && document.querySelectorAll(".channel > .modalPrevisual").length !== 0) {
		console.log("Eliminando previsualizadas");
		const modalPrev = document.querySelector(".modalPrevisual");
		channel.removeChild(modalPrev);

		console.log("Restableciendo estilos Messenger");
		const addMore = document.querySelector(".addMore");
		messenger.classList.remove("two");
		emoticons.classList.remove("two");
		messenger.replaceChild(attach, addMore);

		//Reseteo;
		resetFiles([]);
		//resetSliderPrev("true");			
	} 

	/*if (message === "") {
		clock.style.bottom = "1px";
	} else {
		clock.style.bottom = "0px";
	}*/

	if (message !== "Mensaje...") {
		document.querySelector(".message").textContent =  "Mensaje...";
	}

	//Galería de imágenes
	const gridImg = document.createElement("DIV");
	for (let i = 0; i < 4; i++) {
		const buttImg = document.createElement("BUTTON");
		buttImg.classList.add("buttImg");
		if (i < 3) {
			const image = document.createElement("IMG");	
			
			image.setAttribute("src", gallery[i]);	
			buttImg.appendChild(image);
		}
		else {
			const lastImg = document.createElement("IMG");
			
			lastImg.setAttribute("src", gallery[i]);	
			buttImg.appendChild(lastImg);		
			if (gallery.length >= 5) {
				const seeMore = document.createElement("IMG");
				
				seeMore.setAttribute("src", "assets/añadir.png");

				buttImg.classList.replace("buttImg", "lastButtImg");	
				seeMore.classList.add("seeMore");
				lastImg.classList.add("lastImg");

				buttImg.appendChild(seeMore);
			}
		}	

		if (gallery[i] !== undefined) {
			fragment.appendChild(buttImg);
		}

		if (i === 3 && gallery.length >= 4) {
			gridImg.classList.add("gridImg");
		}	

		buttImg.addEventListener("click", e => {
			console.log("Hola");
			modal(gallery[i]).then(() => {
				slider(gallery, e.path[0].currentSrc);
			})
		})	
	}

	gridImg.appendChild(fragment);
	contain.insertBefore(gridImg, content);

	return contain;
}

const modifyHTML = (key, refMsg, contain, content, text, clock) => {
	console.log("Modificando HTML");
	const edition = document.createElement("DIV");
	const edit1 = document.createElement("DIV");
	const edit2 = document.createElement("DIV");
	const modify = document.createElement("BUTTON");
	const delet = document.createElement("BUTTON");
	const icon1 = document.createElement("IMG");
	const icon2 = document.createElement("IMG");

	edition.classList.add("edition");
	edit1.classList.add("edit");
	edit2.classList.add("edit");
	modify.classList.add("modify");
	delet.classList.add("delete");
	icon1.setAttribute("src", "assets/modificar.png");
	icon2.setAttribute("src", "assets/eliminar.png");

	modify.appendChild(icon1);
	delet.appendChild(icon2);
	edit1.appendChild(modify);
	edit2.appendChild(delet);
	edition.appendChild(edit1);
	edition.appendChild(edit2);

	contain.appendChild(edition);

	if (gallery.length === 0) {
		edition.style.right = "10px";
		edition.style.top = "5px";
	}
	//----------------------------------------------------------------
	//----------------------------------------------------------------
	const modifyBox = document.createElement("DIV");
	const modifyContent = document.createElement("DIV");
	const modifyText = document.createElement("P");
	const okey = document.createElement("BUTTON");
	const imgOkey = document.createElement("IMG");

	let count = contS;

	modifyBox.classList.add("modifyBox");
	modifyContent.classList.add(`modifyContent-S${count}`);
	okey.classList.add("okey");

	modifyContent.style.width = "auto";
	modifyText.setAttribute("contenteditable", "true");
	modifyText.setAttribute("spellcheck", "false");

	modifyText.textContent = refMsg;
	imgOkey.src = "assets/okey.png";

	modifyContent.appendChild(modifyText);
	okey.appendChild(imgOkey);
	modifyBox.appendChild(modifyContent);
	modifyBox.appendChild(okey);

	//----------------------------------------------------------------
	//----------------------------------------------------------------
	modify.addEventListener("click", e => {
		if (modify.classList.contains("modify")) {
			if (modifyText.textContent !== refMsg) {
				modifyText.textContent = refMsg;				
			}
			contain.replaceChild(modifyBox, content);
			modifyText.focus();

			clock.style.display = "none";
			edit2.style.display = "none";
			modify.classList.replace("modify", "back");
		} 
		else {
			text.textContent = refMsg;
			
			contain.replaceChild(content, modifyBox);
			text.setAttribute("contenteditable", "false");

			clock.style.display = "flex";
			edit2.style.display = "inline-block";
			modify.classList.replace("back", "modify");
		}
	})

	okey.addEventListener("click",  e => {
		refMsg = modifyText.textContent;
		
		text.textContent = modifyText.textContent;
		contain.replaceChild(content, modifyBox);

		clock.style.display = "flex";
		edit2.style.display = "inline-block";
		modify.classList.replace("back", "modify");

		console.log(e.path[1].firstElementChild);
		const element = e.path[1].firstElementChild;
		const className = element.classList.item(0);

		modifyObject(key, text.textContent, className);
	})		

	delet.addEventListener("click", () => {
		channel.removeChild(contain);
		deleteObject(key);
	})
}

//----------------------------------------------------------------------------------------------------
//LAZY LOADING ---------------------------------------------------------------------------------------
const loadMoreHTML = (entry) => {
	if (entry[0].isIntersecting === true) loadHTML(3);
}

const observer = new IntersectionObserver(loadMoreHTML);

let counter = 0;
let boolean = true;
let refHTML = document.createElement("DIV");
const loadHTML = (num) => {
	return new Promise (resolve => {
		console.log("Cargando HTML");
		console.log(counter);
		const fragment = document.createDocumentFragment();	
		for (let i = 0; i < num; i++) {
			if (boolean === true) {
				const newHTML = createHTML(infoDB[counter][0], infoDB[counter][1].type, infoDB[counter][1].message, infoDB[counter][1].documents, infoDB[counter][1].gallery, infoDB[counter][1].time);
				newHTML.classList.add(`ref-${counter}`);

				fragment.appendChild(newHTML);

				//newHTML.innerHTML = "<p>hola</p>"
				refHTML = newHTML;
				console.log(refHTML);
				counter++;
				console.log(counter);
				boolean = false;
			}
			else if (counter < infoDB.length) {
				const newHTML = createHTML(infoDB[counter][0], infoDB[counter][1].type, infoDB[counter][1].message, infoDB[counter][1].documents, infoDB[counter][1].gallery, infoDB[counter][1].time);
				newHTML.classList.add(`ref-${counter}`);
				fragment.insertBefore(newHTML, refHTML);
				//ALTERNATIVA Linea 219:
				//refHTML.before(newHTML);

				refHTML = newHTML;
				console.log(refHTML);
				counter++;
				console.log(counter);
				if (i === num-1) observer.observe(newHTML);
			} 
			else {
				console.log("Carga finalizada");
				observer.disconnect();
				counter = 0;
				boolean = true;
				break;
			}	
		}	

		if (channel.innerHTML === "") {
			channel.appendChild(fragment);
			channel.scrollTop = channel.scrollHeight;
			boolean = true;
		} 
		else {
			const first = channel.firstElementChild;
			channel.insertBefore(fragment, first);
			//ALTERNATIVA Linea 236:
			//first.before(fragment);
			if (counter < infoDB.length) {
				boolean = true;
			}
		}
		resolve(true);
	})
}

//-------------------------------------------------------------------------------------
//CARGA DE DOCUMENTOS E IMÁGENES, CÁMARA DE FOTOS Y UBICACIÓN ACTUAL -------------------
const menu = () => {
	const d = document;
	const boxMenu = d.querySelector(".boxMenu");

	if (boxMenu.classList.contains("active") === false) {
		boxMenu.classList.add("active");
	}
	
	const inputs = d.querySelectorAll(".boxMenu input");

	d.addEventListener("click", (e) => {
		//Documentos
		if(e.target.matches(".document") || e.target.matches(".document *")) {
			//inputs[0].click();
			boxMenu.classList.remove("active");
			alert("Esta funcionalidad se encuentra todavía en desarrollo");
		}
		//Imágenes
		if(e.target.matches(".gallery") || e.target.matches(".gallery *")) {
			inputs[1].click();
			boxMenu.classList.remove("active");
		}
		//Cámara
		if(e.target.matches(".camara") || e.target.matches(".camara *")) {
			console.log("Cargando cámara");
			boxMenu.classList.remove("active");
			camara(".channel");			
		}
		//Ubicación
		if(e.target.matches(".ubication") || e.target.matches(".ubication *")) {
			console.log("Cargando mapa");
			boxMenu.classList.remove("active");

			ubication(".channel");			
		}
		//Cerrar menú
		if(e.target.matches(".exit") || e.target.matches(".exit *")) {
			boxMenu.classList.remove("active");			
		}

		e.stopImmediatePropagation();
	})

	d.addEventListener("change", (e) => {
		if(e.target === inputs[0]) {
			console.log("Cargando documentos");

			/*readDoc(e.target.files).then(result => {
				//sliderPrevisual("doc", result);
			})*/			
		}
		if(e.target === inputs[1]) {
			console.log("Cargando imágenes");

			readImg(e.target.files, (result) => {
				console.log(`Galería png: `, e.target.files);
				console.log(`Galería base64: `, result);
				console.log("Imágenes cargadas correctamente");
				sliderPrevisual("img", result);
			})			
		}

		e.stopImmediatePropagation();
	})
}


const removeAfter = () => {
	if (document.querySelectorAll(".channel > .modalMap").length !== 0) {
		channel.removeChild(document.querySelector(".modalMap"));
	}

	if (document.querySelectorAll(".channel > .modalVideo").length !== 0) {
		channel.removeChild(document.querySelector(".modalVideo"));
	}
}

const placeHolder = () => {
	message.addEventListener("click", () => {
		if (document.querySelector(".message").textContent === "Mensaje...") {
			document.querySelector(".message").textContent = "";
		}
	})

	message.addEventListener("keydown", () => {
		if (document.querySelector(".message").textContent === "Mensaje...") {
			document.querySelector(".message").textContent = "";
		}
	})

	message.addEventListener("keyup", () => {
		if (document.querySelector(".message").textContent === "") {
			document.querySelector(".message").textContent = "Mensaje...";
		}
	})

	channel.addEventListener("click", (e) => {
		if (document.querySelector(".message").textContent === "") {
			document.querySelector(".message").textContent = "Mensaje...";
		}
	})

	header.addEventListener("click", () => {
		if (document.querySelector(".message").textContent === "") {
			document.querySelector(".message").textContent = "Mensaje...";
		}
	})	
}

placeHolder();
//--------------------------------------------------------------------------------------
//EVENTOS-------------------------------------------------------------------------------
emoticons.addEventListener("click", () => {
	emojis(".channel");

	const boxMenu = document.querySelectorAll(".channel > .boxMenu");
	if (boxMenu.length !== 0) {
		boxMenu[0].classList.remove("active");
	}	
})


attach.addEventListener("click", () => {
	menu();

	const emojisDiv = document.querySelectorAll(".channel > .emojisDiv");
	if (emojisDiv.length !== 0) {
		emojisDiv[0].classList.remove("active");
	}
})

let oilS = false;
send.addEventListener("click", () => {
	let message = document.querySelector(".message").textContent;
	let time = messageTime();

	if (message === "Mensaje...") {
		message = "";
	}

	if (oilS === true) {
		contS++;
	}

	if (document.querySelectorAll(".channel > .modalVideo").length !== 0) {
		addObject({
			type: "sent",
			name: "Chat B", 
			message: message, 
			documents: documents,
			gallery: galleryCam,
			time: time
		})
	}

	else if (document.querySelectorAll(".channel > .modalMap").length !== 0) {
		addObject({
			type: "sent",
			name: "Chat B", 
			message: position, 
			documents: documents,
			gallery: galleryCam,
			time: time
		})
	}
	else {
		addObject({
			type: "sent",
			name: "Chat B", 
			message: message, 
			documents: documents,
			gallery: gallery,
			time: time
		})
	}

	removeAfter();
})

//------------------------------------------------------------------------------------
//CANALES DE COMUNICACIÓN ------------------------------------------------------------
let oilR = false;
Channel.addEventListener("message", e => {
	let time = messageTime();

	if (oilR === true) {
		contR++;
	}	

	addObject({
		type: "received",
		name: "Chat B", 
		message: e.data[0], 
		documents: e.data[1],
		gallery: e.data[2], 
		time: time
	})	
})

Channel2.addEventListener("message", e => {
	console.log(e.data);

	const text = e.data[0];
	const className = e.data[1];


	const select = className.substring(15,16);

	const content = document.querySelector(`.content-R${select}`);
	content.textContent = text;

	console.log(content);
})



