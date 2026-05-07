'use client';

import { useEffect, useRef, useState } from 'react';
import type { BirthData } from '@/lib/types';

interface Props {
  onSubmit: (data: BirthData) => void;
  loading: boolean;
}

interface CityResult {
  display_name: string;
  lat: string;
  lon: string;
  timezone?: string;
}

export default function BirthForm({ onSubmit, loading }: Props) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const [cityQuery, setCityQuery] = useState('');
  const [cityResults, setCityResults] = useState<CityResult[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityResult | null>(null);

  const [searching, setSearching] = useState(false);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (cityQuery.length < 3 || selectedCity) return;

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      setSearching(true);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            cityQuery
          )}&format=json&limit=5&featuretype=city`,
          {
            headers: {
              'Accept-Language': 'en',
            },
          }
        );

        const data = (await res.json()) as CityResult[];
        setCityResults(data.slice(0, 5));
      } catch {
        setCityResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [cityQuery, selectedCity]);


async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!selectedCity) return;

  const lat = parseFloat(selectedCity.lat);
  const lng = parseFloat(selectedCity.lon);

  onSubmit({
    name: name.trim(),
    date,
    time,
    lat,
    lng,
    timezone: '',
    placeName: selectedCity.display_name
      .split(',')
      .slice(0, 2)
      .join(','),
  });
}

  const isReady =
    name.trim() !== '' &&
    date !== '' &&
    time !== '' &&
    selectedCity !== null;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      <div>
        <label className="mb-2 block text-sm text-white/70">
          First Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-pink-500"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-white/70">
          Date of Birth
        </label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-pink-500"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-white/70">
          Exact Birth Time
        </label>

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-pink-500"
          required
        />
      </div>

      <div className="relative">
        <label className="mb-2 block text-sm text-white/70">
          Birth City
        </label>

        <input
          type="text"
          value={
            selectedCity
              ? selectedCity.display_name
              : cityQuery
          }
          onChange={(e) => {
            setSelectedCity(null);
            setCityQuery(e.target.value);
          }}
          placeholder="Search city..."
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-pink-500"
          required
        />

        {searching && (
          <p className="mt-2 text-xs text-white/50">
            Searching...
          </p>
        )}

        {!selectedCity && cityResults.length > 0 && (
          <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#111118] shadow-2xl">
            {cityResults.map((city, index) => (
              <button
                key={`${city.display_name}-${index}`}
                type="button"
                onClick={() => {
                  setSelectedCity(city);
                  setCityResults([]);
                  setCityQuery(city.display_name);
                }}
                className="block w-full border-b border-white/5 px-4 py-3 text-left text-sm text-white/80 hover:bg-white/5"
              >
                {city.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!isReady || loading}
        className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Generating Reading...' : 'Read My Chart'}
      </button>
    </form>
  );
}