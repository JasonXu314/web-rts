import { RenderAdapter } from '@web-rts/common';
import { Vector2 } from '@web-rts/math';
import { AssetSprite } from './AssetSprite.js';

export class MouseSprite extends AssetSprite {
	public render(adapter: RenderAdapter): void {
		adapter.image(this._image, this.position.x, this.position.y, { scale: Math.min(15 / this._image.width, 30 / this._image.height), centered: false });
	}

	public update(adapter: RenderAdapter): void {
		if (adapter.mousePos) {
			this.position = Vector2.from(adapter.mousePos);
		}
	}
}
