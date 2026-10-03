import styles from './StartPage.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routeTarget } from '../../router/routes';
import { useAppConfig } from '../../context/useAppConfig';

export const StartPage = () => {
	const navigate = useNavigate();
	const { setConfig } = useAppConfig();

	const [idInstance, setIdInstance] = useState('');
	const [apiTokenInstance, setApiTokenInstance] = useState('');

	const handleStart = () => {
		if (!idInstance || !apiTokenInstance) {
			return;
		}

		setConfig({
			idInstance,
			apiTokenInstance,
		});

		navigate(routeTarget.chat);
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

				<button type="button" className={styles.startButton} onClick={handleStart}>
					Начать
				</button>
			</section>
		</main>
	);
};
