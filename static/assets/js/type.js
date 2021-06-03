var i = 0;
var txt = "I'm a"; /* The text */
var speed = 150; /* The speed/duration of the effect in milliseconds */
words = ['Developer', 'Data Analyst', 'Freelancer']

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function typeWriter(param1, param2) {
    var i = 0;
    console.log(param1);
    for (i = 0; i < param1.length; i++) {        
      document.getElementById("sentence").innerHTML += param1.charAt(i);
      console.log(param1.charAt(i))
      await sleep(200)
    }    

    words = ['Developer', 'Data Analyst', 'Freelancer']
    var j = 0;
    let word = words[j].split("");

    b = word.length;
    for (i=0; i < b; i++){
        document.getElementById('sentence2').innerHTML += word.shift();
        await sleep(500)
    }

    for(j = b ; j > 0; j--){
        word.pop();
        console.log(word)
        document.getElementById('sentence2').innerHTML -= word.pop();
        await sleep(100);
    }

    /*
	var loopTyping = async function() {
		if (word.length > 0) {
			document.getElementById('sentence').innerHTML += word.shift();
		} else {
			deletingEffect();
			return false;
		};
		timer = setTimeout(loopTyping, 150);
	};
	var loopDeleting = async function() {
		if (word.length > 0) {
			word.pop();
			document.getElementById('sentence').innerHTML = word.join("");
		} else {
			if (words.length > (i + 1)) {
				i++;
			} else {
				i = 0;
			};
			typingEffect();
			return false;
		};
		timer = setTimeout(loopDeleting, 200);
	};
	await loopTyping();
    await loopDeleting();
    */


}





