import styles from './ChatHeader.module.css';

interface ChatHeaderProps {
	contactName: string;
	phoneNumber: number;
	onBack: () => void;
}

const formatPhoneNumber = (phone: number): string => {
	const digits = String(phone);

	return `+${digits[0]} ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
};

export const ChatHeader = ({ contactName, phoneNumber, onBack }: ChatHeaderProps) => {
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
			<div className={styles.contactBlock}>
				<span className={styles.contactName}>{contactName}</span>
				<span className={styles.phoneNumber}>{formatPhoneNumber(phoneNumber)}</span>
			</div>
		</header>
	);
};
