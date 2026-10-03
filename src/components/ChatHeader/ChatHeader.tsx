import styles from './ChatHeader.module.css';

interface ChatHeaderProps {
	phoneNumber: string;
	onBack: () => void;
}

export const ChatHeader = ({ phoneNumber, onBack }: ChatHeaderProps) => {
	return (
		<header className={styles.header}>
			<button type="button" className={styles.backButton} onClick={onBack} aria-label="Назад">
				<svg className={styles.backIcon} viewBox="0 0 24 24" aria-hidden="true">
					<path
						d="M19 12H5M11 6l-6 6 6 6"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			<span className={styles.phoneNumber}>{phoneNumber}</span>
		</header>
	);
};
