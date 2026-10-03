import { useEffect, useMemo, useState } from 'react';
import { ChatHeader } from '../../components/ChatHeader/ChatHeader';
import { ChatMessage } from '../../components/ChatMessage/ChatMessage';
import { ChatTextField } from '../../components/ChatTextField/ChatTextField';
import type { ChatMessageData } from '../../types/chat';
import styles from './ChatPage.module.css';
import { useNavigate } from 'react-router-dom';
import { GreenApiClient } from '../../services/GreenApiClient';
import { useAppConfig } from '../../context/useAppConfig';

export const ChatPage = () => {
	const navigate = useNavigate();
	const { config, selectedContact, clearSelectedContact } = useAppConfig();

	const api = useMemo(() => new GreenApiClient(config!), [config]);
	const [messages, setMessages] = useState<ChatMessageData[]>([]);

	const handleSendMessage = async (messageText: string) => {
		const trimmedMessage = messageText.trim();

		if (!trimmedMessage) {
			return;
		}

		try {
			const response = await api.sendMessage(selectedContact?.chatId ?? '', trimmedMessage);

			const newMessage: ChatMessageData = {
				id: response.idMessage,
				isIncoming: false,
				messageText: trimmedMessage,
				timestamp: Date.now(),
				chatId: selectedContact?.chatId ?? '',
			};

			setMessages((currentMessages) => [...currentMessages, newMessage]);
		} catch (error) {
			console.error('Не удалось отправить сообщение:', error);
		}
	};

	const handleBack = () => {
		clearSelectedContact();
		navigate('/main');
	};

	// Связанное с получением

	useEffect(() => {
		if (!selectedContact?.chatId) {
			navigate('/main');
		}
		let isRunning = true;

		const receiveMessages = async () => {
			while (isRunning) {
				try {
					const notification = await api.receiveNotification();

					if (!isRunning) {
						return;
					}

					// Ничего не пришло - повторяем по второму кругу
					if (!notification) {
						continue;
					}

					const { body, receiptId } = notification;

					// На случай уведомлений, не являющихся входящими сообщениями, просто удаляем их
					if (
						body.typeWebhook !== 'incomingMessageReceived' ||
						body.messageData.typeMessage !== 'textMessage' ||
						!body.messageData.textMessageData
					) {
						await api.deleteNotification(receiptId);

						continue;
					}

					const incomingChatId = body.senderData.chatId;

					// Сообщение другого чата
					if (incomingChatId !== selectedContact?.chatId) {
						/* В текущей версии не требуется иметь несколько активных чатов, потому
          предположим, что на случай доработки здесь будет дополнительная обработка*/
						continue;
					}

					const newMessage: ChatMessageData = {
						id: body.idMessage,
						timestamp: body.timestamp,
						chatId: incomingChatId,
						isIncoming: true,
						messageText: body.messageData.textMessageData.textMessage,
					};

					// Сначала успешно добавляем сообщение
					setMessages((currentMessages) => [...currentMessages, newMessage]);

					// После обработки удаляем уведомление из очереди
					await api.deleteNotification(receiptId);
				} catch (error) {
					console.error('Ошибка удаления сообщения:', error);

					await new Promise((resolve) => setTimeout(resolve, 3000));
				}
			}
		};

		receiveMessages();

		return () => {
			isRunning = false;
		};
	}, [api, navigate, selectedContact]);

	return (
		<div className={styles.chatPage}>
			<ChatHeader phoneNumber={selectedContact?.name ?? 'Пользователь'} onBack={handleBack} />

			<main className={styles.messagesArea}>
				{messages.length === 0 ? (
					<div className={styles.noMessages}>Напишите сообщение!</div>
				) : (
					<div className={styles.messagesList}>
						{messages.map((message) => (
							<ChatMessage key={message.id} message={message} />
						))}
					</div>
				)}
			</main>

			<ChatTextField onSend={handleSendMessage} />
		</div>
	);
};
