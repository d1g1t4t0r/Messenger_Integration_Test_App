import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { routeTarget } from './routes';
import { useAppConfig } from '../context/useAppConfig';

const StartPage = lazy(() =>
	import('../pages/StartPage/StartPage').then((module) => ({
		default: module.StartPage,
	})),
);

const PhoneCheckPage = lazy(() =>
	import('../pages/PhoneCheckPage/PhoneCheckPage').then((module) => ({
		default: module.PhoneCheckPage,
	})),
);

const ChatPage = lazy(() =>
	import('../pages/ChatPage/ChatPage').then((module) => ({
		default: module.ChatPage,
	})),
);

const AppRouter = () => {
	const { config } = useAppConfig();

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Routes>
				<Route
					path={routeTarget.start}
					element={config ? <Navigate to={routeTarget.phoneCheck} replace /> : <StartPage />}
				/>

				<Route
					path={routeTarget.phoneCheck}
					element={config ? <PhoneCheckPage /> : <Navigate to={routeTarget.start} replace />}
				/>

				<Route
					path={routeTarget.chat}
					element={config ? <ChatPage /> : <Navigate to={routeTarget.start} replace />}
				/>

				<Route
					path="*"
					element={<Navigate to={config ? routeTarget.phoneCheck : routeTarget.start} replace />}
				/>
			</Routes>
		</Suspense>
	);
};

export default AppRouter;
