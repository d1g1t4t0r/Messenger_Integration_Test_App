import type { ChatMessageData } from '../../types/chat';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
	message: ChatMessageData;
}

const formatMessageTime = (timestamp: number) => {
	return new Intl.DateTimeFormat('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date(timestamp));
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
	return (
		<div className={`${styles.message} ${message.isIncoming ? styles.incoming : styles.outgoing}`}>
			<div className={styles.messageText}>{message.messageText}</div>

			<div className={styles.timestamp}>{formatMessageTime(message.timestamp)}</div>
		</div>
	);
};
