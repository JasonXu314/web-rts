import { RenderAdapter } from '@web-rts/common';
import { Figure, Segment } from '@web-rts/math';
import { EngineState } from '../entity.js';
import { Sprite } from './sprite.js';

export abstract class DrawnSprite extends Sprite {
	constructor(private _layers: Figure[][]) {
		super();
	}

	public render(adapter: RenderAdapter, _: EngineState): void {
		this._layers.forEach((layer) => {
			layer.forEach((figure) => {
				if (figure instanceof Segment) {
					adapter.line(figure.p1.x + this.position.x, figure.p1.y + this.position.y, figure.p2.x + this.position.x, figure.p2.y + this.position.y);
				}
			});
		});
	}
}
