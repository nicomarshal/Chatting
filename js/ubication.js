//----------------------------------------------------------------------------------------
//UBICACIÓN ACTUAL -----------------------------------------------------------------------
export let position;

export function ubication(ch) {
	const channel = document.querySelector(ch);

	const modalMap = document.createElement("DIV");
	const boxMap = document.createElement("DIV");
	const viewMap = document.createElement("DIV");
	viewMap.style.height = "100%";
	viewMap.style.width = "100%";

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

			position = `<a class="position" href="https://www.google.com/maps/@${latitude},${longitude},19z" target="_blank" rel="noopener">Ver la ubicación en Google Maps</a>`;

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