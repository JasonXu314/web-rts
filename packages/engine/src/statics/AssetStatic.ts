import { DrawableImage, RenderAdapter } from '@web-rts/common';
import { EngineState } from '../entity.js';
import { Static } from './static.js';

export class AssetStatic extends Static {
	protected _image: DrawableImage;

	constructor(image: DrawableImage) {
		super();
		this._image = image;
	}

	public render(ctx: RenderAdapter, _: EngineState) {
		ctx.image(this._image, this.position.x, this.position.y);
	}
}
