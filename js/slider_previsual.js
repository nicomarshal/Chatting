const container = document.querySelector(".container");
const channel = document.querySelector(".channel");
const messenger = document.querySelector(".messenger");
const emoticons = document.querySelector(".emoticons");
const messageBox = document.querySelector(".messageBox");
const attach = document.querySelector(".attach");
const send = document.querySelector(".send");


//export let lalo = true;
export function sliderPrevisual(type, gallery) {
	//console.log(`lalo: ${lalo}`);
	modalPrevisual();
	//lalo = false;
	const modalPrev = document.querySelector(".modalPrevisual");

	const boxPrev = document.createElement("DIV");
	boxPrev.classList.add("boxPrevisual");
	
	modalPrev.appendChild(boxPrev);

	console.log("Creando SliderPrev");
	if (gallery.length >= 3) {
		for (let i = 0; i < 3; i++) {
			const boxImg = document.createElement("DIV");
			const newImg = document.createElement("IMG");
			
			boxImg.classList.add("boxImg");
			newImg.classList.add(`img-${i}`);

			boxImg.appendChild(newImg);
			boxPrev.appendChild(boxImg);

			if (i === 2) {
				for (let j = 0; j < 3; j++) {
					document.querySelector(`.img-${2 - j}`).src = gallery[(gallery.length-1) - j];			
				}
				console.log("Las imágenes cargadas ya se encuentran previsualizadas");			
			}
		}
		selectorPrevisual("img", gallery);		
	} 
	else if (gallery.length === 2) {
		for (let i = 0; i < 2; i++) {
			const boxImg = document.createElement("DIV");
			const newImg = document.createElement("IMG");
			
			boxImg.classList.add("boxImg");
			newImg.classList.add(`img-${i}`);

			boxImg.appendChild(newImg);
			boxPrev.appendChild(boxImg);

			if (i === 1) {
				for (let j = 0; j < 2; j++) {
					document.querySelector(`.img-${1 - j}`).src = gallery[(gallery.length-1) - j];			
				}		
				console.log("Las imágenes cargadas ya se encuentran previsualizadas");	
			}			
		}
		selectorPrevisual("img", gallery);			
	}
	else {
		const boxImg = document.createElement("DIV");
		const newImg = document.createElement("IMG");
		
		boxImg.classList.add("boxImg");
		newImg.classList.add(`img-0`);

		newImg.src = gallery[0];

		boxImg.appendChild(newImg);
		boxPrev.appendChild(boxImg);

		console.log("Las imágenes cargadas ya se encuentran previsualizadas");
		selectorPrevisual("img", gallery);		
	}	
}

function modalPrevisual() {
	console.log("Creando ModalPrev");
	const modalPrev = document.createElement("DIV");
	const exit = document.createElement("DIV");
	const imgExit = document.createElement("IMG");
	modalPrev.classList.add("modalPrevisual");
	exit.classList.add("quit");
	imgExit.setAttribute("src", "assets/equis.png");

	exit.appendChild(imgExit);
	modalPrev.appendChild(exit);
	channel.appendChild(modalPrev);

	//-----------------------------------------------------------
	console.log("Cambiando estilos Messenger")
	messenger.classList.add("two");
	emoticons.classList.add("two");

	const addMore = document.createElement("BUTTON");
	const imgAdd = document.createElement("IMG");
	
	addMore.classList.add("addMore");

	imgAdd.src = "assets/agregarMas.png";
	
	addMore.appendChild(imgAdd);

	messenger.replaceChild(addMore, attach);
	
	//-----------------------------------------------------------
	exit.addEventListener("click", () => {
		channel.removeChild(modalPrev);
		messenger.classList.remove("two");
		emoticons.classList.remove("two");
		messenger.replaceChild(attach, addMore);
	})
}

//let lala = true;
function selectorPrevisual(type, gallery) {
	//console.log(`lalo: ${lalo}`);
	const contImg = gallery.length;
	let cont = gallery.length-1;

	console.log("Creando selectorPrev");
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

	//lala = false;

	if (type === "img") {
		if (gallery.length > 3) {
			previous.style.display = "block";
		}

		next.addEventListener("click", e => {
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
			//e.stopImmediatePropagation();
		})

		previous.addEventListener("click", e => {
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
			//e.stopImmediatePropagation();
		})			
	}

	const addMore = document.querySelector(".addMore");
	addMore.addEventListener("click", () => {
		alert("Esta funcionalidad se encuentra todavía en desarrollo");
	})
	/*const inpAdd = document.createElement("INPUT");
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
	})*/
}

export function resetSliderPrev(lal) {
	if(document.querySelector(".message").textContent !== "Mensaje...") {
		document.querySelector(".message").textContent = "Mensaje...";
	}
	//console.log(`lalo: ${lalo}`);
	//lalo = lal;
	//console.log(`lalo: ${lalo}`);
}