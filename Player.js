import CustomImage from "./image.js";
import Hand from "./Hand.js";
import game  from "./game.js";


// Variables for shaking effect
let shakeDuration = 600; // Duration of the shake in milliseconds
let shakeMagnitude = 16; // Magnitude of the shake
let shakeTime = 0;


const colorContainer = document.getElementById("color-container")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


class Player {
	constructor(position, initialRole, canvas, PlayerHandImage, context, assets, game) {
		this.game = game;
		this.assets = assets;
		this.context = context;
		this.state = initialRole;
		this.position = position;
		this.handImage = PlayerHandImage;
		this.canvas = canvas;
		this.opponent = null;
		this.canvasWidth = canvas.width;
		this.canvasHeight = canvas.height;
		this.shouldAttack = true;
		this.shouldRetreat = true;
		this.isPlayerAnimating = false;


		
		this.slapEffectImage = new CustomImage("/assets/slap-effect.png");
		this.slapEffectImage1 = new CustomImage("/assets/slap.png");
		this.missedImage = new CustomImage("/assets/missed.png");
		this.win = false;
		this.maxScore = this.game.winScore;
		this.isPlayerPaused = false;
		this.isMissed = false;
	}
	
	initPlayer() {
		this.score = 0;
		this.harmLevel = 6;

		this.hand = new Hand(this.position, this.canvasHeight, this.handImage);
		this.handWidth = this.hand.getWidth();
		this.handHeight = this.hand.getHeight();
		
		
		this.isPlayerRising = true;
		this.isPlayerFalling = true;
		
		this.pauseDuration = 400;
		this.animationSpeed = 100;
		this.animationFrame = null;
		
		this.maxAtack = this.handHeight / 2 - 70;
		this.maxRetreat = 250;
	
		if (this.position === "top") {
			this.maxAttackHeight = this.hand.getInitialY() + this.maxAtack;
			this.maxRetreat = this.hand.getInitialY() - this.maxRetreat;
		}
		if (this.position === "buttom") {
			this.maxAttackHeight = this.hand.getInitialY() - this.maxAtack;
			this.maxRetreat = this.hand.getInitialY() + this.maxRetreat;
		}

		this.maxTopRetreat = -700;
		this.maxRetreatButtomHeight = 250;

		this.hnadInitialY = this.hand.getInitialY();
		this.handCurrentY = this.hnadInitialY;

		this.isPlayerHit = false

		this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
        this.isShaking = false;

		this.isFrozen = false;
	}

	setOpponent(opponent) {
		this.opponent = opponent;
	}

	shakeCanvas() {
		console.log("shakeCanvas")
        if (shakeTime > 0) {
            this.isShaking = true;
            // Calculate random shake offsets
            this.shakeOffsetX = Math.random() * shakeMagnitude - shakeMagnitude / 2;
            this.shakeOffsetY = Math.random() * shakeMagnitude - shakeMagnitude / 2;

            // Reduce the shake time
            shakeTime -= 16; // Assuming 60 frames per second

            // Continue shaking until time runs out
            requestAnimationFrame(() => this.shakeCanvas());
        } else {
            // Reset shake offsets
            this.shakeOffsetX = 0;
            this.shakeOffsetY = 0;
            this.isShaking = false;
        }
    }

	startAnimation(type) {
		this.isPlayerAnimating = true;

		if (type === "attack" && this.shouldAttack)
			this.animateAttack();
		else if (type === "retreat" && this.shouldRetreat)
			this.animateRetreat();
	}

	isHitTheOpponent() {
		const hitRec = 80;
		if (this.position === "buttom") {			
			let opponentHandY = this.opponent.handCurrentY + this.opponent.handHeight - hitRec;
			let playerHandY = this.handCurrentY;

			if (this.opponent.isPlayerAnimating)
				opponentHandY = this.opponent.handCurrentY + this.handHeight - hitRec;

			if (playerHandY <= opponentHandY )
				return true;
		}
		else if (this.position === "top") {
			let opponentHandY = this.opponent.handCurrentY + hitRec;

			let playerHandY = this.handCurrentY + this.handHeight;

			if (this.opponent.isPlayerAnimating)
				opponentHandY = this.opponent.handCurrentY + hitRec;

			if (playerHandY >= opponentHandY)
				return true;
		}
		return false;
	}

