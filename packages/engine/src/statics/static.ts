import { Vector2 } from '@web-rts/math';
import { Entity } from '../entity.js';

export abstract class Static extends Entity {
	public readonly position: Vector2 = new Vector2(0, 0);
	public readonly layer: number = 0;
}
