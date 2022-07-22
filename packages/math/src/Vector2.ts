export class Vector2 {
	constructor(public x: number = 0, public y: number = 0) {}

	*[Symbol.iterator]() {
		yield this.x;
		yield this.y;
	}
}