	update() {
		if (this.isPlayerAnimating) {
	
			if (this.animationType === "attack")
				this.animateAttack();
			else if (this.animationType === "retreat")
				this.animateRetreat();
		}
	}

	stopAnimation() {
		this.isPlayerAnimating = false;
		cancelAnimationFrame(this.animationFrame);
	}
	
	resetHandPosition() {
        this.handCurrentY = this.hand.getInitialY();
        this.isPlayerAnimating = false;
        this.isPlayerRising = true;
        this.isPlayerFalling = true;
    }

	async switchRoles() {
		console.log("switching colors ")
		await this.game.loadGame("Switching Roles", 100);
		this.resetHandPosition();
		this.opponent.resetHandPosition();

		if (this.position === "top" && this.state === "attack") {
			this.state = "retreat";
			this.opponent.state = "attack";
		}
		else  if (this.position === "top" && this.state === "retreat") {
			this.opponent.state = "retreat";
			this.state = "attack";
		}
		else if (this.position === "buttom" && this.state === "attack") {
			this.state = "retreat";
			this.opponent.state = "attack";
		}
		else if (this.position === "buttom" && this.state === "retreat") {
			this.opponent.state = "retreat";
			this.state = "attack";
		}
		this.isMissed = false;
		this.game.gameLoop();
	}


	async handleHit() {
		this.score += 1;
		this.opponent.isPlayerHit = true;
	
		// Draw slap effect
		let handY = this.getHandCurrentY();
		if (this.position === "top")
			handY = this.opponent.getHandCurrentY();
	
		this.slapEffectImage.draw(this.context, this.canvasWidth / 2 - this.slapEffectImage.width / 2, handY);
		this.slapEffectImage1.draw(this.context, this.canvasWidth / 2 - this.slapEffectImage1.width / 2, handY);
	
		// Start shaking the canvas
		shakeTime = shakeDuration;
		this.shakeCanvas();
	
		// Freeze everything for a second
		this.isFrozen = true;
		this.opponent.isFrozen = true;
		this.isPlayerAnimating = false;
		this.opponent.isPlayerAnimating = false;
	
		return new Promise(resolve => {
			setTimeout(() => {
				this.isFrozen = false;
				this.opponent.isFrozen = false;
				this.isPlayerAnimating = true;
				this.opponent.isPlayerAnimating = true;
	
				// Return both hands to their initial positions
				this.handCurrentY = this.hand.getInitialY();
				this.opponent.handCurrentY = this.opponent.hand.getInitialY();
	
				// Reset animation states for both players
				if (this.position === "top") {
					this.isPlayerFalling = true;
					this.opponent.isPlayerRising = true;
				} else {
					this.isPlayerRising = true;
					this.opponent.isPlayerFalling = true;
				}
	
				// Check for win condition after animation is complete
				if (this.score >= this.maxScore) {
					this.game.gameOver = true;
					setTimeout(()=> {
						this.win = true;
					}, 800)
				}
	
				resolve();
			}, this.pauseDuration);
		});
	}



	animateAttack() {
		// console.log("animating attack ...");
		if (!this.isPlayerAnimating) {
			cancelAnimationFrame(this.animationFrame);
			return;
		}

		if (this.isPlayerPaused) {
			this.animationFrame = requestAnimationFrame(() => this.animateAttack());
			return;
		}

		if (this.position == "top")
			this.animateTopAttack();
		else
			this.animateButtomAttack();

		if (this.isPlayerAnimating)
			this.animationFrame = requestAnimationFrame(() => this.animateAttack());
		
		this.update();
		
		if (this.isPlayerAnimating == false && this.isMissed) {
			this.switchRoles()
		}
	}

