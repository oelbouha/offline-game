
// import onlineGame from "./onlineGame.js";
import offlineGame from "./offlineGame.js";
import {backgroundColors , handImages} from "./config.js"


const imageAnimationTime = 500
const animationTime = imageAnimationTime * 3


class HandSelection {
    constructor() {
        // DOM Element references
        this.game = document.getElementById("game");
        this.slideContainer = document.getElementById("slide-container");
        this.background = document.getElementById("image-container");
        this.playerHandImage = document.getElementById("playerHandImage");
        this.playerContainer = document.getElementById("player-container");
        this.readyBtn = document.getElementById("readyBtn");
        this.counter = document.getElementById("counter");
        this.imageContainer = document.getElementById("image");
        this.gameHome = document.getElementById("game-home");
        this.playerText = document.getElementById("info");
        this.frontDiv = document.getElementById("gameFront");
        this.nextBtn = document.getElementById("nextBtn");
        this.prevBtn = document.getElementById("prevBtn");
        this.scoreRange = document.getElementById("score-range")
        this.rangeValue = document.getElementById("rangeValue")
        this.loadingContainer = document.getElementById("loading-container")
        if (this.loadingContainer)
            this.loadingContainer.style.display = "none"
        // if (this.frontDiv)
        //     this.frontDiv.style.display = "flex"

        this.playerNameInput = document.getElementById("player-name")
        this.playerNameInput.addEventListener('input', this.handlePlayerName.bind(this))

        this.startOverBtn = document.getElementById("start-over-btn")
        this.startOverBtn.addEventListener('click', this.handleStartOverButton.bind(this))


        this.animateIn = "animate-in"
        this.animateOut = "animate-out"
        this.animateInRight = "animate-in-right"
        this.animateOutLeft = "animate-out-left"


        this.winScore = 1
        this.playerOneWinScore = null
        this.playerTwoWinScore = null
        // State variables
        this.isAnimating = false;
        this.imageIsAnimating = false;
        this.currentIndex = 0;
        this.playerTwoIndex = null;
        this.playerOneIndex = null;

        this.playerOneName = null
        this.playerTwoName = null
        this.playerName = null

        this.imageAnimationTime = 300; // milliseconds
        this.animationTime = this.imageAnimationTime * 3;

        this.handlePlayerOneClick = this.handlePlayerOneClick.bind(this);
        this.handlePlayerTwoClick = this.handlePlayerTwoClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handlePrevClick = this.handlePrevClick.bind(this);

        
        // Initialize UI
		this.initializeUI();
		this.setupEventListeners();
		this.initAnimation()
    }
	
    handleStartOverButton() {
        console.log('clickeddd     ...')
            
        const gameResult = document.getElementById("game-result")
        gameResult.style.display = "none"
        this.frontDiv.style.display = "flex"
        this.loadingContainer.style.display = "none"
        this.gameHome.style.display = "flex"
        this.playerName = null
        this.setupEventListeners();
        this.initAnimation()
        this.start()
    }
    handlePlayerName(event) {
        const name = event.target.value
        if (!name) return
        this.playerName = name
    }

