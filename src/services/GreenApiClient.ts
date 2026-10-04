import { config } from '../config';

interface GreenApiClientConfig {
	idInstance: string;
	apiTokenInstance: string;
}

export interface SendMessageResponse {
	idMessage: string;
}

interface SendMessageRequest {
	chatId: string;
	message: string;
}

export interface SendMessageResponse {
	idMessage: string;
}

export interface ReceiveNotificationResponse {
	receiptId: number;
	body: ReceiveNotificationBody;
}

export interface ReceiveNotificationBody {
	typeWebhook: string;
	timestamp: number;
	idMessage: string;

	senderData: {
		chatId: string;
	};

	messageData: {
		typeMessage: string;

		textMessageData?: {
			textMessage: string;
		};
	};
}

export interface DeleteNotificationResponse {
	result: boolean;
}

export interface CheckAccountResponse {
	exist: boolean;
	chatId: string;
	fromCache: boolean;
}

export interface GetContactInfoResponse {
	name: string;
	phoneNumber: number;
}

export interface GetStateInstanceResponse {
	stateInstance: string;
}

export class GreenApiClient {
	readonly idInstance: string;
	readonly apiTokenInstance: string;

	constructor(config: GreenApiClientConfig) {
		this.idInstance = config.idInstance;
		this.apiTokenInstance = config.apiTokenInstance;
	}

	private getUrl(method: string, additional?: string) {
		return `${config.apiUrl}/waInstance${this.idInstance}/${method}/${this.apiTokenInstance}${additional ?? ''}`;
	}

	// Метод для проверки первичного ввода параметров инстанса: если корректно, то идем дальше
	static async getStateInstance(
		idInstance: string,
		apiTokenInstance: string,
	): Promise<GetStateInstanceResponse> {
		const url = `${config.apiUrl}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`;

		const response = await fetch(url, {
			method: 'GET',
		});

		if (!response.ok) {
			throw new Error(`Ошибка проверки инстанса: ${response.status} ${response.statusText}`);
		}

		return response.json() as Promise<GetStateInstanceResponse>;
	}

	async checkAccount(phoneNumber: number): Promise<CheckAccountResponse> {
		const response = await fetch(this.getUrl('checkAccount'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				phoneNumber,
			}),
		});

		if (!response.ok) {
			throw new Error(`Ошибка проверки номера: ${response.status} ${response.statusText}`);
		}

		return response.json() as Promise<CheckAccountResponse>;
	}

	async getContactInfo(chatId: string): Promise<GetContactInfoResponse> {
		const response = await fetch(this.getUrl('getContactInfo'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				chatId,
			}),
		});

		if (!response.ok) {
			throw new Error(
				`Ошибка получения информации о контакте: ${response.status} ${response.statusText}`,
			);
		}

		return response.json() as Promise<GetContactInfoResponse>;
	}

	sendMessage = async (chatId: string, messageText: string): Promise<SendMessageResponse> => {
		const url = `${config.apiUrl}/waInstance${this.idInstance}/sendMessage/${this.apiTokenInstance}`;

		const requestBody: SendMessageRequest = {
			chatId,
			message: messageText,
		};

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		});

		if (!response.ok) {
			throw new Error(`Ошибка отправки сообщения: ${response.status} ${response.statusText}`);
		}

		const data: SendMessageResponse = await response.json();

		return data;
	};

	receiveNotification = async (): Promise<ReceiveNotificationResponse | null> => {
		const url = `${config.apiUrl}/waInstance${this.idInstance}/receiveNotification/${this.apiTokenInstance}?receiveTimeout=60`;

		const response = await fetch(url, {
			method: 'GET',
		});

		if (!response.ok) {
			throw new Error(`Ошибка получения уведомления: ${response.status} ${response.statusText}`);
		}

		const text = await response.text();

		// Таймаут закончился, уведомлений нет
		if (!text) {
			return null;
		}

		return JSON.parse(text) as ReceiveNotificationResponse;
	};

	deleteNotification = async (receiptId: number): Promise<DeleteNotificationResponse> => {
		const url = `${config.apiUrl}/waInstance${this.idInstance}/deleteNotification/${this.apiTokenInstance}/${receiptId}`;

		const response = await fetch(url, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error(`Ошибка удаления уведомления: ${response.status} ${response.statusText}`);
		}

		return response.json() as Promise<DeleteNotificationResponse>;
	};
}
