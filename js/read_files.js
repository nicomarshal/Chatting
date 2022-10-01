//-------------------------------------------------------------------------------------------
//MANEJO DE LA CARGA DE ARCHIVOS ------------------------------------------------------------
export let documents = [];
export let gallery = [];

/*let contDoc = 0;
export function readDoc(files) {
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
}*/

export function readImg(files, callback) {
	for (let i = 0; i < files.length; i++) {
		const reader = new FileReader;
		reader.readAsDataURL(files[i]);

		reader.addEventListener("load", e => {
			gallery.push(e.currentTarget.result);
			console.log(`Imagen N°: ${gallery.length}`);
			/*Si coloco el callback después del for, 
			por alguna razon el call se ejecuta primero, es decir,
			no espera a que el for termine su bucle. Esto
			trae el problema de un length igual a cero al pasar
			a gallery como parámetro. Por esta razon se crea
			este if para asegurarnos de que el callback sea ejecutado con
			el length correcto en la última vuelta del for*/
			if (i === (files.length-1)) {
				callback(gallery);
			}
		})
	}
}

export function resetFiles(gall) {
	if(document.querySelector(".message").textContent !== "Mensaje...") {
		document.querySelector(".message").textContent = "Mensaje...";
	}
	console.log(`Galería:`, gallery);
	gallery = gall;
	console.log(`Reseteo galería: `, gallery);
}