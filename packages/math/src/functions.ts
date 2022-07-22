export function sqrt(x: number): number {
	return Math.sqrt(x);
}

export function nthRoot(x: number, n: number): number {
	return Math.pow(x, 1 / n);
}

export function acos(x: number): number {
	return Math.acos(x);
}

export function atan(x: number): number {
	return Math.atan(x);
}

export function sign(x: number): number {
	return x < 0 ? -1 : 1;
}
