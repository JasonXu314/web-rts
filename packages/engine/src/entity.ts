import { KeyCodes, RenderAdapter } from '@web-rts/common';
import { Vector2 } from '@web-rts/math';
import { Sprite } from './sprites/index.js';

export interface EngineState {
	sprites: Sprite[];
	keyPressed(key: KeyCodes): boolean;
}

export abstract class Entity {
	public position: Vector2 = new Vector2(0, 0);
	public layer: number = 0;

	public abstract render(adapter: RenderAdapter, state: EngineState): void;
}
