import createHttpError from 'http-errors';

// Nominatim (OpenStreetMap): без ключа, але обов'язковий User-Agent і ≤ 1 запит/сек.
const BASE_URL = 'https://nominatim.openstreetmap.org';
const HEADERS = {
  'User-Agent': 'GreenWay/1.0 (https://project-greenway-frontend.vercel.app)',
  'Accept-Language': 'uk',
};

export const nominatimRequest = async (path, params) => {
  const url = `${BASE_URL}${path}?${new URLSearchParams({ format: 'jsonv2', ...params })}`;

  let res;
  try {
    res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw createHttpError(502, 'Geocoding service is unavailable');
  }
  if (!res.ok) throw createHttpError(502, 'Geocoding service is unavailable');

  return res.json();
};
