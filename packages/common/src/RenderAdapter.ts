import { DrawableImage } from './image.js';
import { KeyCodes } from './KeyCodes.js';

export interface AdapterEvents {
	click: { x: number; y: number };
	drag: { start: [number, number]; end: [number, number] };
	'mouse-move': { start: [number, number]; end: [number, number]; delta: [number, number] };
	keydown: { key: KeyCodes };
	keyup: { key: KeyCodes };
}

export interface RenderAdapter {
	readonly width: number;
	readonly height: number;
	readonly mousePos: [number, number] | null;
	readonly mouseDown: boolean;
	readonly dragging: boolean;

	clear(): void;
	clear(x1: number, y1: number, x2: number, y2: number): void;
	hideCursor(): void;

	/**
	 * Draws an image to the underlying resource
	 * @param image The image to be drawn.
	 * @param x the x coordinate to position the image (center).
	 * @param y the y coordinate to position the image (center).
	 * @param options additional options for drawing the image.
	 */
	image(image: DrawableImage, x: number, y: number, options?: DrawImageOptions): void;

	line(x1: number, y1: number, x2: number, y2: number): void;
	point(x: number, y: number): void;
	circle(centerX: number, centerY: number, radius: number): void;

	on<T extends keyof AdapterEvents>(event: T, listener: (event: AdapterEvents[T]) => void): () => void;
}

export interface DrawImageOptions {
	scale?: number;
	scaleX?: number;
	scaleY?: number;
	rotation?: number;
}

export interface DrawImageOptions {
	/**
	 * The scale of the image.
	 * If this is set, the other scale options are ignored.
	 */
	scale?: number;

	/**
	 * The x-axis scale of the image.
	 */
	scaleX?: number;

	/**
	 * The y-axis scale of the image.
	 */
	scaleY?: number;

	/**
	 * The rotation of the image (relative to vertical).
	 * In radians
	 */
	rotation?: number;

	/**
	 * Whether to center the image or not (default true).
	 */
	centered?: boolean;
}
