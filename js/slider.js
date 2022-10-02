const container = document.querySelector(".container");

let lalo = true;
export function modal(image){
	return new Promise (resolve => {
		const modalImg = document.createElement("SECTION");
		const readImg = document.createElement("DIV");
		const boxImge = document.createElement("DIV");
		const img = document.createElement("IMG");
		const quit = document.createElement("DIV");
		const imgQuit = document.createElement("IMG");

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
		container.appendChild(modalImg);

		quit.addEventListener("click", () => {
			container.removeChild(modalImg);
			lalo = true;
		})

		resolve("Hola");
	})
}

export function slider(images, src){
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