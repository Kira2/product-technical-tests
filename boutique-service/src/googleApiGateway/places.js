/**
 * @license MIT
 * @author Emilie Montredon
 *
 * @module GoogleAPIGateway/Places
 * @description Exports some functions used to communicate with the Google API
 */
import https from 'https';

const GOOGLE_MAP_API_URL = 'https://maps.googleapis.com/maps/api';
const GOOGLE_API_KEY =  process.env.GOOGLE_API_KEY || 'YOUR_GOOGLE_API_KEY_HERE';

/**
 * @function getGooglePlacesID
 * @description Get the Google Places ID of a given boutique
 * @param {string} name The name of the boutique
 * @param {number} lat The latitude of the boutique
 * @param {number} lon The longitude of the boutique
 * @return {Promise} A Promise that is full-filled with the response of the request
 */
export const getGooglePlacesID = (name, lat, lon) => {

  return new Promise((resolve, reject) => {

    const locationParam = `location=${lat},${lon}`;
    const nameParam = `name=${encodeURIComponent(name)}`;
    const radiusParam = `radius=500`;
    const keyParam = `key=${GOOGLE_API_KEY}`;

    const GOOGLE_PLACES_ID_URL = `${GOOGLE_MAP_API_URL}/place/nearbysearch/json?${locationParam}&${nameParam}&${radiusParam}&${keyParam}`;

    https.get(GOOGLE_PLACES_ID_URL, (response) => {
      response.setEncoding('utf8');
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const jsonData = JSON.parse(data);

          if (jsonData && jsonData.results && (jsonData.results.length === 1)) {
            resolve(jsonData.results[0].place_id);

          } else {
            resolve(-1);
          }

        } catch (error) {
          reject(error);
        }
      });

    }).on('error', (error) => {
      reject(error);
    });
  });
}
