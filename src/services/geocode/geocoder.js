import createHttpError from 'http-errors';

import { nominatimRequest } from './nominatim.js';

// Геокодування: спершу Photon (komoot, на даних OSM, без ключа і без жорсткого ліміту),
// якщо він недоступний — Nominatim. Nominatim часто відповідає 403/429 на IP хмарних
// хостингів (Render), тому лише як запасний варіант.
const PHOTON_URL = 'https://photon.komoot.io';
const HEADERS = {
  'User-Agent': 'GreenWay/1.0 (https://project-greenway-frontend.vercel.app)',
};
// межі України для Photon: minLon,minLat,maxLon,maxLat
const UA_BBOX = '22.1,44.3,40.3,52.4';

const photonRequest = async (path, params) => {
  const url = `${PHOTON_URL}${path}?${new URLSearchParams(params)}`;
  const res = await fetch(url, {
    headers: HEADERS,
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`Photon ${res.status}`);
  return res.json();
};

// «Кострич, Косівська громада, Івано-Франківська область, Україна»
const photonName = ({ name, city, district, county, state, country }) =>
  [name, city ?? district, county, state, country]
    .filter((part, index, parts) => part && parts.indexOf(part) === index)
    .join(', ');

const toPlace = (feature) => ({
  name: photonName(feature.properties),
  lat: feature.geometry.coordinates[1],
  lon: feature.geometry.coordinates[0],
});

export const searchPlacesService = async (q) => {
  try {
    const { features = [] } = await photonRequest('/api/', {
      q,
      limit: 5,
      bbox: UA_BBOX,
    });
    return features
      .filter((feature) => feature.properties?.countrycode === 'UA')
      .map(toPlace);
  } catch {
    const results = await nominatimRequest('/search', {
      q,
      countrycodes: 'ua',
      limit: 5,
    });
    return results.map(({ display_name, lat, lon }) => ({
      name: display_name,
      lat: Number(lat),
      lon: Number(lon),
    }));
  }
};

export const reversePlaceService = async (lat, lon) => {
  try {
    const { features = [] } = await photonRequest('/reverse', {
      lat,
      lon,
      limit: 1,
    });
    return features[0] ? photonName(features[0].properties) : '';
  } catch {
    try {
      const result = await nominatimRequest('/reverse', { lat, lon });
      return result?.display_name ?? '';
    } catch {
      throw createHttpError(502, 'Geocoding service is unavailable');
    }
  }
};
