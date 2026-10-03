import type { ChatMessageData } from '../../types/chat';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
	message: ChatMessageData;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
	const messageClassName = message.isIncoming
		? `${styles.message} ${styles.incoming}`
		: `${styles.message} ${styles.outgoing}`;

	return <div className={messageClassName}>{message.messageText}</div>;
};
