"use strict";

//---------------------------------------------------------------------------------------------
//REGISTRO DE SERVICE WORKER ------------------------------------------------------------------
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
//------------------------------------------------------------------------------------------------------
//DECLARACIÓN DE VARIABLES Y CONSTANTES ----------------------------------------------------------------
const container = document.querySelector(".container");
const header = document.querySelector(".header");
const channel = document.querySelector(".channel");
const messenger = document.querySelector(".messenger");
const emoticons = document.querySelector(".emoticons");
const messageBox = document.querySelector(".messageBox");
const message = document.querySelector(".message");
const attach = document.querySelector(".attach");
const send = document.querySelector(".send");
//-----------------------------------------------------------------------------------------------------
//APERTURA DE CANALES ---------------------------------------------------------------------------------
const Channel = new BroadcastChannel("myChannel");
const Channel2 = new BroadcastChannel("myChannel2");
//--------------------------------------------------------------------------------------------------
//CREACIÓN Y MODIFICACIÓN DE LOS ELEMENTOS HTML ----------------------------------------------------
let contS = 0;
let contR = 0;

const createHTML = (key, type, message, documents, images, time) => {
	console.log("Creando elemento HTML");
	const contain = document.createElement("DIV");

	const content = document.createElement("DIV");
	const text = document.createElement("P");
	const okey = document.createElement("BUTTON");

	const clock = document.createElement("DIV");
	const hours = document.createElement("DIV");
	const minutes = document.createElement("DIV");
//------------------------------------------------------------------------------------------
	contain.classList.add(type);
	content.classList.add("content");
	okey.classList.add("okey");
	clock.classList.add("clock");

	if (type == "sent") {
		content.classList.add(`content-S${contS}`);	
		oilS = true;
	}
	else if (type == "received") {
		content.classList.add(`content-R${contR}`);
		oilR = true;
	}
//-----------------------------------------------------------------------------------------	
	const fragment = document.createDocumentFragment();

	for (let i = 0; i < documents.length; i++) {
		const buttDoc = document.createElement("BUTTON");
		const doc = document.createElement("IMG");

		buttDoc.classList.add("buttDoc");
		doc.setAttribute("src", "assets/documento.png");

		buttDoc.style.background = "#30498f";
		buttDoc.style.border = "none";

		buttDoc.appendChild(doc);

		fragment.appendChild(buttDoc);
		if (type == "sent" && document.querySelectorAll(".channel > .modalPrevisual").length != 0) {
			console.log("Eliminando previsualizadas");
			const modalPrev = document.querySelector(".modalPrevisual");
			channel.removeChild(modalPrev);
		}

		if (i == documents.length-1 && document.querySelectorAll(".messenger > .attach").length == 0) {
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

		/*document.querySelector(".quit").addEventListener("click", () => {
			channel.removeChild(document.querySelector(".modalDoc"));
		})*/
	}
	const containImg = document.createElement("DIV");
	for (let i = 0; i < 4; i++) {
		if (i == 0 && type == "sent" && document.querySelectorAll(".channel > .modalPrevisual").length != 0) {
			console.log("Eliminando previsualizadas");
			const modalPrev = document.querySelector(".modalPrevisual");
			channel.removeChild(modalPrev);
		} 

		if (i == 3 && document.querySelectorAll(".messenger > .attach").length == 0) {
			const messTwo = document.querySelector(".messengerTwo");
			console.log(messenger);
			container.replaceChild(messenger, messTwo);
			messenger.insertBefore(messageBox, attach);
			messenger.appendChild(send);
		}	
	//-------------------------------------------------------------------------
		const buttImg = document.createElement("BUTTON");
		buttImg.classList.add("buttImg");
		if (i < 3) {
			const image = document.createElement("IMG");	
			
			image.setAttribute("src", images[i]);	
			buttImg.appendChild(image);
		}
		else {
			const lastImg = document.createElement("IMG");
			
			lastImg.setAttribute("src", images[i]);	
			buttImg.appendChild(lastImg);		
			if (images.length >= 5) {
				const seeMore = document.createElement("IMG");
				
				seeMore.setAttribute("src", "assets/añadir.png");

				buttImg.classList.replace("buttImg", "lastButtImg");	
				seeMore.classList.add("seeMore");
				lastImg.classList.add("lastImg");

				buttImg.appendChild(seeMore);
			}
		}	

		if (images[i] != undefined) {
			fragment.appendChild(buttImg);
		}

		if (i == 3 && images.length >= 4) {
			containImg.classList.add("gridImg");
		}	
	//------------------------------------------------------------	
		buttImg.addEventListener("click", e => {
			console.log("Hola");
			modal(images[i]).then(() => {
				slider(images, e.path[0].currentSrc);
			})
		})	
	}

	resetFiles();
//-----------------------------------------------------------------------------------------	
	containImg.appendChild(fragment);

	content.appendChild(text);

	text.textContent = message;

	hours.textContent = time[0] + ":";
	minutes.textContent = time[1];
	clock.appendChild(hours);
	clock.appendChild(minutes);

	contain.appendChild(containImg);
	contain.appendChild(content);
	contain.appendChild(clock);
//-----------------------------------------------------------------------------------------
	if (type == "sent") {
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

		if (images.length == 0) {
			edition.style.right = "10px";
			edition.style.top = "5px";
		}	
//---------------------------------------------------------------------------------------
		let refMsg = message;
		const modifHTML = modifyHTML(refMsg);

		modify.addEventListener("click", e => {
			if (modify.classList.contains("modify")) {
				if (modifHTML[1].textContent !== refMsg) {
					modifHTML[1].textContent = refMsg;				
				}
				contain.replaceChild(modifHTML[0], content);
				modifHTML[1].focus();

				clock.style.display = "none";
				edit2.style.display = "none";
				modify.classList.replace("modify", "back");
			} 
			else {
				text.textContent = refMsg;
				
				contain.replaceChild(content, modifHTML[0]);
				text.setAttribute("contenteditable", "false");

				clock.style.display = "flex";
				edit2.style.display = "inline-block";
				modify.classList.replace("back", "modify");
			}
		})

		modifHTML[2].addEventListener("click",  e => {
			refMsg = modifHTML[1].textContent;
			
			text.textContent = modifHTML[1].textContent;
			contain.replaceChild(content, modifHTML[0]);

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
	return contain;
}

const modifyHTML = (msg) => {
	console.log("Modificando HTML");
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

	modifyText.textContent = msg;
	imgOkey.src = "assets/okey.png";

	modifyContent.appendChild(modifyText);
	okey.appendChild(imgOkey);
	modifyBox.appendChild(modifyContent);
	modifyBox.appendChild(okey);

	return [modifyBox, modifyText, okey];
}
//----------------------------------------------------------------------------------------------------
//LAZY LOADING ---------------------------------------------------------------------------------------
const loadMoreHTML = (entry) => {
	if (entry[0].isIntersecting == true) loadHTML(2);
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
			if (boolean == true) {
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
				if (i == num-1) observer.observe(newHTML);
			} 
			else {
				console.log("Carga finalizada");
				observer.disconnect();
				counter = 0;
				boolean = true;
				break;
			}	
		}	

		if (channel.innerHTML == "") {
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
//------------------------------------------------------------------------------------------------
//MANEJO DE LA BASE DE DATOS INDEXEDDB -----------------------------------------------------------
const addObject = object => {
	console.log("Agregando objeto");
	const db = IDBRequest.result;
	const transaction = db.transaction("chatting", "readwrite");
	const objectStore = transaction.objectStore("chatting");	

	const request = objectStore.add(object);

	request.addEventListener("success", () => {
		let key = request.result;
		console.log("Objeto agregado correctamente");
		if (object.type == "sent") {
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
		if (object.type == "sent") {
			Channel.postMessage([object.message, object.documents, object.gallery]);
		}
		console.log("Transacción finalizada");
	})
}	

let infoDB = [];
const readObject = () => {
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

				if (value.name == "Chat B") {
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

const modifyObject = (key, modified, className) => {
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

const deleteObject = (key) => {
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
//-------------------------------------------------------------------------------------------
//MANEJO DE LA CARGA DE ARCHIVOS ------------------------------------------------------------
let documents = [];
let contDoc = 0;
const readDoc = files => {
	return new Promise (resolve => {
		for (let i = 0; i < files.length; i++) {
			const reader = new FileReader;
			reader.readAsText(files[i]);
			reader.addEventListener("load", e => {
				modalPrevisual("doc", contDoc, e.currentTarget.result);
				contDoc = contDoc + 1;

				console.log(contDoc);
				if (i == (files.length-1)) {
					console.log("una vez");
					resolve(contDoc-1);
				}
			})
		}
		console.log("Documentos cargados correctamente");
		console.log(documents);
		//messageBox.appendChild(fragment);
	})
}

let gallery = [];
let contImg = 0;
const readImg = files => {
	return new Promise (resolve => {
		for (let i = 0; i < files.length; i++) {
			const reader = new FileReader;
			reader.readAsDataURL(files[i]);
			reader.addEventListener("load", e => {
				modalPrevisual("img", contImg, e.currentTarget.result);
				contImg = contImg + 1;
				console.log(contImg);
				if (i == (files.length-1)) {
					console.log("una vez");
					resolve(contImg-1);
				}
			})
		}

		console.log("Imágenes cargadas correctamente");
		console.log(gallery);
		//messageBox.appendChild(fragment);
	})
}

const resetFiles = files => {
	if(document.querySelector(".message").textContent !== "Mensaje...") {
		document.querySelector(".message").textContent = "Mensaje...";
	}
	gallery = [];
	documents = [];
	contImg = 0;
	contDoc = 0;
	lala = true;
}
//----------------------------------------------------------------------------------------
//DETERMINACIÓN DE LA HORA DE ENVÍO ------------------------------------------------------
const addZeros = n => {
	if (n.toString().length < 2) return	"0".concat(n);
	return `${n}`;
}

const messageTime = () => {
	const time = new Date();
	let hours = addZeros(time.getHours());
	let minutes = addZeros(time.getMinutes());
	return [hours, minutes];
}

//----------------------------------------------------------------------------------------
//CÁMARA DE FOTOS ------------------------------------------------------------------------
const camara = () => {
	const modalVideo = document.createElement("DIV");
	const boxVideo = document.createElement("DIV");
	let video = document.createElement("VIDEO");

	const canvas = document.createElement("CANVAS");

	const controls = document.createElement("DIV");
	const screenShot = document.createElement("BUTTON");
	const imgShot = document.createElement("IMG");

	const boxImgCaptured = document.createElement("DIV");
	const imgCaptured = document.createElement("IMG");

	const exit = document.createElement("DIV");
	const imgExit = document.createElement("IMG");
	/*const atributions = document.createElement("DIV");*/

	/*atributions.classList.add("atributions");
	atributions.innerHTML = `
		<h2 class="atributions-title">Atribuciones de íconos utilizados</h2>
		<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/srip" title="srip"> srip </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Iconos diseñados por <a href="https://www.freepik.com" title="Freepik"> Freepik </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Icons made by <a href="https://www.freepik.com" title="Freepik"> Freepik </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com'</a></div>
		<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/those-icons" title="Those Icons"> Those Icons </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/andrean-prabowo" title="Andrean Prabowo"> Andrean Prabowo </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/uniconlabs" title="Uniconlabs"> Uniconlabs </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/sumberrejeki" title="SumberRejeki"> SumberRejeki </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/smartline" title="Smartline"> Smartline </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Iconos diseñados por <a href="" title="inkubators"> inkubators </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/kendis-lasman" title="kendis lasman"> kendis lasman </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Icons made by <a href="https://www.flaticon.com/authors/roundicons" title="Roundicons"> Roundicons </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com'</a></div>
	`

	modalVideo.appendChild(atributions);*/

	modalVideo.classList.add("modalVideo");
	boxVideo.classList.add("boxVideo");
	canvas.classList.add("canvas");
	controls.classList.add("controls");
	screenShot.classList.add("screenshot");
	boxImgCaptured.classList.add("boxImgCaptured");
	imgCaptured.classList.add("imgCaptured");
	exit.classList.add("quitit");

	imgShot.setAttribute("src", "assets/camara.png");
	imgExit.setAttribute("src", "assets/equis.png");

	screenShot.appendChild(imgShot);
	controls.appendChild(screenShot);
	boxImgCaptured.appendChild(imgCaptured);
	exit.appendChild(imgExit);

	//Solicitar permiso al usuario. Si se concede permiso, 
	//se devuelve una promise
	navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
		console.log(stream);

		video.srcObject = stream;

		video.addEventListener("loadedmetadata", () => {
			video.play();

			boxVideo.appendChild(video);
			boxVideo.appendChild(controls);
			boxVideo.appendChild(exit);

			modalVideo.appendChild(boxVideo);
			channel.appendChild(modalVideo);
		})

		exit.addEventListener("click", () => {
			channel.removeChild(modalVideo);
		})

	}).catch((err) => console.log(err))

	let cont = 0;
	console.log(cont);
	screenShot.addEventListener("click", () => {
	    canvas.width = video.videoWidth;
	    canvas.height = video.videoHeight;
		let ctx = canvas.getContext("2d");
		ctx.drawImage(video, 0, 0);
		imgCaptured.src = canvas.toDataURL("image/webp");

		
		if (document.querySelectorAll(".modalVideo > .boxImgCaptured").length === 0) {
			//modalVideo.style.flexDirection = "column";
			console.log("Hola baby");
			boxVideo.appendChild(boxImgCaptured);
		}

		gallery[cont] = imgCaptured.src;
		cont++;
		console.log(gallery);
		console.log(cont);
	})
}

//----------------------------------------------------------------------------------------
//UBICACIÓN ACTUAL -----------------------------------------------------------------------
const ubication = () => {
	const modalMap = document.createElement("DIV");
	const boxMap = document.createElement("DIV");
	const viewMap = document.createElement("DIV");
	viewMap.style.height = "100%";
	viewMap.style.width = "100%";

	/*const atributions = document.createElement("DIV");
	atributions.classList.add("atributions");
	atributions.innerHTML = `
		<h2 class="atributions-title">Atribuciones de íconos utilizados</h2>
		<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/srip" title="srip"> srip </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Iconos diseñados por <a href="https://www.freepik.com" title="Freepik"> Freepik </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Icons made by <a href="https://www.freepik.com" title="Freepik"> Freepik </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com'</a></div>
		<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/those-icons" title="Those Icons"> Those Icons </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/andrean-prabowo" title="Andrean Prabowo"> Andrean Prabowo </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/uniconlabs" title="Uniconlabs"> Uniconlabs </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/sumberrejeki" title="SumberRejeki"> SumberRejeki </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/smartline" title="Smartline"> Smartline </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Iconos diseñados por <a href="" title="inkubators"> inkubators </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/kendis-lasman" title="kendis lasman"> kendis lasman </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
		<div> Icons made by <a href="https://www.flaticon.com/authors/roundicons" title="Roundicons"> Roundicons </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com'</a></div>
	`

	modalMap.appendChild(atributions);*/

	const exit = document.createElement("DIV");
	const imgExit = document.createElement("IMG");

	modalMap.classList.add("modalMap");
	boxMap.classList.add("boxMap");
	viewMap.id = "map";
	exit.classList.add("quitit");

	imgExit.setAttribute("src", "assets/equis.png");

	exit.appendChild(imgExit);

	boxMap.appendChild(viewMap);

	modalMap.appendChild(boxMap);
	modalMap.appendChild(exit);
	
	channel.appendChild(modalMap);

	navigator.geolocation.getCurrentPosition(
	  	(pos) => {
		  	console.log(pos);
		    
		    let latitude = pos.coords.latitude;
		    let longitude = pos.coords.longitude;

			const map = L.map('map').setView([latitude, longitude], 13);

			L.tileLayer('https://c.tile.openstreetmap.de/{z}/{x}/{y}.png', {
			    maxZoom: 19,
			    attribution: '© OpenStreetMap'
			}).addTo(map);

		    L.marker([latitude, longitude]).addTo(map);

			map.doubleClickZoom.disable();
			map.on('dblclick', e => {
				let latLng = map.mouseEventToLatLng(e.originalEvent);
				console.log(latLng);

				L.marker([latLng.lat, latLng.lng]).addTo(map);
			})

			exit.addEventListener("click", () => {
				channel.removeChild(modalMap);
			})
	  	},
	  	(error) => {
	   		console.log(error)
	  	},
	  	{
		    enableHighAccuracy: true,
		    timeout: 1000,
		    maximumAge: 0
	  	}
	)
}

//-------------------------------------------------------------------------------------
//CARGA DE DOCUMENTOS E IMÁGENES, CÁMARA DE FOTOS Y UBICACIÓN ACTUAL -------------------
const menu = () => {
	const boxMenu = document.createElement("DIV");
	const menu = document.createElement("DIV");

	const doc = document.createElement("DIV");
	const gall = document.createElement("DIV");
	const cam = document.createElement("DIV");
	const ubic = document.createElement("DIV");

	const exit = document.createElement("DIV");
//-----------------------------------------------------
	boxMenu.classList.add("boxMenu");
	menu.classList.add("menu");

	doc.classList.add("item", "document");
	gall.classList.add("item", "gallery");
	cam.classList.add("item", "camara");
	ubic.classList.add("item", "ubication");

	exit.classList.add("exit");
//-----------------------------------------------------
	const inpDoc = document.createElement("INPUT");
	const inpGall = document.createElement("INPUT");
	const inpCam = document.createElement("INPUT");
	const inpUbic = document.createElement("INPUT");

	inpDoc.setAttribute("type", "file");
	inpDoc.setAttribute("multiple", "multiple");
	inpDoc.style.display = "none";
	inpGall.setAttribute("type", "file");
	inpGall.setAttribute("multiple", "multiple");
	inpGall.style.display = "none";
//-----------------------------------------------------
	const imgDoc = document.createElement("IMG");
	const imgGall = document.createElement("IMG");
	const imgCam = document.createElement("IMG");
	const imgUbic = document.createElement("IMG");

	const imgExit = document.createElement("IMG");

	imgDoc.setAttribute("src", "assets/documento.png");
	imgGall.setAttribute("src", "assets/galeria.png");
	imgCam.setAttribute("src", "assets/camara.png");
	imgUbic.setAttribute("src", "assets/ubicacion.png");

	imgExit.setAttribute("src", "assets/equis.png");
//------------------------------------------------------
	doc.appendChild(inpDoc);
	doc.appendChild(imgDoc);
	gall.appendChild(inpGall);
	gall.appendChild(imgGall);
	cam.appendChild(imgCam);
	ubic.appendChild(imgUbic);
	exit.appendChild(imgExit);

	menu.appendChild(doc);
	menu.appendChild(gall);
	menu.appendChild(cam);
	menu.appendChild(ubic);
	menu.appendChild(exit);

	boxMenu.appendChild(menu);

	channel.appendChild(boxMenu);
//------------------------------------------------------
	doc.addEventListener("click", () => {
		inpDoc.click();
	})
	inpDoc.addEventListener("change", e => {
		console.log("Cargando documentos");
		channel.removeChild(boxMenu);
		readDoc(e.target.files).then(result => {
			sliderPrevisual("doc", result);
		})
	})

	gall.addEventListener("click", () => {
		inpGall.click();
	})
	inpGall.addEventListener("change", e => {
		console.log("Cargando imágenes");
		channel.removeChild(boxMenu);

		readImg(e.target.files).then(result => {
			sliderPrevisual("img", result);
		})
	})

	cam.addEventListener("click", () => {
		console.log("Cargando cámara");
		channel.removeChild(boxMenu);
		camara();
	})

	ubic.addEventListener("click", () => {
		console.log("Cargando mapa");
		channel.removeChild(boxMenu);
		ubication();
	})

	exit.addEventListener("click", () => {
		channel.removeChild(boxMenu);
	})
}


//-----------------------------------------------------------------------------------
//EMOJIS-----------------------------------------------------------------------------
const emojis = () => {
	return new Promise (resolve => {
		const emojisDiv = document.createElement("DIV");
		const emojisBox = document.createElement("DIV");
		const emojisTypes = document.createElement("DIV");
		const emojisContainer = document.createElement("DIV");

		const div1 = document.createElement("DIV");
		const div2 = document.createElement("DIV");
		const div3 = document.createElement("DIV");
		const div4 = document.createElement("DIV");
		const div5 = document.createElement("DIV");

		const group1 = document.createElement("BUTTON");
		const group2 = document.createElement("BUTTON");
		const group3 = document.createElement("BUTTON");
		const group4 = document.createElement("BUTTON");
		const group5 = document.createElement("BUTTON");

		const exit = document.createElement("DIV");
		const imgExit = document.createElement("IMG");
		imgExit.setAttribute("src", "assets/equis.png");

		/*const atributions = document.createElement("DIV");
		atributions.classList.add("atributions");
		atributions.innerHTML = `
			<h2 class="atributions-title">Atribuciones de íconos utilizados</h2>
			<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/srip" title="srip"> srip </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
			<div> Iconos diseñados por <a href="https://www.freepik.com" title="Freepik"> Freepik </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
			<div> Icons made by <a href="https://www.freepik.com" title="Freepik"> Freepik </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com'</a></div>
			<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/those-icons" title="Those Icons"> Those Icons </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
			<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/andrean-prabowo" title="Andrean Prabowo"> Andrean Prabowo </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
			<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/uniconlabs" title="Uniconlabs"> Uniconlabs </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
			<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/sumberrejeki" title="SumberRejeki"> SumberRejeki </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
			<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/smartline" title="Smartline"> Smartline </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
			<div> Iconos diseñados por <a href="" title="inkubators"> inkubators </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
			<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/kendis-lasman" title="kendis lasman"> kendis lasman </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
			<div> Icons made by <a href="https://www.flaticon.com/authors/roundicons" title="Roundicons"> Roundicons </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com'</a></div>
		`

		container.appendChild(atributions);*/

		emojisDiv.classList.add("emojisDiv");
		emojisBox.classList.add("emojisBox");
		emojisTypes.classList.add("emojisTypes");
		emojisContainer.classList.add("emojisContainer");

		exit.classList.add("exitit");

		div1.classList.add("div1");
		div2.classList.add("div2");
		div3.classList.add("div3");
		div4.classList.add("div4");
		div5.classList.add("div5");

		group1.classList.add("group1");
		group2.classList.add("group2");
		group3.classList.add("group3");
		group4.classList.add("group4");
		group5.classList.add("group5");

		group1.innerHTML = "&#x1F600";
		group2.innerHTML = "&#x1F43B";
		group3.innerHTML = "&#x1F30E";
		group4.innerHTML = "&#x26BD";
		group5.innerHTML = "&#x1F4BF";

		exit.appendChild(imgExit);

		div1.appendChild(group1);
		div2.appendChild(group2);
		div3.appendChild(group3);
		div4.appendChild(group4);
		div5.appendChild(group5);

		emojisTypes.appendChild(div1);
		emojisTypes.appendChild(div2);
		emojisTypes.appendChild(div3);
		emojisTypes.appendChild(div4);
		emojisTypes.appendChild(div5);

		emojisBox.appendChild(emojisTypes);
		emojisBox.appendChild(emojisContainer);
		emojisBox.appendChild(exit);

		emojisDiv.appendChild(emojisBox);
		channel.appendChild(emojisDiv);
	//-------------------------------------------------------------
		let smiles = [];
		let animals = [];
		let travel = [];
		let activities = [];
		let objects = [];

		fetch("emojiList.json")
		.then((res) => {
			return res.json();
		})
		.then((res) => {
			console.log(res);

			smiles = res["Smileys & People"];
			console.log("Smileys & People", smiles);

			animals = res["Animals & Nature"];
			console.log("Animals & Nature", animals);

			travel = res["Travel & Places"];
			console.log("Travel & Places", travel);

			activities = res["Activities"];
			console.log("Activities", activities);

			objects = res["Objects"];
			console.log("Objects", objects);

			group1.click();
		})

		group1.addEventListener("click", () => {
			const emojisContainer = document.querySelector(".emojisContainer");
			const emojis1 = document.createElement("DIV");
			emojis1.classList.add("emojis");

			if (group1.style.background !== "#303030") {
				group1.style.background = "#303030";
				group2.style.background = "#404040";
				group3.style.background = "#404040";
				group4.style.background = "#404040";
				group5.style.background = "#404040";

				group1.style.borderBottom = "3px solid #209cff";
				group2.style.borderBottom = "none";
				group3.style.borderBottom = "none";
				group4.style.borderBottom = "none";
				group5.style.borderBottom = "none";
			}	

			const fragment = document.createDocumentFragment();
			for (let i = 0; i < smiles.length; i++) {
				let emoji = document.createElement("BUTTON");
				emoji.classList.add("emoji");
				let x = smiles[i].code.substring(0,7).substring(2,7);
				emoji.innerHTML = "&#x" + x;
				console.log(x)
				fragment.appendChild(emoji);
				//averiguar posicion del cursor en un textarea
				emoji.addEventListener("click", () => {
					if (document.querySelector(".message").textContent == "Mensaje...") {
						document.querySelector(".message").textContent = "";
					}

					let message = document.querySelector(".message").textContent;
					let z = emoji.textContent;
					document.querySelector(".message").textContent = message + " " + z;
					
					console.log(message);
					console.log(z);
					//Averiguar sobre String.fromCodePoint();
					//document.querySelector(".message").innerHTML = String.fromCodePoint(0x1F525);
				})
			}

			if (document.querySelectorAll(".emojisContainer > .emojis").length == 0) {
				emojis1.appendChild(fragment);
				emojisContainer.appendChild(emojis1);
			}
			else {
				const first = emojisContainer.firstElementChild;
				emojisContainer.removeChild(first);
				emojis1.appendChild(fragment);
				emojisContainer.appendChild(emojis1);
			}
		})

		group2.addEventListener("click", () => {
			const emojisContainer = document.querySelector(".emojisContainer");
			const emojis2 = document.createElement("DIV");
			emojis2.classList.add("emojis");

			if (group2.style.background !== "#303030") {
				group1.style.background = "#404040";
				group2.style.background = "#303030";
				group3.style.background = "#404040";
				group4.style.background = "#404040";
				group5.style.background = "#404040";

				group1.style.borderBottom = "none";
				group2.style.borderBottom = "3px solid #209cff";
				group3.style.borderBottom = "none";
				group4.style.borderBottom = "none";
				group5.style.borderBottom = "none";
			}

			const fragment = document.createDocumentFragment();
			for (let i = 0; i < animals.length; i++) {
				let emoji = document.createElement("BUTTON");
				emoji.classList.add("emoji");
				let x = animals[i].code.substring(0,7).substring(2,7);
				emoji.innerHTML = "&#x" + x;
				console.log(x)
				fragment.appendChild(emoji);

				emoji.addEventListener("click", () => {
					let message = document.querySelector(".message").textContent;
					let z = emoji.textContent;
					document.querySelector(".message").textContent = message + " " + z;
					
					console.log(message);
					console.log(z);
				})
			}

			if (document.querySelectorAll(".emojisContainer > .emojis").length == 0) {
				emojis2.appendChild(fragment);
				emojisContainer.appendChild(emojis2);
			}
			else {
				const first = emojisContainer.firstElementChild;
				emojisContainer.removeChild(first);
				emojis2.appendChild(fragment);
				emojisContainer.appendChild(emojis2);
			}
		})

		group3.addEventListener("click", () => {
			const emojisContainer = document.querySelector(".emojisContainer");
			const emojis3 = document.createElement("DIV");
			emojis3.classList.add("emojis");

			if (group3.style.background !== "#303030") {
				group1.style.background = "#404040";
				group2.style.background = "#404040";
				group3.style.background = "#303030";
				group4.style.background = "#404040";
				group5.style.background = "#404040";

				group1.style.borderBottom = "none";
				group2.style.borderBottom = "none";
				group3.style.borderBottom = "3px solid #209cff";
				group4.style.borderBottom = "none";
				group5.style.borderBottom = "none";
			}

			const fragment = document.createDocumentFragment();
			for (let i = 0; i < travel.length; i++) {
				let emoji = document.createElement("BUTTON");
				emoji.classList.add("emoji");
				let x = travel[i].code.substring(0,7).substring(2,7);
				emoji.innerHTML = "&#x" + x;
				console.log(x)
				fragment.appendChild(emoji);

				emoji.addEventListener("click", () => {
					let message = document.querySelector(".message").textContent;
					let z = emoji.textContent;
					document.querySelector(".message").textContent = message + " " + z;
					
					console.log(message);
					console.log(z);
				})
			}

			if (document.querySelectorAll(".emojisContainer > .emojis").length == 0) {
				emojis3.appendChild(fragment);
				emojisContainer.appendChild(emojis3);
			}
			else {
				const first = emojisContainer.firstElementChild;
				emojisContainer.removeChild(first);
				emojis3.appendChild(fragment);
				emojisContainer.appendChild(emojis3);
			}
		})

		group4.addEventListener("click", () => {
			const emojisContainer = document.querySelector(".emojisContainer");
			const emojis4 = document.createElement("DIV");
			emojis4.classList.add("emojis");

			if (group4.style.background !== "#303030") {
				group1.style.background = "#404040";
				group2.style.background = "#404040";
				group3.style.background = "#404040";
				group4.style.background = "#303030";
				group5.style.background = "#404040";

				group1.style.borderBottom = "none";
				group2.style.borderBottom = "none";
				group3.style.borderBottom = "none";
				group4.style.borderBottom = "3px solid #209cff";
				group5.style.borderBottom = "none";
			}

			const fragment = document.createDocumentFragment();
			for (let i = 0; i < activities.length; i++) {
				let emoji = document.createElement("BUTTON");
				emoji.classList.add("emoji");
				let x = activities[i].code.substring(0,7).substring(2,7);
				emoji.innerHTML = "&#x" + x;
				console.log(x)
				fragment.appendChild(emoji);

				emoji.addEventListener("click", () => {
					let message = document.querySelector(".message").textContent;
					let z = emoji.textContent;
					document.querySelector(".message").textContent = message + " " + z;
					
					console.log(message);
					console.log(z);
				})
			}

			if (document.querySelectorAll(".emojisContainer > .emojis").length == 0) {
				emojis4.appendChild(fragment);
				emojisContainer.appendChild(emojis4);
			}
			else {
				const first = emojisContainer.firstElementChild;
				emojisContainer.removeChild(first);
				emojis4.appendChild(fragment);
				emojisContainer.appendChild(emojis4);
			}
		})

		group5.addEventListener("click", () => {
			const emojisContainer = document.querySelector(".emojisContainer");
			const emojis5 = document.createElement("DIV");
			emojis5.classList.add("emojis");

			if (group5.style.background !== "#303030") {
				group1.style.background = "#404040";
				group2.style.background = "#404040";
				group3.style.background = "#404040";
				group4.style.background = "#404040";
				group5.style.background = "#303030";

				group1.style.borderBottom = "none";
				group2.style.borderBottom = "none";
				group3.style.borderBottom = "none";
				group4.style.borderBottom = "none";
				group5.style.borderBottom = "3px solid #209cff";
			}

			const fragment = document.createDocumentFragment();
			for (let i = 0; i < objects.length; i++) {
				let emoji = document.createElement("BUTTON");
				emoji.classList.add("emoji");
				let x = objects[i].code.substring(0,7).substring(2,7);
				emoji.innerHTML = "&#x" + x;
				console.log(x)
				fragment.appendChild(emoji);

				emoji.addEventListener("click", () => {
					let message = document.querySelector(".message").textContent;
					/*let zSizer = document.querySelector(".emoji-sizer");
					zSizer.style.fontSize = "30px";*/

					let z = emoji.textContent;

					document.querySelector(".message").textContent = message + " " + z;
					
					console.log(message);
					console.log(z);
				})
			}

			if (document.querySelectorAll(".emojisContainer > .emojis").length == 0) {
				emojis5.appendChild(fragment);
				emojisContainer.appendChild(emojis5);
			}
			else {
				const first = emojisContainer.firstElementChild;
				emojisContainer.removeChild(first);
				emojis5.appendChild(fragment);
				emojisContainer.appendChild(emojis5);
			}
		})

		exit.addEventListener("click", () => {
			channel.removeChild(emojisDiv);
		})
	})
}
//----------------------------------------------------------------------------------
//MODALES Y SLIDERS-----------------------------------------------------------------
const modalPrevisual = (id, cont, src) => {
	if (id == "img") {
		if (cont == 0) {
			const modalPrev = document.createElement("DIV");
			const boxPrev = document.createElement("DIV");
			const boxImg = document.createElement("DIV");
			const newImg = document.createElement("IMG");			
			const exit = document.createElement("DIV");
			const imgExit = document.createElement("IMG");

			/*const atributions = document.createElement("DIV");
			atributions.classList.add("atributions");
			atributions.innerHTML = `
				<h2 class="atributions-title">Atribuciones de íconos utilizados</h2>
				<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/srip" title="srip"> srip </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Iconos diseñados por <a href="https://www.freepik.com" title="Freepik"> Freepik </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Icons made by <a href="https://www.freepik.com" title="Freepik"> Freepik </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com'</a></div>
				<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/those-icons" title="Those Icons"> Those Icons </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/andrean-prabowo" title="Andrean Prabowo"> Andrean Prabowo </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/uniconlabs" title="Uniconlabs"> Uniconlabs </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/sumberrejeki" title="SumberRejeki"> SumberRejeki </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/smartline" title="Smartline"> Smartline </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Iconos diseñados por <a href="" title="inkubators"> inkubators </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/kendis-lasman" title="kendis lasman"> kendis lasman </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Icons made by <a href="https://www.flaticon.com/authors/roundicons" title="Roundicons"> Roundicons </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com'</a></div>
			`

			modalPrev.appendChild(atributions);*/

			modalPrev.classList.add("modalPrevisual");
			boxPrev.classList.add("boxPrevisual");
			boxImg.classList.add("boxImg");
			newImg.classList.add(`img-${cont}`);
			exit.classList.add("quit");

			newImg.setAttribute("src", src);
			imgExit.setAttribute("src", "assets/equis.png");
//---------------------------------------------------------------------
			const messTwo = document.createElement("SECTION");

			const emotTwo = document.createElement("BUTTON");
			const imgTwo = document.createElement("IMG");
			const addMore = document.createElement("BUTTON");
			const imgAdd = document.createElement("IMG");

			messTwo.classList.add("messengerTwo");
			emotTwo.classList.add("emoticonsTwo");
			addMore.classList.add("addMore");

			imgTwo.src = "assets/emoticon.png";
			imgAdd.src = "assets/agregarMas.png";
			
			emotTwo.appendChild(imgTwo);
			addMore.appendChild(imgAdd);

			messTwo.appendChild(emotTwo);
			messTwo.appendChild(messageBox);
			messTwo.appendChild(addMore);
			messTwo.appendChild(send);

			container.replaceChild(messTwo, messenger);
			//---------------------------------------------
			exit.appendChild(imgExit);
			boxImg.appendChild(newImg);
			boxPrev.appendChild(boxImg);
			modalPrev.appendChild(boxPrev);
			modalPrev.appendChild(exit);

			channel.appendChild(modalPrev);

			gallery[cont] = src;
			//-------------------------------------------------------
			emotTwo.addEventListener("click", () => {
				emojis();
			})

			exit.addEventListener("click", () => {
				channel.removeChild(modalPrev);
				container.replaceChild(messenger, messTwo);
				messenger.insertBefore(messageBox, attach);
				messenger.appendChild(send);
			})
		}

		else if (cont > 0 && cont < 3) {
			const boxPrev = document.querySelector(".boxPrevisual");

			const boxImg = document.createElement("DIV");
			const newImg = document.createElement("IMG");
			
			boxImg.classList.add("boxImg");
			newImg.classList.add(`img-${cont}`);
			newImg.setAttribute("src", src);
			
			boxImg.appendChild(newImg);
			boxPrev.appendChild(boxImg);

			gallery[cont] = src;
		}

		else if (cont == 3) {
			console.log("esolas");
			gallery[cont] = src;

			for (let i = 0; i < 3; i++) {
				document.querySelector(`.img-${2 - i}`).src = gallery[cont - i];
			}
		}

		else {
			gallery[cont] = src;

			for (let i = 0; i < 3; i++) {
				document.querySelector(`.img-${2 - i}`).src = gallery[cont - i];
			}	
		}
	}
	else {
		if (cont == 0) {
			const modalPrev = document.createElement("DIV");
			const boxPrev = document.createElement("DIV");
			modalPrev.classList.add("modalPrevisual");
			boxPrev.classList.add("boxPrevisual");

			const boxDoc = document.createElement("DIV");
			const newDoc = document.createElement("IMG");
			boxDoc.classList.add("boxDoc");
			newDoc.classList.add(`doc-${cont}`);
			newDoc.setAttribute("src", "assets/documento.png");

			const emotTwo = document.createElement("BUTTON");
			const imgTwo = document.createElement("IMG");
			emotTwo.classList.add("emoticonsTwo");
			imgTwo.src = "assets/emoticon.png";

			const addMore = document.createElement("BUTTON");
			const imgAdd = document.createElement("IMG");
			addMore.classList.add("addMore");
			imgAdd.src = "assets/agregarMas.png";

			const messTwo = document.createElement("SECTION");
			messTwo.classList.add("messengerTwo");
			
			emotTwo.appendChild(imgTwo);
			addMore.appendChild(imgAdd);

			messTwo.appendChild(emotTwo);
			messTwo.appendChild(messageBox);
			messTwo.appendChild(addMore);
			messTwo.appendChild(send);

			container.replaceChild(messTwo, messenger);
			//--------------------------------------------	
			boxDoc.appendChild(newDoc);
			boxPrev.appendChild(boxDoc);
			modalPrev.appendChild(boxPrev);

			channel.appendChild(modalPrev);

			documents[cont] = src;
			//-------------------------------------------------------
			const inpAdd = document.createElement("INPUT");
			inpAdd.setAttribute("type", "file");
			inpAdd.setAttribute("multiple", "multiple");
			inpAdd.style.display = "none";
			addMore.appendChild(inpAdd);

			addMore.addEventListener("click", () => {
				inpAdd.click();
			})
			
			inpAdd.addEventListener("change", e => {
				console.log("Cargando imágenes");
				readDoc(e.target.files).then(result => {
					sliderPrevisual("doc", result);
				})
			})
		}

		else if (cont > 0 && cont < 3) {7
			const boxPrev = document.querySelector(".boxPrevisual");

			const boxDoc = document.createElement("DIV");
			const newDoc = document.createElement("IMG");
			
			boxDoc.classList.add("boxDoc");
			newDoc.classList.add(`doc-${cont}`);
			newDoc.setAttribute("src", "assets/documento.png");
			
			boxDoc.appendChild(newDoc);
			boxPrev.appendChild(boxDoc);

			documents[cont] = src;
		}

		else if (cont == 3) {
			console.log("esolas");
			documents[cont] = src;

			for (let i = 0; i < 3; i++) {
				document.querySelector(`.doc-${2 - i}`).src = "assets/documento.png";
			}
		}

		else {
			documents[cont] = src;

			for (let i = 0; i < 3; i++) {
				document.querySelector(`.doc-${2 - i}`).src = "assets/documento.png";
			}	

			/*const next = document.querySelector(".next");
			const previous = document.querySelector(".previous");

			next.removeEventListener("click", next);
			previous.removeEventListener("click", previous);*/
		}
	}
}

let lala = true;
const sliderPrevisual = (id, cont) => {
	if (lala == true) {
		console.log("Entrando");
		const boxPrev = document.querySelector(".boxPrevisual");

		const next = document.createElement("DIV");
		const previous = document.createElement("DIV");
		const imgNext = document.createElement("IMG");
		const imgPrevious = document.createElement("IMG");
		
		next.classList.add("next", "buttons");
		previous.classList.add("previous", "buttons");
		imgNext.setAttribute("src", "assets/next.png");
		imgPrevious.setAttribute("src", "assets/previous.png");
		
		next.appendChild(imgNext);
		previous.appendChild(imgPrevious);
		boxPrev.appendChild(next);
		boxPrev.appendChild(previous);
		next.style.display = "none";
		previous.style.display = "none";

		lala = false;
	}
	console.log("cont: ", cont)
	const next = document.querySelector(".next");
	const previous = document.querySelector(".previous");

	if (id == "img") {
		if (gallery.length > 3) {
			previous.style.display = "block";
		}

		next.addEventListener("click", () => {
			if (cont == 2) {
				previous.style.display = "block";
			}
			if (cont < contImg) {
				for (let i = 0; i < 3; i++) {
					document.querySelector(`.img-${i}`).src = gallery[i + (cont-1)];
				}
				cont++;
				console.log(cont);	
			}
			if (cont == (contImg-1)) {
				next.style.display = "none";
			}
		})

		previous.addEventListener("click", () => {
			if (cont == (contImg-1)) {
				next.style.display = "block";
			}
			if (cont >= 3) {
				for (let i = 0; i < 3; i++) {
					document.querySelector(`.img-${2 - i}`).src = gallery[(cont) - (i+1)];
				}
				cont--;
				console.log(cont);
			}	
			if (cont == 2) {
				previous.style.display = "none";
			}
		})
		//----------------------------------------------------------
		const addMore = document.querySelector(".addMore");
		const inpAdd = document.createElement("INPUT");
		inpAdd.setAttribute("type", "file");
		inpAdd.setAttribute("multiple", "multiple");
		inpAdd.style.display = "none";
		addMore.appendChild(inpAdd);

		addMore.addEventListener("click", () => {
			inpAdd.click();
		})
		
		inpAdd.addEventListener("change", e => {
			console.log("Cargando imágenes");
			readImg(e.target.files).then(result => {
				cont = result;
				if (next.style.display == "block") {
					next.style.display = "none";
					previous.style.display = "block";
				}
				else if (next.style.display == "block" && previous.style.display == "block") {
					next.style.display = "none";
				}
				else {
					console.log("última");
				}
				console.log("cont: ", cont);
			})
		})
	}
	else {
		if (documents.length > 3) {
			previous.style.display = "block";
		}

		next.addEventListener("click", () => {
			if (cont == 2) {
				previous.style.display = "block";
			}
			if (cont < contDoc) {
				for (let i = 0; i < 3; i++) {
					document.querySelector(`.doc-${i}`).src = "assets/documento.png";
				}
				cont++;
				console.log(cont);	
			}
			if (cont == (contDoc-1)) {
				next.style.display = "none";
			}
		})

		previous.addEventListener("click", () => {
			if (cont == (contDoc-1)) {
				next.style.display = "block";
			}
			if (cont >= 3) {
				for (let i = 0; i < 3; i++) {
					document.querySelector(`.doc-${2 - i}`).src = "assets/documento.png";
				}
				cont--;
				console.log(cont);
			}	
			if (cont == 2) {
				previous.style.display = "none";
			}
		})
	}
}

let lalo = true;
const modal = image => {
	return new Promise (resolve => {
		const modalImg = document.createElement("DIV");
		const readImg = document.createElement("DIV");
		const boxImge = document.createElement("DIV");
		const img = document.createElement("IMG");
		const quit = document.createElement("DIV");
		const imgQuit = document.createElement("IMG");

		/*const atributions = document.createElement("DIV");
		atributions.classList.add("atributions");
		atributions.innerHTML = `
				<h2 class="atributions-title">Atribuciones de íconos utilizados</h2>
				<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/srip" title="srip"> srip </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Iconos diseñados por <a href="https://www.freepik.com" title="Freepik"> Freepik </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Icons made by <a href="https://www.freepik.com" title="Freepik"> Freepik </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com'</a></div>
				<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/those-icons" title="Those Icons"> Those Icons </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/andrean-prabowo" title="Andrean Prabowo"> Andrean Prabowo </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/uniconlabs" title="Uniconlabs"> Uniconlabs </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/sumberrejeki" title="SumberRejeki"> SumberRejeki </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/smartline" title="Smartline"> Smartline </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Iconos diseñados por <a href="" title="inkubators"> inkubators </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/kendis-lasman" title="kendis lasman"> kendis lasman </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>
				<div> Icons made by <a href="https://www.flaticon.com/authors/roundicons" title="Roundicons"> Roundicons </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com'</a></div>
		`*/

		img.setAttribute("src", image);
		modalImg.classList.add("modalImg");
		readImg.classList.add("readImg");
		boxImge.classList.add("boxImge");
		img.classList.add(`img`);
		quit.classList.add("quit");

		imgQuit.setAttribute("src", "assets/equis.png");

		quit.appendChild(imgQuit);
		boxImge.appendChild(img);
		readImg.appendChild(boxImge);

		/*modalImg.appendChild(atributions);*/

		modalImg.appendChild(readImg);
		modalImg.appendChild(quit);
		channel.appendChild(modalImg);

		quit.addEventListener("click", () => {
			channel.removeChild(modalImg);
			lalo = true;
		})

		resolve("Hola");
	})
}

const slider = (images, src) => {
	if (lalo == true) {
		const readImg = document.querySelector(".readImg");

		const next = document.createElement("DIV");
		const previous = document.createElement("DIV");
		const imgNext = document.createElement("IMG");
		const imgPrevious = document.createElement("IMG");
		
		next.classList.add("next", "buttons");
		previous.classList.add("previous", "buttons");
		imgNext.setAttribute("src", "assets/next.png");
		imgPrevious.setAttribute("src", "assets/previous.png");
		
		next.appendChild(imgNext);
		previous.appendChild(imgPrevious);
		readImg.appendChild(next);
		readImg.appendChild(previous);
		next.style.display = "none";
		previous.style.display = "none";

		lalo = false;
	}

	const next = document.querySelector(".next");
	const previous = document.querySelector(".previous");
	let cont = images.length;
	let currentSrc = src;
	let indexSrc = images.indexOf(currentSrc);
	if (images.length >= 2) {
		if (indexSrc == 0) {
			next.style.display = "block";
		}	
		else if (indexSrc == (images.length-1)) {
			previous.style.display = "block";
		}
		else {
			previous.style.display = "block";
			next.style.display = "block";
		}
	}

	next.addEventListener("click", () => {
		if (indexSrc == 0) {
			previous.style.display = "block";
		}
		if (indexSrc < images.length) {
			document.querySelector(`.img`).src = images[indexSrc+1];
			indexSrc++;
		}
		if (indexSrc == (images.length-1)) {
			next.style.display = "none";
		}
	})

	previous.addEventListener("click", () => {
		if (indexSrc == (images.length-1)) {
			next.style.display = "block";
		}
		if (images.length >= 2) {
			document.querySelector(`.img`).src = images[indexSrc-1];
			indexSrc--;
		}	
		if (indexSrc == 0) {
			previous.style.display = "none";
		}
	})
}

//--------------------------------------------------------------------------------------
//EVENTOS-------------------------------------------------------------------------------
emoticons.addEventListener("click", () => {
	emojis();
	if (document.querySelectorAll(".channel > .boxMenu").length !== 0) {
		channel.removeChild(document.querySelector(".boxMenu"));
	}
})

/*message.addEventListener("keydown", () => {
	message.style.height = `${message.scrollHeight}px`;
})*/

/*message.addEventListener('keydown', autosize);
             
function autosize(){
    message.style.cssText = 'height: auto';
    messageBox.style.cssText = `height: auto`;
	message.style.height = `${message.scrollHeight}px`;
	messageBox.style.height = `${message.scrollHeight}px`;
}*/

//---------
message.addEventListener("click", () => {
	if (document.querySelector(".message").textContent == "Mensaje...") {
		document.querySelector(".message").textContent = "";
	}
})

message.addEventListener("keydown", () => {
	if (document.querySelector(".message").textContent == "Mensaje...") {
		document.querySelector(".message").textContent = "";
	}
})

message.addEventListener("keyup", () => {
	if (document.querySelector(".message").textContent == "") {
		document.querySelector(".message").textContent = "Mensaje...";
	}
})

channel.addEventListener("click", () => {
	if (document.querySelector(".message").textContent == "") {
		document.querySelector(".message").textContent = "Mensaje...";
	}
})

header.addEventListener("click", () => {
	if (document.querySelector(".message").textContent == "") {
		document.querySelector(".message").textContent = "Mensaje...";
	}
})

//---------
attach.addEventListener("click", () => {
	menu();
	if (document.querySelectorAll(".channel > .emojisDiv").length !== 0) {
		channel.removeChild(document.querySelector(".emojisDiv"));
	}
})

//------------------------------------------------------------------------------------
//CANALES DE COMUNICACIÓN ------------------------------------------------------------
let oilS = false;
send.addEventListener("click", () => {
	if (document.querySelectorAll(".channel > .modalMap").length !== 0) {
		channel.removeChild(document.querySelector(".modalMap"));
	}

	if (document.querySelectorAll(".channel > .modalVideo").length !== 0) {
		channel.removeChild(document.querySelector(".modalVideo"));
	}

	if (document.querySelectorAll(".channel > .emojisDiv").length !== 0) {
		channel.removeChild(document.querySelector(".emojisDiv"));
	}

	if (document.querySelectorAll(".channel > .boxMenu").length !== 0) {
		channel.removeChild(document.querySelector(".boxMenu"));
	}

	let message = document.querySelector(".message").textContent;
	let time = messageTime();

	if (message == "Mensaje...") {
		message = "";
	}

	if (oilS == true) {
		contS++;
	}

	if (message.length > 0) {
		addObject({
			type: "sent",
			name: "Chat B", 
			message: message, 
			documents: documents,
			gallery: gallery, 
			time: time
		})
	}
})

let oilR = false;
Channel.addEventListener("message", e => {
	let time = messageTime();

	if (oilR == true) {
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

	const className = e.data[0];
	const text = e.data[1];

	const select = className.substring(15,16);

	const content = document.querySelector(`.content-R${select}`);
	content.textContent = text;

	console.log(content);
})
//----------------------------------------------------------------------------------------------
