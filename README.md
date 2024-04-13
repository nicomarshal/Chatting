# Aplicación de Chat
[Ver Chat](https://nicomarshal.github.io/chatting)

Interfaz programada con JavaScript y compuesta por módulos.
Puede ser ejecutada como una PWA.

Se utilizaron las siguientes tecnologías:
- IndexedDB para almacenar allí los mensajes enviados o recibidos. 
- Intersection Observer para agilizar la recarga de los mensajes almacenados.
- FileReader para cargar documentos e imágenes.
- BroadCastChannel para poder simular el efecto producido al enviar o recibir un mensaje.
- Navigator para utilizar: 
  1. Service Worker que nos permite realizar el almacenamiento en Caché y, además sirve de 
  intermediario entre el cliente y el futuro servidor, 
  2. Geolocation junto con Leaflet para poder acceder a la ubicación actual
  3. MediaDevices para poder utilizar la cámara de nuestro dispositivo.
- Fetch para obtener de un archivo JSON una lista que contiene todos los emojis.
