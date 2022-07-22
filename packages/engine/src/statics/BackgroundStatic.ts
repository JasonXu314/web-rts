import { RenderAdapter } from '@web-rts/common';
import { AssetStatic } from './AssetStatic.js';

export class BackgroundStatic extends AssetStatic {
	public render(adapter: RenderAdapter): void {
		adapter.image(this._image, 0, 0, {
			scale: Math.min(adapter.width / this._image.width, adapter.height / this._image.height)
		});
	}
}
