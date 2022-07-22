import { Vector2 } from '../Vector2.js';
import { Figure } from './figure.js';

export class Segment extends Figure {
	constructor(public p1: Vector2, public p2: Vector2) {
		super();
	}

	public get slope(): number {
		return (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
	}
}
