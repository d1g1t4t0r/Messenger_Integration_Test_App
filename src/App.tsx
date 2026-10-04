import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { AppConfigProvider } from './context/AppConfigProvider';

function App() {
	return (
		<BrowserRouter>
			<AppConfigProvider>
				<AppRouter />
			</AppConfigProvider>
		</BrowserRouter>
	);
}

export default App;
