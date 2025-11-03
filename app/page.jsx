'use client';

import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import SearchForm from '@/components/search/SearchForm';
import TourDetail from '@/components/tours/TourDetail';
import TourList from '@/components/tours/TourList';
import {
	getHotels,
	getSearchPrices,
	startSearchPrices,
	stopSearchPrices,
} from '@/services/api';
import { useEffect, useRef, useState } from 'react';

const MAX_RETRIES = 2;

export default function App() {
	const [selectedDestination, setSelectedDestination] = useState(null);
	const [searchState, setSearchState] = useState({
		status: 'idle',
		error: null,
	});
	const [tours, setTours] = useState([]);
	const [hotels, setHotels] = useState({});
	const [selectedTour, setSelectedTour] = useState(null);
	const [activeToken, setActiveToken] = useState(null);
	const [retryCount, setRetryCount] = useState(0);
	const timeoutRef = useRef(null);

	const clearSearch = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	};

	const pollSearchResults = async (token, attempt = 0) => {
		try {
			const response = await getSearchPrices(token);
			const data = await response.json();

			const toursArray = Object.values(data.prices).sort(
				(a, b) => a.amount - b.amount
			);
			setTours(toursArray);

			const countryId =
				selectedDestination.type === 'country' ? selectedDestination.id : null;
			if (countryId) {
				const hotelsRes = await getHotels(countryId);
				const hotelsData = await hotelsRes.json();
				setHotels(hotelsData);
			}

			setSearchState({ status: 'success', error: null });
			setActiveToken(null);
			setRetryCount(0);
		} catch (err) {
			const errorData = await err.json();

			if (errorData.code === 425) {
				const waitTime = new Date(errorData.waitUntil).getTime() - Date.now();
				timeoutRef.current = setTimeout(() => {
					pollSearchResults(token, attempt);
				}, Math.max(waitTime, 0));
			} else if (attempt < MAX_RETRIES) {
				setRetryCount(attempt + 1);
				timeoutRef.current = setTimeout(() => {
					pollSearchResults(token, attempt + 1);
				}, 1000);
			} else {
				setSearchState({
					status: 'error',
					error: errorData.message || 'Помилка пошуку',
				});
				setActiveToken(null);
				setRetryCount(0);
			}
		}
	};

	const handleSearch = async () => {
		if (!selectedDestination) return;

		if (activeToken) {
			try {
				await stopSearchPrices(activeToken);
			} catch (err) {
				console.error('Failed to stop search:', err);
			}
			clearSearch();
		}

		setSearchState({ status: 'loading', error: null });
		setTours([]);
		setRetryCount(0);

		const countryId =
			selectedDestination.type === 'country'
				? selectedDestination.id
				: selectedDestination.countryId;

		try {
			const response = await startSearchPrices(countryId);
			const data = await response.json();

			setActiveToken(data.token);

			const waitTime = new Date(data.waitUntil).getTime() - Date.now();
			timeoutRef.current = setTimeout(() => {
				pollSearchResults(data.token);
			}, Math.max(waitTime, 0));
		} catch (err) {
			const errorData = await err.json();
			setSearchState({
				status: 'error',
				error: errorData.message || 'Помилка запуску пошуку',
			});
			setActiveToken(null);
		}
	};

	useEffect(() => {
		return () => clearSearch();
	}, []);

	if (selectedTour) {
		return (
			<TourDetail
				priceId={selectedTour.priceId}
				hotelId={selectedTour.hotelId}
				onBack={() => setSelectedTour(null)}
			/>
		);
	}

	const renderSearchResults = () => {
		switch (searchState.status) {
			case 'loading':
				return (
					<LoadingSpinner
						message='Шукаємо тури для вас...'
						retryCount={retryCount}
						maxRetries={MAX_RETRIES}
					/>
				);

			case 'error':
				return (
					<ErrorMessage
						title='Помилка пошуку'
						message={searchState.error}
						onRetry={handleSearch}
					/>
				);

			case 'success':
				return (
					<TourList
						tours={tours}
						hotels={hotels}
						onTourSelect={setSelectedTour}
					/>
				);

			default:
				return null;
		}
	};

	return (
		<>
			<SearchForm
				selectedDestination={selectedDestination}
				onDestinationChange={setSelectedDestination}
				onSearch={handleSearch}
				isLoading={searchState.status === 'loading'}
			/>

			{renderSearchResults()}
		</>
	);
}
