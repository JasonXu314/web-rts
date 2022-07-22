import { DrawableImage, RenderAdapter } from '@web-rts/common/dist';

export interface EngineOptions {
	cursor?: DrawableImage;
	background?: DrawableImage;
}

export class Engine {
	private _running = false;
	private _cursor: DrawableImage | null = null;
	private _background: DrawableImage | null = null;

	constructor(private _adapter: RenderAdapter, options?: EngineOptions) {
		const opts = options || {};

		if (opts.cursor) {
			this._cursor = opts.cursor;
		}
		if (opts.background) {
			this._background = opts.background;
		}

		if (this._cursor) {
			this._adapter.hideCursor();
		}
	}

	public run() {
		this._running = true;

		this._render();
	}

	private _render() {
		this._adapter.clear();

		if (this._background) {
			this._adapter.image(this._background, 0, 0, {
				scale: Math.min(this._adapter.width / this._background.width, this._adapter.height / this._background.height)
			});
		}
		if (this._cursor && this._adapter.mousePos) {
			this._adapter.image(this._cursor, ...this._adapter.mousePos, { scale: 0.025, centered: false });
		}

		requestAnimationFrame(() => this._render());
	}
}
