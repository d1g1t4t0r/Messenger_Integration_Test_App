import { useContext } from 'react';

import { AppConfigContext } from './AppConfigContext';

export const useAppConfig = () => {
	const context = useContext(AppConfigContext);

	if (!context) {
		throw new Error('useAppConfig must be used inside AppConfigProvider');
	}

	return context;
};
