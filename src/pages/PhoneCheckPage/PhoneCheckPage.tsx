import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GreenApiClient } from '../../services/GreenApiClient';
import { routeTarget } from '../../router/routes';
import { useAppConfig } from '../../context/useAppConfig';

export const PhoneCheckPage = () => {
	const navigate = useNavigate();

	const { config, setSelectedContact, clearConfig } = useAppConfig();

	const [phoneNumber, setPhoneNumber] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isChecking, setIsChecking] = useState(false);

	const api = useMemo(() => {
		if (!config) {
			return null;
		}

		return new GreenApiClient(config);
	}, [config]);

	const handleCheck = async () => {
		if (!api) {
			return;
		}

		setErrorMessage('');

		const normalizedPhone = phoneNumber.replace(/\D/g, '');

		if (!normalizedPhone) {
			return;
		}

		setIsChecking(true);

		try {
			const checkResult = await api.checkAccount(Number(normalizedPhone));

			if (!checkResult.exist) {
				setErrorMessage('привязанный к данному номеру аккаунт в мессенджере MAX отсутствует');

				return;
			}

			const contactInfo = await api.getContactInfo(checkResult.chatId);

			setSelectedContact({
				chatId: checkResult.chatId,
				name: contactInfo.name,
			});

			navigate(routeTarget.chat);
		} catch (error) {
			console.error('Не удалось проверить номер:', error);

			setErrorMessage('Не удалось проверить номер. Попробуйте еще раз.');
		} finally {
			setIsChecking(false);
		}
	};

	const handleLogout = () => {
		clearConfig();
	};

	return (
		<main>
			<section>
				<div>
					<span>Вы вошли в аккаунт</span>

					<button type="button" onClick={handleLogout}>
						Выйти
					</button>
				</div>

				<div>
					<h1>Проверка номера</h1>

					<p>Введите номер телефона, чтобы проверить наличие аккаунта в MAX</p>

					<input
						type="tel"
						value={phoneNumber}
						onChange={(event) => setPhoneNumber(event.target.value)}
						placeholder="+7 999 123-45-67"
					/>

					<button type="button" onClick={handleCheck} disabled={isChecking || !phoneNumber.trim()}>
						{isChecking ? 'Проверка...' : 'Проверить'}
					</button>

					{errorMessage && <p>{errorMessage}</p>}
				</div>
			</section>
		</main>
	);
};