	async animateTopAttack() {
		if (this.isPlayerFalling) {
            this.handCurrentY += this.animationSpeed;
            if (this.handCurrentY >= this.maxAttackHeight) {
				console.log("max top attack height: ", this.maxAttackHeight);
                this.handCurrentY = this.maxAttackHeight;
				if (this.isHitTheOpponent()) {
					await this.handleHit();
				} else {
					this.isMissed = true;
				}
				this.isPlayerFalling = false;
				this.isPlayerPaused = true;
				setTimeout(() => {
					this.isPlayerPaused = false;
					this.animateTopAttack();
				}, this.pauseDuration);
				return;
			}
        } else {
			this.handCurrentY -= this.animationSpeed;
            if (this.handCurrentY <= this.hand.getInitialY()) {
				this.handCurrentY = this.hand.getInitialY();
                this.isPlayerAnimating = false;
                this.isPlayerFalling = true;
            }
        }
	}
	
	async animateButtomAttack() {
		if (this.isPlayerRising) {
			this.handCurrentY -= this.animationSpeed;
			if (this.handCurrentY <= this.maxAttackHeight) {
				this.handCurrentY = this.maxAttackHeight;
				
				if (this.isHitTheOpponent()) {
					await this.handleHit();
				} else {
					this.isMissed = true;
					
				}

			this.isPlayerRising = false;
			this.isPlayerPaused = true;
			
			setTimeout(() => {
				this.isPlayerPaused = false;
				this.animateButtomAttack();
			}, this.pauseDuration);
			
			return;
			}
		} else {
			// Falling
			this.handCurrentY += this.animationSpeed;
			if (this.handCurrentY >= this.hand.getInitialY()) {
				this.handCurrentY = this.hand.getInitialY();
				this.isPlayerAnimating = false;
				console.log("setting ::: ", this.isPlayerAnimating)
				this.isPlayerRising = true;
			}
		}
	}

	animateRetreat() {
		if (!this.isPlayerAnimating) {
			cancelAnimationFrame(this.animationFrame);
			return;
		}


		if (this.isPlayerPaused) {
			this.animationFrame = requestAnimationFrame(() => this.animateRetreat());
			return;
		}

		if (this.position == "top")
			this.animateTopRetreat();
		else
			this.animateButtomRetreat();

		this.update();
		
		if (this.isPlayerAnimating)
			this.animationFrame = requestAnimationFrame(() => this.animateRetreat());
	}

	animateTopRetreat() {
		if (this.isPlayerRising) {
			this.handCurrentY -= this.animationSpeed;
			if (this.handCurrentY <= this.maxRetreat){
				this.handCurrentY = this.maxRetreat;
				this.isPlayerRising = false;
				this.isPlayerPaused = true;
				setTimeout(() => {
					this.isPlayerPaused = false;
					this.animateTopRetreat();
				}, this.pauseDuration + 300);
				return;
			}
		}
		else {
			if (this.opponent.isPlayerAnimating) return
			this.handCurrentY += this.animationSpeed;
			if (this.handCurrentY >= this.hand.getInitialY()) {
				this.handCurrentY = this.hand.getInitialY();
				this.isPlayerAnimating = false;
				this.isPlayerRising = true;
			}
		}
	}
		
	animateButtomRetreat() {
			if (this.isPlayerFalling) {
				this.handCurrentY += this.animationSpeed;
				if (this.handCurrentY >= this.maxRetreat) {
					this.handCurrentY =  this.maxRetreat;
					this.isPlayerFalling = false;
					this.isPlayerPaused = true;
					setTimeout(() => {
						this.isPlayerPaused = false;
						this.animateButtomRetreat();
					}, this.pauseDuration + 300);
					return;
				}
			} else {
				if (this.opponent.isPlayerAnimating) return
					this.handCurrentY -= this.animationSpeed;
					if (this.handCurrentY <= this.hand.getInitialY()) {
						this.handCurrentY = this.hand.getInitialY();
						this.isPlayerAnimating = false;
						this.isPlayerFalling = true;
					}

		}
	}

	getHand() {
		return this.hand;
	}

	getState() {
		return this.state;
	}

	setState(state) {
		this.state = state;
	}
	getPlayerState() {
		return this.isInAction
	}
	getHandCurrentY() {
		return this.handCurrentY;
	}
}

export default Player; 