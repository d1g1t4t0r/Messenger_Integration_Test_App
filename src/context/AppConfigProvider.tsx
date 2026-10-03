import { useState, type ReactNode } from 'react';

import { AppConfigContext } from './AppConfigContext';

import type { AppConfig, SelectedContact } from './types';

const ID_INSTANCE_KEY = 'idInstance';
const API_TOKEN_INSTANCE_KEY = 'apiTokenInstance';

const getInitialConfig = (): AppConfig | null => {
	const idInstance = localStorage.getItem(ID_INSTANCE_KEY);
	const apiTokenInstance = localStorage.getItem(API_TOKEN_INSTANCE_KEY);

	if (!idInstance || !apiTokenInstance) {
		return null;
	}

	return {
		idInstance,
		apiTokenInstance,
	};
};

interface AppConfigProviderProps {
	children: ReactNode;
}

export const AppConfigProvider = ({ children }: AppConfigProviderProps) => {
	const [config, setConfigState] = useState<AppConfig | null>(getInitialConfig);

	const [selectedContact, setSelectedContact] = useState<SelectedContact | null>(null);

	const setConfig = (newConfig: AppConfig) => {
		localStorage.setItem(ID_INSTANCE_KEY, newConfig.idInstance);

		localStorage.setItem(API_TOKEN_INSTANCE_KEY, newConfig.apiTokenInstance);

		setConfigState(newConfig);
		setSelectedContact(null);
	};

	const clearSelectedContact = () => {
		setSelectedContact(null);
	};

	const clearConfig = () => {
		localStorage.removeItem(ID_INSTANCE_KEY);
		localStorage.removeItem(API_TOKEN_INSTANCE_KEY);

		setConfigState(null);
		setSelectedContact(null);
	};

	return (
		<AppConfigContext.Provider
			value={{
				config,
				selectedContact,
				setConfig,
				setSelectedContact,
				clearSelectedContact,
				clearConfig,
			}}
		>
			{children}
		</AppConfigContext.Provider>
	);
};
