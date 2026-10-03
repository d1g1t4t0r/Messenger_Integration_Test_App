export interface RouteTarget {
	base: string;
	start: string;
	chat: string;
	phoneCheck: string;
}

export const routeTarget: RouteTarget = {
	base: '/',
	start: '/start',
	chat: '/chat',
	phoneCheck: '/phone-check',
};
