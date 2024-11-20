

class Hand {
	constructor(state, canvasHeight, PlayerHandImage) {
		this.PlayerHandImage = PlayerHandImage;
		this.state = state;

		this.initialY = -(this.PlayerHandImage.getHeight() / 2);
		if (state === "buttom")
			this.initialY = canvasHeight - (this.PlayerHandImage.getHeight() / 2);
		this.firstY = this.initialY;
		this.currentY = this.initialY;

		// console.log("first time y is ==> ", this.initialY);
	}

	getWidth() {
		return this.PlayerHandImage.width;
	}
	
	getHeight() {
		return this.PlayerHandImage.height;
	}

	getImage() {
		return this.PlayerHandImage;
	}
	getcurrentY() {
		return this.currentY;
	}
	getInitialY() {
		return this.firstY;
	}
	setcurrentY(y) {
		this.currentY = y;
	}
	setInitialY(y) {
		this.initialY = y;
	}
}

export default Hand;