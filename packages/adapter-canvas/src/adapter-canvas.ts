import { AdapterEvents, DrawImageOptions, RenderAdapter } from '@web-rts/common';
import { Image } from './browser-image';

export class CanvasAdapter implements RenderAdapter {
	private _listeners: {
		[T in keyof AdapterEvents]: ((event: AdapterEvents[T]) => void)[];
	} = {
		click: [],
		drag: [],
		'mouse-move': []
	};
	private _mousePos: [number, number] | null = null;
	private _dragStart: [number, number] | null = null;
	private _dragging: boolean = false;
	private _mouseDown: boolean = false;

	constructor(private ctx: CanvasRenderingContext2D) {
		ctx.canvas.addEventListener('mousedown', (e) => {
			this._mouseDown = true;
			this._dragStart = [this._toEngineX(e.offsetX), this._toEngineY(e.offsetY)];
		});

		ctx.canvas.addEventListener('mouseup', (e) => {
			if (this._dragging) {
				const dragStart = this._dragStart!;

				this._dragging = false;
				this._dragStart = null;
				this._mouseDown = false;

				this._listeners.drag.forEach((listener) =>
					listener({
						start: dragStart,
						end: [this._toEngineX(e.offsetX), this._toEngineY(e.offsetY)]
					})
				);
			} else {
				this._mouseDown = false;
				this._dragStart = null;

				this._listeners.click.forEach((listener) =>
					listener({
						x: this._toEngineX(e.offsetX),
						y: this._toEngineY(e.offsetY)
					})
				);
			}
		});

		const movelistener = (e: MouseEvent) => {
			const newPos = [this._toEngineX(e.offsetX), this._toEngineY(e.offsetY)] as [number, number];

			if (this._mouseDown && !this._dragging) {
				this._dragging = true;
			}

			this._listeners['mouse-move'].forEach((listener) =>
				listener({
					start: [...this._mousePos!],
					end: [...newPos],
					delta: [newPos[0] - this._mousePos![0], newPos[1] - this._mousePos![1]]
				})
			);

			this._mousePos = newPos;
		};

		ctx.canvas.addEventListener('mouseover', (evt) => {
			ctx.canvas.addEventListener('mousemove', movelistener);
			this._mousePos = [this._toEngineX(evt.offsetX), this._toEngineY(evt.offsetY)];
		});

		ctx.canvas.addEventListener('mouseout', () => {
			ctx.canvas.removeEventListener('mousemove', movelistener);
			this._mousePos = null;
		});
	}

	public get width() {
		return this.ctx.canvas.width;
	}

	public get height() {
		return this.ctx.canvas.height;
	}

	public get dragging() {
		return this._dragging;
	}

	public get mousePos() {
		return this._mousePos;
	}

	public get mouseDown() {
		return this._mouseDown;
	}

	public resize(width: number, height: number): void {
		this.ctx.canvas.width = width;
		this.ctx.canvas.height = height;
	}

	public image(image: Image, x: number, y: number, options?: DrawImageOptions): void {
		const { scale, scaleX, scaleY, rotation, centered } = { centered: true, scale: 1, ...(options || {}) };

		// because 0 for rotation is no rotation at all
		if (rotation) {
			this.ctx.save();
			this.ctx.translate(this._toCanvasX(x), this._toCanvasY(y));
			this.ctx.rotate(rotation);

			if (scale !== undefined) {
				this.ctx.drawImage(image.elem, -image.width / 2, -image.height / 2, image.width * scale, image.height * scale);
			} else if (scaleX !== undefined || scaleY !== undefined) {
				this.ctx.drawImage(image.elem, -image.width / 2, -image.height / 2, image.width * (scaleX ?? 1), image.height * (scaleY ?? 1));
			} else {
				this.ctx.drawImage(image.elem, -image.width / 2, -image.height / 2, image.width, image.height);
			}

			this.ctx.restore();
		} else if (scale !== undefined) {
			const width = image.width * scale,
				height = image.height * scale,
				adjustedX = this._toCanvasX(x) - (centered ? width / 2 : 0),
				adjustedY = this._toCanvasY(y) - (centered ? height / 2 : 0);

			this.ctx.drawImage(image.elem, adjustedX, adjustedY, width, image.height * scale);
		} else if (scaleX !== undefined || scaleY !== undefined) {
			const width = image.width * (scaleX ?? 1),
				height = image.height * (scaleY ?? 1),
				adjustedX = this._toCanvasX(x) - (centered ? width / 2 : 0),
				adjustedY = this._toCanvasY(y) - (centered ? height / 2 : 0);

			this.ctx.drawImage(image.elem, adjustedX, adjustedY, width, height);
		} else {
			this.ctx.drawImage(
				image.elem,
				this._toCanvasX(x) - (centered ? image.width / 2 : 0),
				this._toCanvasY(y) - (centered ? image.height / 2 : 0),
				image.width,
				image.height
			);
		}
	}

	public line(x1: number, y1: number, x2: number, y2: number): void {
		this.ctx.beginPath();
		this.ctx.moveTo(this._toCanvasX(x1), this._toCanvasY(y1));
		this.ctx.lineTo(this._toCanvasX(x2), this._toCanvasY(y2));
		this.ctx.stroke();
	}

	public point(x: number, y: number): void {
		this.circle(x, y, 0.5);
	}

	public circle(centerX: number, centerY: number, radius: number): void {
		this.ctx.beginPath();
		this.ctx.arc(this._toCanvasX(centerX), this._toCanvasY(centerY), radius, 0, 2 * Math.PI);
		this.ctx.fill();
	}

	public clear(): void;
	public clear(x1: number, y1: number, x2: number, y2: number): void;
	public clear(x1?: number, y1?: number, x2?: number, y2?: number): void {
		if (x1 === undefined) {
			this.ctx.clearRect(0, 0, this.width, this.height);
		} else {
			if (y1 === undefined || y2 === undefined || x2 === undefined) {
				throw new Error('CanvasAdapter#clear(): Must include all coordinates or none');
			} else {
				this.ctx.clearRect(x1, y1, x2 - x1, y2 - y1);
			}
		}
	}

	public hideCursor(): void {
		this.ctx.canvas.style.cursor = 'none';
	}

	public on<T extends keyof AdapterEvents>(event: T, listener: (evt: AdapterEvents[T]) => void): () => void {
		if (!(event in this._listeners)) {
			throw new Error(`CanvasAdapter#on(): Unknown event type: ${event.toString()}`);
		} else if (!listener) {
			throw new Error('CanvasAdapter#on(): Undefined listener');
		}

		this._listeners[event].push(listener);

		return () => {
			this._listeners[event].splice(this._listeners[event].indexOf(listener), 1);
		};
	}

	private _toCanvasX(x: number): number {
		return x + this.width / 2;
	}

	private _toCanvasY(y: number): number {
		return this.height / 2 - y;
	}

	private _toEngineX(x: number): number {
		return x - this.width / 2;
	}

	private _toEngineY(y: number): number {
		return this.height / 2 - y;
	}
}
