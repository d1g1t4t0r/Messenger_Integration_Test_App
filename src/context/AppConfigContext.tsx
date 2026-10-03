import { createContext } from 'react';

import type { AppConfig, SelectedContact } from './types';

export interface AppConfigContextValue {
	config: AppConfig | null;
	selectedContact: SelectedContact | null;

	setConfig: (config: AppConfig) => void;
	setSelectedContact: (contact: SelectedContact) => void;

	clearSelectedContact: () => void;
	clearConfig: () => void;
}

export const AppConfigContext = createContext<AppConfigContextValue | null>(null);
