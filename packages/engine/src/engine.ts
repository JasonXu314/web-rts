import { DrawableImage, KeyCodes, RenderAdapter } from '@web-rts/common';
import { Vector2 } from '@web-rts/math';
import { Entity } from './entity.js';
import { MouseSprite, Sprite } from './sprites/index.js';
import { BackgroundStatic } from './statics/index.js';

export interface EngineOptions {
	cursor?: DrawableImage;
	background?: DrawableImage;
}

export class Engine {
	private _running = false;
	private _cursor: MouseSprite | null = null;
	private _background: BackgroundStatic | null = null;
	private _focus: Vector2 = new Vector2(0, 0);
	private _zoom: number = 1;
	private _entities: Entity[] = [];
	private _sprites: Sprite[] = [];
	private _namedEntities: { [name: string]: Entity } = {};
	private _keyState: { [key in KeyCodes]: boolean };

	constructor(private _adapter: RenderAdapter, options?: EngineOptions) {
		const opts = options || {};

		if (opts.cursor) {
			this._cursor = new MouseSprite(opts.cursor);
		}
		if (opts.background) {
			this._background = new BackgroundStatic(opts.background);
		}

		this._keyState = Object.fromEntries(Object.values(KeyCodes).map((key) => [key, false])) as { [key in KeyCodes]: boolean };
	}

	public register(entity: Entity, name?: string) {
		this._entities.push(entity);

		if (name !== undefined) {
			this._namedEntities[name] = entity;
		}

		if (entity instanceof Sprite) {
			this._sprites.push(entity);
		}
	}

	public remove(entity: string): void;
	public remove(entity: Entity): void;
	public remove(entity: Entity | string): void {
		if (typeof entity === 'string') {
			const entityName = entity;
			entity = this._namedEntities[entity];
			delete this._namedEntities[entityName];
		}

		this._entities = this._entities.filter((e) => e !== entity);

		if (entity instanceof Sprite) {
			this._sprites = this._sprites.filter((s) => s !== entity);
		}
	}

	public run() {
		this._running = true;

		if (this._cursor) {
			this._adapter.hideCursor();
		}

		this._adapter.on('keydown', (evt) => {
			this._keyState[evt.key] = true;
		});

		this._adapter.on('keyup', (evt) => {
			this._keyState[evt.key] = false;
		});

		this._render();
	}

	private _render() {
		this._adapter.clear();

		if (this._background) {
			this._background.render(this._adapter);
		}
		if (this._cursor) {
			this._cursor.render(this._adapter);
			this._cursor.update(this._adapter);
		}

		this._entities
			.sort((a, b) => a.layer - b.layer)
			.forEach((entity) => {
				entity.render(this._adapter, {
					keyPressed: (key) => {
						return this._keyState[key];
					},
					sprites: [...this._sprites]
				});
			});

		this._sprites.forEach((sprite) => {
			sprite.update(this._adapter, {
				keyPressed: (key) => {
					return this._keyState[key];
				},
				sprites: [...this._sprites]
			});
		});

		// console.log(this._keyState);

		requestAnimationFrame(() => this._render());
	}
}
