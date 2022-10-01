let version = "Version 2";

//Durante la fase de instalación, generalmente se 
//almacena en caché los activos estáticos.
self.addEventListener("install", e => {
	e.waitUntil(
		caches.open(version).then(cache => {
			return cache.addAll(["index.html", "estilo.css","codigo.js"])
			.then(() => self.skipWaiting());
			console.log("Archivos almacenados en caché");
			console.log("SW instalado");
		}).catch(err => console.log("Falló el registo de cache", err))
	)
})

//Una vez que se instala el SW, se activa y busca los recursos para
//hacer que funcione sin conexión.
self.addEventListener("activate", e => {
	e.waitUntil(
		caches.keys().then(keyList => {
			console.log(keyList);
			return Promise.all(keyList.map(key => {
				console.log(key);
				//Eliminamos lo que ya no se necesita en cache
				if (version.indexOf(key) === -1) {
					return caches.delete(key);
				}
				console.log(key);
			})).then(resp => console.log(resp));
		//Le indica al SW activar el cache actual
		}).then(() => self.clients.claim())
	)
})

//Cuando el navegador recupera una url
self.addEventListener("fetch", e => {
	console.log("Solicitud interceptada");
	//Responde ya sea con el objeto en caché o continuar 
	//y buscar la url real
	e.respondWith(
		caches.match(e.request).then(response => {
			return response || fetch(e.request);
		})
	)
})
