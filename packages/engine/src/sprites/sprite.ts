import { RenderAdapter } from '@web-rts/common';
import { EngineState, Entity } from '../entity.js';

export abstract class Sprite extends Entity {
	public abstract update(adapter: RenderAdapter, state: EngineState): void;
}
