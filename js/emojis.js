//-----------------------------------------------------------------------------------
//EMOJIS-----------------------------------------------------------------------------
export default function emojis(ch) {	
	let smiles = [];
	let animals = [];
	let travel = [];
	let activities = [];
	let objects = [];

	const emojisDiv = document.querySelector(".emojisDiv");
	emojisDiv.classList.add("active");

	const emojisContainer = document.querySelector(".emojisContainer");
	const group1 = document.querySelector(".group1");
	const group2 = document.querySelector(".group2");
	const group3 = document.querySelector(".group3");
	const group4 = document.querySelector(".group4");
	const group5 = document.querySelector(".group5");	

	const exit = document.querySelector(".exitit")	

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

	group1.addEventListener("click", (e) => {
		const emojis = document.createElement("DIV");
		emojis.classList.add("emojis");

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
			emojis.appendChild(fragment);
			emojisContainer.appendChild(emojis);
		}
		else {
			const first = emojisContainer.firstElementChild;
			emojisContainer.removeChild(first);
			emojis.appendChild(fragment);
			emojisContainer.appendChild(emojis);
		}

		e.stopImmediatePropagation();
	})

	group2.addEventListener("click", (e) => {
		const emojis = document.createElement("DIV");
		emojis.classList.add("emojis");

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
			emojis.appendChild(fragment);
			emojisContainer.appendChild(emojis);
		}
		else {
			const first = emojisContainer.firstElementChild;
			emojisContainer.removeChild(first);
			emojis.appendChild(fragment);
			emojisContainer.appendChild(emojis);
		}

		e.stopImmediatePropagation();
	})

	group3.addEventListener("click", (e) => {
		const emojis = document.createElement("DIV");
		emojis.classList.add("emojis");

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
			emojis.appendChild(fragment);
			emojisContainer.appendChild(emojis);
		}
		else {
			const first = emojisContainer.firstElementChild;
			emojisContainer.removeChild(first);
			emojis.appendChild(fragment);
			emojisContainer.appendChild(emojis);
		}

		e.stopImmediatePropagation();
	})

	group4.addEventListener("click", (e) => {
		const emojis = document.createElement("DIV");
		emojis.classList.add("emojis");

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
			emojis.appendChild(fragment);
			emojisContainer.appendChild(emojis);
		}
		else {
			const first = emojisContainer.firstElementChild;
			emojisContainer.removeChild(first);
			emojis.appendChild(fragment);
			emojisContainer.appendChild(emojis);
		}

		e.stopImmediatePropagation();
	})

	group5.addEventListener("click", (e) => {
		const emojis = document.createElement("DIV");
		emojis.classList.add("emojis");

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
			emojis.appendChild(fragment);
			emojisContainer.appendChild(emojis);
		}
		else {
			const first = emojisContainer.firstElementChild;
			emojisContainer.removeChild(first);
			emojis.appendChild(fragment);
			emojisContainer.appendChild(emojis);
		}

		e.stopImmediatePropagation();
	})

	exit.addEventListener("click", (e) => {
		emojisDiv.classList.remove("active");
		e.stopImmediatePropagation();
	})
}