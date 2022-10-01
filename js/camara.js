//----------------------------------------------------------------------------------------
//CÁMARA DE FOTOS ------------------------------------------------------------------------
export let galleryCam = [];

export function	camara(ch) {
	const channel = document.querySelector(ch);

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
			boxVideo.appendChild(boxImgCaptured);
		}

		galleryCam[cont] = imgCaptured.src;
		cont++;
		console.log(galleryCam);
		console.log(cont);
	})
}
