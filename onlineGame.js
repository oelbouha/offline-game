import game_Canvas from './canvas.js';
import CustomImage from './image.js';
import Player from './Player.js';
import game from './game.js'
import { handImages, backgroundColors } from './config.js';


const imageAnimationTime = 500
const animationTime = imageAnimationTime * 2 + 100


const loading = document.getElementById("loading-info")

const loadingContainer = document.getElementById("loading-container")
const gameSelectionDiv = document.getElementById("game-home")
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
let styleEl = document.createElement('style');
const canvasContainer = document.createElement('canvas-container');

const loadingHeader = document.getElementById("loading-header")
const loadingBody =   document.getElementById("loading-body")


let isAnimating = false
let  playerTwoHnad = null;
let  playerOneHnad = null;
let imageIsAnimating = false
let curentIndex = 0;



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
function initializeUI() {
	// Create style element
	gameSelectionDiv.style.background = "#00203f";
	styleEl = document.createElement('style');
	document.head.appendChild(styleEl);


	styleEl.textContent = `
	.active {
		background: ${backgroundColors[curentIndex]};
		transform: scale(1.2);
		transition: all 0.3s ease;
	}
`;
	// Set initial states
	counter.textContent = `1 / ${handImages.length}`;
	imageContainer.style.display = "none";

	// Create progress dots
	for (let i = 0; i < handImages.length; i++) {
		const dot = document.createElement('div');
		dot.className = 'progress-dot';
		if (i === 0) dot.classList.add('active');
		dot.addEventListener('click', () => {
			if (!imageIsAnimating) {
				imageIsAnimating = true;
				setActive(i);
			}
		});
		slideContainer.appendChild(dot);
	}
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
    }, imageAnimationTime); // Match the animation duration
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




