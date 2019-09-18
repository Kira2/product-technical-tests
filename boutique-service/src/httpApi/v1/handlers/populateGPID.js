/**
 * @license MIT
 * @author Emilie Montredon
 *
 * @module HttpAPI/v1/handlers/PopulateGPID
 * @description Offer an entry point to automatically populate the boutiques with their Google Places ID
 */
import { getGooglePlacesID } from '../../../googleAPIGateway/places';

export default function populateGPID({models}, req, res, next) {

  // search only for boutiques that has no Google Place ID yet
  const Boutique = models.boutique;
  const cursor = Boutique.find({
    $or: [
      { google_places_id: { $exists: false } },
      { google_places_id: '-1' }
    ]
  }).cursor();

  cursor.on('data', (doc) => {
    // Save each of them to trigger the pre-save action defined on the schema.
    // See the file src/schemas/boutique
    doc.save();
  });
}
