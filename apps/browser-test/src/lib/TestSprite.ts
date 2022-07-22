import { KeyCodes, type RenderAdapter } from '@web-rts/common';
import { DrawnSprite, type EngineState } from '@web-rts/engine';
import { Segment, Vector2 } from '@web-rts/math';

export class TestSprite extends DrawnSprite {
	constructor() {
		super([
			[
				new Segment(new Vector2(10, -10), new Vector2(10, 10)),
				new Segment(new Vector2(10, 10), new Vector2(-10, 10)),
				new Segment(new Vector2(-10, 10), new Vector2(-10, -10)),
				new Segment(new Vector2(-10, -10), new Vector2(10, -10)),
				new Segment(new Vector2(10, -10), new Vector2(10, 10))
			]
		]);
		this.layer = 200;
	}

	public update(adapter: RenderAdapter, state: EngineState): void {
		if (state.keyPressed(KeyCodes.W)) {
			if (state.keyPressed(KeyCodes.SHIFT)) {
				this.position.y += 10;
			} else {
				this.position.y++;
			}
		}
		if (state.keyPressed(KeyCodes.S)) {
			if (state.keyPressed(KeyCodes.SHIFT)) {
				this.position.y -= 10;
			} else {
				this.position.y--;
			}
		}
		if (state.keyPressed(KeyCodes.A)) {
			if (state.keyPressed(KeyCodes.SHIFT)) {
				this.position.x -= 10;
			} else {
				this.position.x--;
			}
		}
		if (state.keyPressed(KeyCodes.D)) {
			if (state.keyPressed(KeyCodes.SHIFT)) {
				this.position.x += 10;
			} else {
				this.position.x++;
			}
		}
	}
}
