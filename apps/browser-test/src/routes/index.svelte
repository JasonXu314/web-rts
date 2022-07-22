<script lang="ts">
	import { CanvasAdapter, Image } from '@web-rts/adapter-canvas';
	import { AssetSprite, Engine } from '@web-rts/engine';
	import { onMount } from 'svelte';
	import { TestSprite } from '../lib/TestSprite';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const adapter = new CanvasAdapter(canvas.getContext('2d')!);

		(window as any).adapter = adapter;
		(window as any).BI = Image;

		const engine = new Engine(adapter, { cursor: new Image('/cursor.png'), background: new Image('/checkerboard.jpg') });

		(window as any).engine = engine;
		(window as any).AssetSprite = AssetSprite;

		engine.register(new TestSprite());

		engine.run();
	});
</script>

<canvas
	bind:this={canvas}
	width={typeof window !== 'undefined' ? window.innerWidth : undefined}
	height={typeof window !== 'undefined' ? window.innerHeight : undefined}
/>

<style>
	canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
