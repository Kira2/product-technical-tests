/**
 * @license MIT
 * @author Emilie Montredon
 *
 * @module HttpAPI/v1/handlers/PopulateGPID
 * @description Offer an entry point to automatically populate the boutiques with their Google Places ID
 */
import { getGooglePlacesID } from '../../../googleAPIGateway/places';

export default function populateGPID({models}, req, res, next) {

  let updates = []; // to store all the running the update operations
  let hasError = false; // if at least one update fails

  // search only for boutiques that has no Google Place ID yet
  const Boutique = models.boutique;
  const cursor = Boutique.find({
    $or: [
      { google_places_id: { $exists: false } },
      { google_places_id: '-1' }
    ]
  }).cursor();

  // for each boutique...
  cursor.on('data', (doc) => {

    updates.push(
      // ...search for its Google Places ID
      getGooglePlacesID(doc.name, doc.location.lat, doc.location.lon).then((result) => {
        doc.set('google_places_id', result);
        doc.save();

      // save the fact that at least one error occurred, but keep going for the other boutique
      }).catch(() => {
        hasError = true;
      })
    );
  });

  // wait for all the updates to be completed
  Promise.all(updates).then(() => {
    if (hasError) {
      res.status(500).send();

    } else {
      res.status(200).send();
    }

  }).catch(() => {
    res.status(500).send();
  });
}
