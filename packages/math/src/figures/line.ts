import { Vector2 } from '../Vector2.js';
import { Figure } from './figure.js';

export class Line extends Figure {
	constructor(public b: number, public m: number) {
		super();
	}

	public get slope(): number {
		return this.m;
	}

	public get intercpt(): Vector2 {
		return new Vector2(0, this.m);
	}

	public static from(p1: Vector2, p2: Vector2): Line {
		const m = (p2.y - p1.y) / (p2.x - p1.x);
		const b = p1.y - m * p1.x;

		return new Line(b, m);
	}
}
