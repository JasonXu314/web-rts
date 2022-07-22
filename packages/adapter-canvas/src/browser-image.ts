import { DrawableImage } from '@web-rts/common';

export class Image implements DrawableImage {
	private _elem: HTMLImageElement;

	constructor(src: Blob | File | HTMLImageElement | HTMLCanvasElement | string) {
		if (src instanceof HTMLImageElement) {
			this._elem = src;
		} else if (src instanceof HTMLCanvasElement) {
			this._elem = new window.Image();
			this._elem.src = src.toDataURL();
		} else {
			this._elem = new window.Image();

			if (typeof src === 'object') {
				this._elem.src = URL.createObjectURL(src);
			} else {
				this._elem.src = src;
			}
		}
	}

	public get elem() {
		return this._elem;
	}

	public get width() {
		return this._elem.width;
	}

	public get height() {
		return this._elem.height;
	}
}
