/**
 * @license MIT
 * @author Emilie Montredon
 *
 * @module IntegrationTests/GoogleAPIGateway/GetGooglePlacesID
 * @description Exports some functions used to communicate with the Google API
 */
import { assert, expect } from 'chai';
import { getGooglePlacesID } from '../../../src/googleAPIGateway/places'

describe('Integration tests > googleAPIGateway > getGooglePlacesID', function() {

  it('should return the places id', (done) => {
    const checks = [];

    const boutiques = [
      { lat: 51.7079581, lon: -1.5531104, name: 'homeArama', places_id: 'ChIJDa8hZSQ1cUgR0aHi08Ja4cw' },
      { lat: 51.2804541, lon: 1.0800823, name: 'The Living Lounge', places_id: 'ChIJF3dgbbXL3kcRSY08H7gtSnU' },
      { lat: 51.5485892, lon: 0.0251521, name: 'items of note', places_id: -1 },
      { lat: 51.5350305, lon: -0.1035636, name: 'Victoria Beau', places_id: 'ChIJn8s_bl0bdkgRu8EL_Qb6AQo' },
      { lat: 51.5350305, lon: -0.1035636, name: 'Unknown for very sure!', places_id: -1 }
    ];

    for (let i = 0; i < boutiques.length; i++) {
      let boutique = boutiques[i];

      checks.push(
        getGooglePlacesID(boutique.name, boutique.lat, boutique.lon).then((placesId) => {
          expect(placesId).to.equal(boutique.places_id);

        }).catch((error) => {
          assert.fail(boutique.name + ' - ' + error);
        })
      );
    }

    Promise.all(checks).catch((error) => {
      assert.fail(error);

    }).finally(() => {
      done();
    });
  });
});
