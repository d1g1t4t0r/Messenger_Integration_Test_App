import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import styles from './ChatTextField.module.css';

interface ChatTextFieldProps {
	onSend: (messageText: string) => void;
}

const MAX_LINES = 10;
const LINE_HEIGHT = 22;

export const ChatTextField = ({ onSend }: ChatTextFieldProps) => {
	const [value, setValue] = useState('');

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const resizeTextarea = () => {
		const textarea = textareaRef.current;

		if (!textarea) {
			return;
		}

		textarea.style.height = 'auto';

		const maxHeight = LINE_HEIGHT * MAX_LINES;

		const newHeight = Math.min(textarea.scrollHeight, maxHeight);

		textarea.style.height = `${newHeight}px`;

		textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
	};

	useEffect(() => {
		resizeTextarea();
	}, [value]);

	const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setValue(event.target.value);
	};

	const handleSend = () => {
		const message = value.trim();

		if (!message) {
			return;
		}

		onSend(message);
		setValue('');

		requestAnimationFrame(() => {
			textareaRef.current?.focus();
		});
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			handleSend();
		}
	};

	const hasText = value.trim().length > 0;

	return (
		<div className={styles.wrapper}>
			<div className={styles.inputContainer}>
				<textarea
					ref={textareaRef}
					className={styles.textarea}
					value={value}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder="Сообщение"
					rows={1}
					aria-label="Сообщение"
				/>

				{hasText && (
					<button
						type="button"
						className={styles.sendButton}
						onClick={handleSend}
						aria-label="Отправить сообщение"
					>
						<svg className={styles.sendIcon} viewBox="0 0 24 24" aria-hidden="true">
							<path
								d="M12 19V5M6 11l6-6 6 6"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
				)}
			</div>
		</div>
	);
};