initializeUI()
initAnimation()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class onlineGame extends game {
	constructor() {
		super();
		this.socket = new WebSocket('ws://127.0.0.1:8001/ws/game/');
		this.start_game = false;
		this.ready = false;
		this.isPlayerOne = false;
		this.isPlayerTwo = false;
		this.playerOneHand = null;
		this.playerTwoHand = null;

		this.gameRequest = document.getElementById("game-request")
		this.retryBotton = document.getElementById("retry")
		this.acceptBotton = document.getElementById("accept")
		this.refuseBotton = document.getElementById("refuse")
		this.canvasContainer = document.getElementById("canvasContainer");

		this.retryBotton.addEventListener('click', this.handleRetryGame.bind(this))
		this.acceptBotton.addEventListener('click', this.acceptRequest.bind(this))
		this.refuseBotton.addEventListener('click', this.refuseRequest.bind(this))
		this.connectWebSocket();
	}

	acceptRequest() {
		// send to the server that it accept
		console.log("accept")
	}

	refuseRequest() {
		// send to the server that it refuse 
		console.log("refuuse")
	}
	handleGameRequest() {
		this.canvasContainer.style.display = "none";
		this.gameRequest.style.display = "flex";
	}
	handleRetryGame() {
		const gameResult = document.getElementById("game-result");
		this.canvasContainer.style.display = "none";
		gameResult.style.display = "flex";
		console.log("result ")
		console.log("retry clicked ")
		this.canvasContainer.style.display = "flex";
		gameResult.style.display = "none";
		this.handlePlayeAction("Rematch", "mouseButtom");
	}


	async setupHands() {
		loading.classList.add('animate-in');
		gameSelectionDiv.style.display = "none"
		loadingContainer.style.display = "flex"
		while (!this.start_game) {
			await sleep(100);
		}
		loading.classList.remove('animate-in')
		fronDiv.style["background"] = "#00203f"
		loading.classList.add('animate-out-left');
		await sleep(animationTime)
		loadingContainer.style.display = "none"
		gameSelectionDiv.style.display = "flex"

		// setup hands for player ..
		console.log ("choosing hands  .....");
		if (this.isPlayerOne) {
			loading.classList.remove('animate-out-left')
			loading.classList.add('animate-in');
			// playerText.textContent = "Choose Player One Hand";
			readybtn.addEventListener('click', function() {
				gameSelectionDiv.style.display = "none"
				loadingHeader.textContent = "Waiting ... "
				loadingBody.textContent = "Waiting for other player to be ready ..."
				playerOneHnad = handImages[curentIndex];
			}, {once: true});
		}
		
		else if (this.isPlayerTwo) {
			// playerText.textContent = "Choose Player Two Hand";
			loading.classList.remove('animate-out-left')
			loading.classList.add('animate-in');
			
			curentIndex = 0;
			updateImage();
			readybtn.addEventListener('click', function() {
				gameSelectionDiv.style.display = "none"
				loadingHeader.textContent = "Waiting ... "
				loadingBody.textContent = "Waiting for other player to be ready ..."
				playerTwoHnad = handImages[curentIndex];
			}, {once: true});
		}
		
		if (this.isPlayerOne) {
			while (playerOneHnad == null) {
				await sleep(200);
			}
			this.sendMessage({"action": "chose hand", "player": "player one" , "hand": playerOneHnad});
		}
		if (this.isPlayerTwo) {
			while (playerTwoHnad == null) {
				await sleep(200);
			}
			this.sendMessage({"action": "chose hand", "player": "player two" , "hand": playerTwoHnad});
		}
	}

	async initGame() {
		
		loadingContainer.style.display = "flex"
		while (!this.ready) {
			await sleep(300);
		}
		
		console.log("player one hand : ", this.playerOneHand);
		
		const playerOne = new CustomImage(this.playerOneHand);
		const playerTwo = new CustomImage(this.playerTwoHand);
		
		fronDiv.style.display = "flex"
		loadingContainer.style.display = "flex"
		loadingContainer.style.display = "none"

		loadingContainer.style.display = "flex"
		loading.classList.remove('animate-out-left')
		loading.classList.add('animate-in');
		// await sleep(30000);

		loadingHeader.textContent = "Starting game ..."
		loadingBody.textContent = ''
		await sleep(2000);
		loading.classList.add('animate-out-left');
		await sleep(animationTime)
		fronDiv.style.display = "none"
		loadingContainer.style.display = "none"
		// this sleep is for image to load and then use it || fix it
		// await sleep(200);

		super.setPlayerOneHand(playerTwo);
		super.setPlayerTwoHand(playerOne);
	
		this.playerOne = new Player("top", "retreat", this.gameCanvas, playerOne, this.context, this.assets, this);
		this.playerTwo = new Player("buttom", "attack", this.gameCanvas, playerTwo, this.context, this.assets, this);
	
		this.playerOne.initPlayer();
		this.playerTwo.initPlayer();
		
		this.playerOne.setOpponent(this.playerTwo);
		this.playerTwo.setOpponent(this.playerOne);


	}
	
	async startGame() {
		await this.setupHands();
		await this.initGame();

		
		// await sleep(animationTime)
		
		
		this.gameLoop();
	}

	connectWebSocket() {
		this.socket.onopen = (e) => {
			console.log("Connected to server");
			// this.sendMessage("Hello, server!");
		};
		
		this.socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			
			const whichPlayer = data.which_player;
			const message = data.message;

			if (whichPlayer == "Player 1")
				this.isPlayerOne = true;
			if (whichPlayer == "Player 2")
				this.isPlayerTwo = true;
			
			if (message === "Start Game") {
				this.start_game = true;
				return ;
			}
			this.handleServerMessage(message);
		};
	
		this.socket.onerror = (error) => {
			console.log("WebSocket Error: ", error);
		};

		this.socket.onclose = (event) => {
			if (event.wasClean) {
				console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
			} else {
				console.log('Connection died');
			}
		};
	}

	async handleServerMessage(data) {
		const action = data.action;
		const player = data.player;
		const hand = data.hand;

		console.log("recieve message :", action, player);
		
		if (action == "attack") {
			if (player == "playerOne")
				this.playerOne.startAnimation(action);
			else if (player === "playerTwo")
			this.playerTwo.startAnimation(action);
		}
		if (action == "retreat" ) {
			if (player == "playerOne")
				this.playerOne.startAnimation("retreat");
			else if (player === "playerTwo")
					this.playerTwo.startAnimation("retreat");
		}
		if (action == "Rematch") {
			// await this.restartGame(player);
			this.handleGameRequest()


		}
		if (action == "chose hand") {
			if (player == "player one")
				this.playerOneHand = hand;
			else if (player == "player two")
				this.playerTwoHand = hand;
			if (this.playerOneHand && this.playerTwoHand)
				this.ready = true;
		}
	}

	sendMessage(message) {
		if (this.socket.readyState === WebSocket.OPEN) {
			console.log ("message send :", message);
			this.socket.send(JSON.stringify({message: message}));
		} else {
			console.log("WebSocket is not open. Message not sent.");
		}
	}

	handlePlayeAction(action, key) {
		if (this.playerOne.isFrozen || this.playerTwo.isFrozen)
			return ;

		const player = key == "s" || key == "w" || key == "mouseTop" ? "playerOne": "playerTwo";

		this.sendMessage({action: action, player: player});
	}

	handleKeyPress(event) {
		if (this.gameOver) return
		const key = event.key;

		if (this.playerOne.win || this.playerTwo.win) return ;

		if (key == "w" && this.playerOne.state == "retreat" && this.isPlayerOne)
			this.handlePlayeAction("retreat", key)
		else if (key == "ArrowDown" && this.playerTwo.state == "retreat" && this.isPlayerTwo)
			this.handlePlayeAction("retreat", key)
		else if (key == "s" && this.playerOne.state == "attack" && this.isPlayerOne)
			this.handlePlayeAction("attack", key)
		else if (key == "ArrowUp" && this.playerTwo.state == "attack" && this.isPlayerTwo)
			this.handlePlayeAction("attack", key)
	}

	handleCanvasClick(event) {
		if (this.gameOver) return
        let rect = this.canvas.getBoundingClientRect();
        let x = event.pageX - rect.left;
        let y = event.pageY - rect.top;

        if (this.isButtonClicked(x, y, this.topButton) && this.isPlayerOne) {
			if (this.playerOne.win || this.playerTwo.win)
				return this.handlePlayeAction("Rematch", "mouseTop");
			this.handlePlayeAction(this.playerOne.state, "mouseTop");
		}
		if (this.isButtonClicked(x, y, this.bottomButton) && this.isPlayerTwo) {
			if (this.playerOne.win || this.playerTwo.win)
				return this.handlePlayeAction("Rematch", "mouseButtom");
			this.handlePlayeAction(this.playerTwo.state, "mouseButtom");
        }
    }

	async resetPlayers(player) {
		this.clearCanvas();
		// if (player === "playerTwo") {
		// 	this.playerOne.state = "attack";
		// 	this.playerTwo.state = "retreat";
		// 	this.topBackgroundColor = this.attackColor;
		// 	this.bottomBackgroundColor = this.retreatColor;
		// 	this.topButton = this.topAttackButton;
		// 	this.bottomButton = this.bottomRetreatButton;
		// }
		// else {
		// 	this.playerOne.state = "retreat";
		// 	this.playerTwo.state = "attack";
		// 	this.topBackgroundColor = this.retreatColor;
		// 	this.bottomBackgroundColor = this.attackColor;
		// 	this.topButton = this.topRetreatButton;
		// 	this.bottomButton = this.bottomAttackButton;
		// }
		this.playerOne.handCurrentY = this.playerOne.hand.getInitialY();
		this.playerTwo.handCurrentY = this.playerTwo.hand.getInitialY();
		this.playerOne.score = 0;
		this.playerTwo.score = 0;
		this.playerOne.win = false;
		this.playerTwo.win = false;
		this.playerOne.isPlayerAnimating = false;
		this.playerTwo.isPlayerAnimating = false;
		this.playerOne.isPlayerFalling = true;
		this.playerOne.isPlayerRising = true;
		this.playerTwo.isPlayerFalling = true;
		this.playerTwo.isPlayerRising = true;
		this.isLoading = false;
		this.playerOne.isFrozen = false;
		this.playerTwo.isFrozen = false;
	}
}

export default onlineGame;





