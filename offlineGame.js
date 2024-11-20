import game_Canvas from './canvas.js';
import CustomImage from './image.js';
import Player from './Player.js';
import game from './game.js'

const imageAnimationTime = 500
const animationTime = imageAnimationTime * 2 + 100

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const loadingContainer = document.getElementById("loading-container")
const loading = document.getElementById("loading-info")
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

const gameResult = document.getElementById("game-result")


const colorContainer = document.getElementById("color-container")


class offlineGame extends game {
	constructor(playerOneHand, playerTwoHand, winScore, playerOneName, playerTwoName) {
		super(playerOneHand, playerTwoHand, winScore, playerOneName, playerTwoName);
		
		this.playerOneName = playerOneName
		this.playerTwoName = playerTwoName
		this.retryBotton = document.getElementById("retry")
		this.retryBotton.addEventListener('click', this.handleRetryGame.bind(this))
		this.canvasDiv = document.getElementById("canvasContainer");
	}

	handleRetryGame() {
		const gameResult = document.getElementById("game-result");

		this.canvasDiv.style.display = "none";
		gameResult.style.display = "flex";
		this.canvasDiv.style.display = "flex";
		gameResult.style.display = "none";
		this.restartGame()
	}

	async initGame() {
		gameSelectionDiv.style.display = "none"
		canvasContainer.style.display = "none"
		fronDiv.style.display = "flex";
		loadingContainer.style.display = "flex"
		
		loading.classList.remove('animate-out-left')
		loading.classList.add('animate-in');
		
		loadingHeader.textContent = "starting game"
		loadingBody.textContent = `${this.playerOneName} vs ${this.playerTwoName}`

		await sleep(animationTime)
		while (!this.waitForImagesToLoad()) {
			await sleep(300);
		}
		loading.classList.add('animate-out-left')
		await sleep(animationTime)
		fronDiv.style.display = "none";
		canvasContainer.style.display = "flex"

		console.log("player one ", this.playerOneName)
		this.playerOne = new Player("top", "retreat", this.gameCanvas, this.playerOneHand, this.context, this.assets, this);
		this.playerTwo = new Player("buttom", "attack", this.gameCanvas, this.playerTwoHand, this.context, this.assets, this);
		
		this.playerOne.initPlayer();
		this.playerTwo.initPlayer();

		this.playerOne.setOpponent(this.playerTwo);
		this.playerTwo.setOpponent(this.playerOne);
		this.canvasDiv.style.display = "flex";
	}

	async startGame() {
		await this.initGame();
		this.gameLoop();
	}

	handlePlayeAction(action, key) {
		if (this.gameOver) return 
		if (this.playerOne.isFrozen || this.playerTwo.isFrozen) return

		const playerOneState = this.playerOne.getState();
		const playerTwoState = this.playerTwo.getState();

		this.playerOne.shouldAttack = key === "s" || key === "mouseTop" && playerOneState == "attack" ? true : false;
		this.playerOne.shouldRetreat = key === "w" || key === "mouseTop" && playerOneState == "retreat" ? true : false;

		this.playerTwo.shouldAttack = key === "ArrowUp" || key === "mouseButtom" && playerTwoState == "attack" ? true : false;
		this.playerTwo.shouldRetreat = key === "ArrowDown" || key === "mouseButtom" && playerTwoState == "retreat" ? true : false;

		const attackPLayer = this.playerOne.getState() === "attack" ? this.playerOne : this.playerTwo;
		const retreatPlayer = this.playerTwo.getState() === "retreat" ? this.playerTwo : this.playerOne;

		if (action == "attack")
			return attackPLayer.startAnimation(action);
		else if (action == "game over")
			return this.gameOver();
		else if (action == "retreat")
			retreatPlayer.startAnimation(action);
	}

}

export default offlineGame;

