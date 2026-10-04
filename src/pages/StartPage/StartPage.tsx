import styles from './StartPage.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routeTarget } from '../../router/routes';
import { useAppConfig } from '../../context/useAppConfig';
import { GreenApiClient } from '../../services/GreenApiClient';

export const StartPage = () => {
	const navigate = useNavigate();
	const { setConfig } = useAppConfig();

	const [idInstance, setIdInstance] = useState('');
	const [apiTokenInstance, setApiTokenInstance] = useState('');

	const [isChecking, setIsChecking] = useState(false);
	const [error, setError] = useState('');

	const isFormValid = idInstance.trim() !== '' && apiTokenInstance.trim() !== '';

	const handleStart = async () => {
		if (!isFormValid || isChecking) {
			return;
		}
		setIsChecking(true);
		setError('');

		try {
			await GreenApiClient.getStateInstance(idInstance.trim(), apiTokenInstance.trim());

			setConfig({
				idInstance: idInstance.trim(),
				apiTokenInstance: apiTokenInstance.trim(),
			});

			navigate(routeTarget.chat);
		} catch (error) {
			console.error('Ошибка проверки инстанса:', error);

			setError(
				'Инстанс некорректен или произошла ошибка. Проверьте введенные данные и повторите попытку',
			);
		} finally {
			setIsChecking(false);
		}
	};

	return (
		<main className={styles.page}>
			<section className={styles.card}>
				<h1 className={styles.title}>GREEN-API</h1>

				<p className={styles.subtitle}>Подключение к MAX</p>

				<div className={styles.fields}>
					<label className={styles.field}>
						<span>idInstance</span>

						<input
							type="text"
							value={idInstance}
							onChange={(event) => setIdInstance(event.target.value)}
							placeholder="Введите idInstance"
						/>
					</label>

					<label className={styles.field}>
						<span>apiTokenInstance</span>

						<input
							type="text"
							value={apiTokenInstance}
							onChange={(event) => setApiTokenInstance(event.target.value)}
							placeholder="Введите apiTokenInstance"
						/>
					</label>
				</div>
				{error && <p className={styles.error}>{error}</p>}
				<button
					type="button"
					className={styles.startButton}
					onClick={handleStart}
					disabled={!isFormValid || isChecking}
				>
					{isChecking ? 'Проверка...' : 'Начать'}
				</button>
			</section>
		</main>
	);
};
