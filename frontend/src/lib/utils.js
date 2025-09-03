import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => {
	return twMerge(clsx(...inputs));
}

export const randomRange = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const lerp = (a, b, t) => {
	return a + (b - a) * t;
}

export const clamp = (x, minimum, maximum) => {
	if (x < minimum)
		return minimum;
	if (x > maximum)
		return maximum;
	return x;
}

export const throttle = (func, limit) => {
	let waiting = false;
	return function (...args) {
		if (!waiting) {
			func.apply(this, args);
			waiting = true;
			setTimeout(() => waiting = false, limit);
		}
	};
}

export const getCookie = (document, name) => {
	var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	if (match) return match[2];
}