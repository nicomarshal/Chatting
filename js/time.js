//----------------------------------------------------------------------------------------
//DETERMINACIÓN DE LA HORA DE ENVÍO ------------------------------------------------------
export function addZeros(n) {
	if (n.toString().length < 2) return	"0".concat(n);
	return `${n}`;
}

export function messageTime() {
	const time = new Date();
	let hours = addZeros(time.getHours());
	let minutes = addZeros(time.getMinutes());
	return [hours, minutes];
}