import { DrawableImage, RenderAdapter } from '@web-rts/common';
import { EngineState } from '../entity.js';
import { Sprite } from './sprite.js';

export class AssetSprite extends Sprite {
	protected _image: DrawableImage;

	constructor(image: DrawableImage) {
		super();
		this._image = image;
	}

	public render(adapter: RenderAdapter, _: EngineState): void {
		adapter.image(this._image, this.position.x, this.position.y);
	}

	public update(_: RenderAdapter, __: EngineState): void {}
}