	start() {
		this.setupPlayerOneHand()
	}
    initializeUI() {
        // Create style element
        this.game.style.background = "#00203f";
        this.styleEl = document.createElement('style');
        document.head.appendChild(this.styleEl);


        this.styleEl.textContent = `
        .active {
            background: ${backgroundColors[this.currentIndex]};
            transform: scale(1.2);
            transition: all 0.3s ease;
        }
    `;
        // Set initial states
        this.counter.textContent = `1 / ${handImages.length}`;
        this.imageContainer.style.display = "none";

        // Create progress dots
        for (let i = 0; i < handImages.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                if (!this.imageIsAnimating) {
					this.imageIsAnimating = true;
                    this.setActive(i);
                }
            });
            this.slideContainer.appendChild(dot);
        }
    }

    updateWinScore(event) {
        this.rangeValue.textContent = event.target.value
        this.winScore = event.target.value
        console.log(this.winScore)
    }

    setupEventListeners() {
        this.nextBtn.addEventListener('click', this.handleNextClick);
        this.prevBtn.addEventListener('click', this.handlePrevClick);
        this.scoreRange.addEventListener('input', (event) => this.updateWinScore(event))
    }

    handleNextClick() {
        if (this.imageIsAnimating) return;

        this.playerHandImage.classList.add('animate-handOut');
        
        this.currentIndex = (this.currentIndex + 1) % handImages.length;
        this.updateImage();
        this.setActive(this.currentIndex);
    }

    handlePrevClick() {
        if (this.imageIsAnimating) return;

        this.playerHandImage.classList.add('animate-handOut');
        
        this.currentIndex = (this.currentIndex - 1 + handImages.length) % handImages.length;
        this.updateImage();
        this.setActive(this.currentIndex);
    }

    setupPlayerOneHand() {
        this.playerText.textContent = "Choose Your Hand";
        this.gameHome.style.flexDirection = "row";
        // Use the bound method reference directly
        this.readyBtn.addEventListener('click', this.handlePlayerOneClick);
    }
    
    setupPlayerTwoHand() {
        // Remove the correct bound method reference
        this.readyBtn.removeEventListener('click', this.handlePlayerOneClick);
        this.playerText.textContent = "Choose Your Hand";
        this.playerText.style.display = "block";
        this.currentIndex = 0;
        this.setActive(0);
        
        // Add the new bound method reference
        this.readyBtn.addEventListener('click', this.handlePlayerTwoClick);
    }

    handlePlayerOneClick() {
        if (!this.playerName) {
            this.playerNameInput.classList.add('field-empty')
            return
        }
        this.playerNameInput.value = ""
        this.playerOneName = this.playerName
        this.playerName = null
        this.playerNameInput.classList.remove('field-empty')
        this.playerContainer.classList.add('slideOut');
        this.playerContainer.classList.remove(this.animateIn, this.animateOut);
        void this.playerContainer.offsetWidth; // Trigger reflow
        this.playerContainer.classList.add(this.animateIn);
        
        this.gameHome.style.flexDirection = "row-reverse";
        this.playerOneIndex = this.currentIndex
        this.animateIn = this.animateInRight
        this.animateOut = this.animateOutLeft
        this.playerOneWinScore = this.winScore
        this.setupPlayerTwoHand();
    }

    handlePlayerTwoClick() {
        console.log("name ", this.playerName)
        if (!this.playerName) {
            this.playerNameInput.classList.add('field-empty')
            return
        }
        this.playerNameInput.value = ""
        this.playerTwoName = this.playerName
        this.playerNameInput.classList.remove('field-empty')
        this.playerTwoIndex = this.currentIndex
        this.playerTwoWinScore = this.winScore

        this.winScore = this.playerOneWinScore > this.playerTwoWinScore ? this.playerTwoWinScore : this.playerOneWinScore
        this.startGame();
    }

    initAnimation() {
        this.background.classList.add(this.animateIn);
        this.background.style.background = backgroundColors[this.currentIndex];
        this.imageIsAnimating = true;
        
        setTimeout(() => {
            this.imageContainer.style.display = "flex";
            this.imageContainer.classList.add(this.animateIn);
            this.imageIsAnimating = false;
            this.playerHandImage.classList.add('animate-handIn');
        }, this.imageAnimationTime);
        
        this.imageContainer.style.background = backgroundColors[this.currentIndex];
    }

    setActive(index) {
        const dots = this.slideContainer.children;
        Array.from(dots).forEach(dot => dot.classList.remove('active'));
        
        this.styleEl.textContent = `
            .active {
                background: ${backgroundColors[index]};
                transform: scale(1.2);
                transition: all 0.3s ease;
            }
        `;
        
        dots[index].classList.add('active');
        this.counter.textContent = `${index + 1} / ${handImages.length}`;
        this.currentIndex = index;
        this.updateImage();
        
        setTimeout(() => {
            this.imageIsAnimating = false;
        }, this.animationTime);
    }

    updateImage() {
        this.game.style.background = "#00203f";
        // this.game.style.background = backgroundColors[this.currentIndex - 1];
        this.background.classList.remove(this.animateIn, this.animateOut);
        void this.background.offsetWidth; // Trigger reflow
        this.background.classList.add(this.animateIn);
        this.background.style.background = backgroundColors[this.currentIndex];
        
        this.imageContainer.classList.remove(this.animateIn, this.animateOut);
        void this.imageContainer.offsetWidth; // Trigger reflow
        this.imageContainer.classList.add(this.animateIn);
        this.imageContainer.style.background = backgroundColors[this.currentIndex];
        
        this.imageIsAnimating = true;
        
        setTimeout(() => {
            this.playerHandImage.classList.remove('animate-handIn', 'animate-handOut');
            void this.playerHandImage.offsetWidth; // Trigger reflow
            this.playerHandImage.src = handImages[this.currentIndex];
            this.playerHandImage.classList.add('animate-handIn');
        }, this.imageAnimationTime);
        
        setTimeout(() => {
            this.imageIsAnimating = false;
        }, this.animationTime);
    }

    startGame() {
        // Implementation needed
		this.frontDiv.style.display = 'none';
		
        this.cleanup()
		let offline_game = new offlineGame(handImages[this.playerOneIndex], handImages[this.playerTwoIndex], this.winScore, this.playerTwoName, this.playerOneName);
		offline_game.startGame();
    }

    cleanup() {
        this.nextBtn.removeEventListener('click', this.handleNextClick);
        this.prevBtn.removeEventListener('click', this.handlePrevClick);
        this.readyBtn.removeEventListener('click', this.handlePlayerTwoClick);
        this.readyBtn.removeEventListener('click', this.handlePlayerOneClick);
    }

}
export default HandSelection;




// let online_game = new onlineGame();
// online_game.startGame();

let online_game = new HandSelection();
online_game.start();

// let online_game = new onlineGame();
// online_game.startGame();