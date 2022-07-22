import { acos, atan, sign, sqrt } from './functions.js';

export class Vector2 {
	public static readonly ZERO = new Vector2(0, 0);
	public static readonly NORTH = new Vector2(0, 1);
	public static readonly EAST = new Vector2(1, 0);
	public static readonly SOUTH = new Vector2(0, -1);
	public static readonly WEST = new Vector2(-1, 0);

	constructor(public x: number = 0, public y: number = 0) {}

	public add(other: Vector2): Vector2 {
		return new Vector2(this.x + other.x, this.y + other.y);
	}

	public subtract(other: Vector2): Vector2 {
		return new Vector2(this.x - other.x, this.y - other.y);
	}

	public vectorTo(other: Vector2): Vector2 {
		return other.subtract(this);
	}

	public dot(other: Vector2): number {
		return this.x * other.x + this.y * other.y;
	}

	public minorTo(other: Vector2): number {
		return acos(this.dot(other) / (this.mag * other.mag));
	}

	public majorTo(other: Vector2): number {
		return Math.PI * 2 - this.minorTo(other);
	}

	public equals(other: Vector2): boolean {
		return this.x === other.x && this.y === other.y;
	}

	public get bearing(): number {
		return atan(this.x / this.y) + (this.y < 0 ? sign(this.x) * Math.PI : 0);
	}

	public get mag(): number {
		return sqrt(this.x * this.x + this.y * this.y);
	}

	public get magnitude(): number {
		return this.mag;
	}

	public clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	public static from(raw: [number, number]): Vector2;
	public static from(raw: { x: number; y: number }): Vector2;
	public static from(raw: [number, number] | { x: number; y: number }): Vector2 {
		if (Array.isArray(raw)) {
			return new Vector2(...raw);
		} else if (typeof raw === 'object') {
			return new Vector2(raw.x, raw.y);
		} else {
			throw new Error('Vector2::from(): Invalid argument');
		}
	}

	public *[Symbol.iterator]() {
		yield this.x;
		yield this.y;
	}
}
