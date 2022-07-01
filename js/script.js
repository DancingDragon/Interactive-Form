//set focus of the fist element
document.getElementById("name").focus();

//Add keyup eventlistener on email
let email = document.getElementById("email");
email.addEventListener("keyup", validateEmail);

//Hide the otherjobrole input 
let otherJobInput = document.getElementById("other-job-role");
otherJobInput.style.display = "none";

//Show the otherjobrole input if job is set to "other"
document.getElementById("title").addEventListener("input", (e)=>{
	if (e.target.value==="other") {
		otherJobInput.style.display="";
	} else {
		otherJobInput.style.display="none";	
	}
});


//Hide tshirt color section
let tshirtColorBox = document.getElementById("shirt-colors");
tshirtColorBox.style.display = "none";

//Add listener to the design input
document.getElementById("design").addEventListener("change", (e)=>{
	tshirtColorBox.style.display = "";
	let colorOptions = document.getElementById("color").options;
	let chosenDesign = e.target.value;
	colorOptions.selectedIndex = 0;
	

	//Hide the unavailable colors and show the available

	/*Was thinking of adding a for loop here, could reduce the if/else statement to 
	just a few lines but think it reduces readability too much also harder to add new colors*/
	/*for (let i = 1; i<=6; i++) {
		if (chosenDesign == "js puns")
			colorOptions[i].hidden = (i>3);
		else if (chosenDesign =="heart js")
			colorOptions[i].hidden = (i<=3);
	}*/
	
	if (chosenDesign == "heart js") {
		colorOptions[1].hidden=true;
		colorOptions[2].hidden=true;
		colorOptions[3].hidden=true;
		colorOptions[4].hidden=false;
		colorOptions[5].hidden=false;
		colorOptions[6].hidden=false;
	} else if (chosenDesign =="js puns") {
		colorOptions[1].hidden=false;
		colorOptions[2].hidden=false;
		colorOptions[3].hidden=false;
		colorOptions[4].hidden=true;
		colorOptions[5].hidden=true;
		colorOptions[6].hidden=true;
	}
});

//Add listerner to activities 
document.getElementById("activities").addEventListener("change", (e)=> {
	//fetch current total cost and if box was checked or unchecked
	let cost = parseInt(e.target.dataset["cost"]);
	let checkStat = e.target.checked;
	let totalCostElement = document.getElementById("activities-cost");
	let totalCost = totalCostElement.innerHTML;
	
	let dayandtime = e.target.dataset["dayAndTime"];
	
	if (dayandtime != undefined) {
		for (act of document.querySelectorAll("#activities input")) {
			if (dayandtime === act.dataset["dayAndTime"] && act.name != e.target.name) {
				act.disabled = checkStat;
				if (checkStat) 
					act.parentElement.classList.add("disabled");
				else 
					act.parentElement.classList.remove("disabled");

			}
		}
	}
	
	//Add or remove cost from total cost
	if (checkStat) {
		totalCost = totalCost.replace(/\d+/, parseInt(totalCost.match(/\d+/)) + cost);
	} else {
		totalCost = totalCost.replace(/\d+/, parseInt(totalCost.match(/\d+/)) - cost);
	}
	totalCostElement.innerHTML = totalCost;
});

//Payment
let paymentType = document.getElementById("payment");
//Set the default to credit-card
paymentType.selectedIndex = 1;
showPaymentInfo();
paymentType.addEventListener("change", showPaymentInfo);

function showPaymentInfo() {
	//Hide and show the correct payment info
	if (paymentType.value === "credit-card") {
		document.getElementById("credit-card").style.display = "";
		document.getElementById("paypal").style.display = "none";
		document.getElementById("bitcoin").style.display = "none";
	} else if (paymentType.value === "paypal") {
		document.getElementById("credit-card").style.display = "none";
		document.getElementById("paypal").style.display = "";
		document.getElementById("bitcoin").style.display = "none";
	} else if (paymentType.value === "bitcoin") {
		document.getElementById("credit-card").style.display = "none";
		document.getElementById("paypal").style.display = "none";
		document.getElementById("bitcoin").style.display = "";
	} 
}

//Form Validation
document.getElementsByTagName("form")[0].addEventListener("submit", (e)=> {
	let validName = validateName();
	let validEmail = validateEmail();
	let validActivities = validateActivities();
	let validCredit = validateCreditCardInfo();
	//preventDefault if any of the validitychecks are false
	if (! (validName && validEmail && validActivities && validCredit)) {
		e.preventDefault();
	} 
});

function validateName() {
	let name = document.getElementById("name");
	return validateNode(/.+/, name);
}

function validateEmail() {
	return validateNode(/^.+@.+\.com$/, email);
}

function validateActivities() {
	let activities = document.querySelectorAll("#activities input[type=checkbox]");
	for (actCheckbox of activities) {
		if (actCheckbox.checked) {
			document.getElementById("activities").classList.add("valid");
			document.getElementById("activities").classList.remove("not-valid");
			document.getElementById("activities-hint").style.display = "none";
			return true;
		}
	}
	document.getElementById("activities").classList.add("not-valid");
	document.getElementById("activities").classList.remove("valid");
	document.getElementById("activities-hint").style.display = "block";
	return false;
}

function validateCreditCardInfo() {
	//Only apply the check if credit card is selected
	if (paymentType.value === "credit-card") {
		//Fetch the input nodes needed to check credit card info
		let cardNr = document.getElementById("cc-num"),
			zip = document.getElementById("zip"), 
			cvv = document.getElementById("cvv");
		
		//check if all the values are valid
		let validCardNr = validateNode(/^\d{13,16}$/, cardNr),
			validZip = validateNode(/^\d{5}$/, zip),
			validCvv = validateNode(/^\d{3}$/, cvv);
		
		return (validCardNr && validZip && validCvv);
	}
	return true;
}

/**
* Checks if the value of the element is valid, if it is adds the "valid" class and removes hint
* else adds the hint and removes the valid class.
* @param regex the regex which the elements value needs to match
* @param elem the element to check
* @return boolean if the elements value is valid.
*/
function validateNode(regex, elem) {
	if (regex.test(elem.value)) {
		elem.parentNode.classList.remove("not-valid");
		elem.parentNode.classList.add("valid");
		elem.parentElement.lastElementChild.style.display = "none";
		return true;
	} else {
		elem.parentNode.classList.add("not-valid");
		elem.parentNode.classList.remove("valid");
		elem.parentElement.lastElementChild.style.display = "block";
		return false;
	}
}

//Add eventlistener blur and focus to all checkboxes in the activities section
for (actInput of document.querySelectorAll("#activities input[type=checkbox]")) {
	actInput.addEventListener("focus", (e) => {
		e.target.parentNode.classList.add("focus");
	});
	actInput.addEventListener("blur", (e) => {
		document.querySelector("#activities label.focus").classList.remove("focus");
	});
}

