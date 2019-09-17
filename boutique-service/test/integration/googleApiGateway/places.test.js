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
      // only one place returned by Google
      { lat: 52.6259755, lon: 1.2957945, name: 'Design House Norwich', places_id: 'ChIJfzmX1eXj2UcR50jtG-LIurQ' },
      // no place returned by Google
      { lat: 51.5612228, lon: -0.0735762, name: 'Rouge', places_id: -1 },
      // several places returned by Google, with at least one that matches
      { lat: 51.5825519, lon: -0.0131045, name: 'Debbie Bliss Home', places_id: 'ChIJJcINwu0ddkgRcSfNzYzmxUk' },
      // several places returned by Google, but no one that seems to match the boutique
      { lat: 51.5205427, lon: -0.1531023, name: 'Lewis & Co.', places_id: -1 },
      // not typed as a store
      { lat: 55.825523, lon: -4.2682883, name: 'Whitespace Kids', places_id: 'ChIJd8b2fvlGiEgRSvyBpP8jXtY' },
      // unknown
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
