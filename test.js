// import onlineGame from "./onlineGame.js";	
import offlineGame from "./offlineGame.js";

const imageAnimationTime = 500
const animationTime = imageAnimationTime * 2 + 100

const backgroundColors = [
	"#ffeef1",
	"#6182cd",
	"#bd6f5a",
	"#84d0ff",
	"#bd6f5a",
	"#ecedf0",
	"#bd6f5a",
	"#ffffff",
	"#ffbc97",
	"#bd6f5a",
	"#ffbc97",
	"#bd6f5a",
	"#ffbc97",
	"#ffbc97"
]

const handImages = [
	STATIC_URL + "/assets/hands/hand5.png",
	STATIC_URL + "/assets/hands/hand7.png",
	STATIC_URL + "/assets/hands/hand3.png",
	STATIC_URL + "/assets/hands/hand2.png",
	STATIC_URL + "/assets/hands/hand1.png",
	STATIC_URL + "/assets/hands/hand6.png",
	STATIC_URL + "/assets/hands/hand8.png",
	STATIC_URL + "/assets/hands/hand9.png",
	STATIC_URL + "/assets/hands/hand11.png",
	STATIC_URL + "/assets/hands/hand12.png",
	STATIC_URL + "/assets/hands/hand13.png",
	STATIC_URL + "/assets/hands/hand14.png",
	STATIC_URL + "/assets/hands/hand15.png",
	STATIC_URL + "/assets/hands/hand16.png"
]




const slideContainer = document.getElementById("slide-container")
const background = document.getElementById("image-container");
const playerHandImage = document.getElementById("playerHandImage");
const playerContainer = document.getElementById("player-container");
const readybtn = document.getElementById("readyBtn");
const counter = document.getElementById("counter");
const image = document.getElementById("image")
const gameHome = document.getElementById("game-home")
const playerText = document.getElementById("info");
const fronDiv = document.getElementById("gameFront");
const imageContainer = document.getElementById("image")
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const styleEl = document.createElement('style');



let isAnimating = false
let  playerTwoHnad = null;
let  playerOneHnad = null;
let imageIsAnimating = false
let curentIndex = 0;

counter.textContent = `1 / ${handImages.length}`
imageContainer.style.display = "none"


function initAnimation() {
    background.classList.add('animate-in');
	background.style["background"] = backgroundColors[curentIndex]
	imageIsAnimating = true;
	
	setTimeout(() =>{
		imageContainer.style.display = "flex"
		imageContainer.classList.add('animate-in');
		imageIsAnimating = false

		playerHandImage.classList.add('animate-handIn');
	}, imageAnimationTime)
	
	imageContainer.style["background"] = backgroundColors[curentIndex]
}
initAnimation()

function setActive(index) {
	console.log("setactive  " , imageIsAnimating)
    const dots = slideContainer.children;
    Array.from(dots).forEach(dot => dot.classList.remove('active'));

    // Define the active class styles
    styleEl.textContent = `
        .active {
            background: ${backgroundColors[index]};
            transform: scale(1.2);
            transition: all 0.3s ease;
        }
    `;
    
    // Add the style element to document head
    document.head.appendChild(styleEl);

    dots[index].classList.add('active');
    
    counter.textContent = `${index + 1} / ${handImages.length}`;
    curentIndex = index;
    
    updateImage(curentIndex);
    setTimeout(() => {
        imageIsAnimating = false;
    }, animationTime);
}

for (let i = 0; i < handImages.length; i++) {
	const dot = document.createElement('div')
	dot.className = 'progress-dot'
	
	if (i == 0) dot.classList.add('active')
	
	dot.addEventListener('click', () => {
		console.log(imageIsAnimating)
		if (!imageIsAnimating) {
			imageIsAnimating = true;
			setActive(i)
		}
	})
	slideContainer.appendChild(dot)
}


function updateImage() {
	
	background.classList.remove('animate-in', 'animate-out');
    void background.offsetWidth; // Trigger reflow to restart animation
    background.classList.add('animate-in'); // Add slide-in animation
	background.style["background"] = backgroundColors[curentIndex]
	
	imageContainer.classList.remove('animate-in', 'animate-out');
    void imageContainer.offsetWidth; // Trigger reflow to restart animation
    imageContainer.classList.add('animate-in'); // Add slide-in animation
	imageContainer.style["background"] = backgroundColors[curentIndex]

	imageIsAnimating = true;
	setTimeout(() =>{
		playerHandImage.classList.remove('animate-handIn', 'animate-handOut');
		void playerHandImage.offsetWidth; // Trigger reflow to restart animation
		playerHandImage.src = handImages[curentIndex];
		playerHandImage.classList.add('animate-handIn'); // Add slide-in animation
	}, imageAnimationTime)
	
	setTimeout(() =>{
		imageIsAnimating = false
	}, animationTime)
	
	imageContainer.style["background"] = backgroundColors[curentIndex]
}

nextBtn.addEventListener('click', () => {
	playerText.style.display = "none"
    if (imageIsAnimating) return

	playerHandImage.classList.add('animate-handOut'); // Add slide-out animation

	++curentIndex;
	if (curentIndex >= handImages.length) {
		curentIndex = 0;
	}
	updateImage();
	setActive(curentIndex);
    setTimeout(() => {
    }, 300); // Match the animation duration
});

prevBtn.addEventListener('click', () => {
	if (imageIsAnimating) return
    playerHandImage.classList.add('animate-handOut');

	--curentIndex;
	if (curentIndex < 0) {
		curentIndex = handImages.length - 1;
	}
	updateImage();
	setActive(curentIndex);
    setTimeout(() => {
		
	}, imageAnimationTime); // Match the animation duration
});


function startOffline() {
	function	startGame() {
		fronDiv.style.display = 'none';
		
		let offline_game = new offlineGame(playerTwoHnad, playerOneHnad);
		offline_game.startGame();
	}

	function	setupPlayerOneHand() {
		playerText.textContent = "Choose Your Hand";
		readybtn.addEventListener('click', function() {

		playerContainer.classList.add('slideOut')
		playerContainer.classList.remove('animate-in', 'animate-out');
		void playerContainer.offsetWidth; // Trigger reflow to restart animation
		playerContainer.classList.add('animate-in'); // Add slide-in animation
			
		gameHome.style["flex-direction"] = "row-reverse"
		playerOneHnad = handImages[curentIndex];
		setupPlayerTwoHand();
		}, {once: true});
	}

	function setupPlayerTwoHand() {
		playerText.textContent = "Choose Your Hand";
		playerText.style.display = "block"
		curentIndex = 0;
		setActive(0)
		readybtn.addEventListener('click', function() {
			playerTwoHnad = handImages[curentIndex];
			startGame();
		}, {once: true});
	}

	setupPlayerOneHand();
}

startOffline();

// let online_game = new onlineGame();
// online_game.startGame();

