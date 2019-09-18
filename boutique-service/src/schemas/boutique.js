import mongoose from 'mongoose';
import { getGooglePlacesID } from '../googleAPIGateway/places';

export default function boutiqueSchema() {

  const BOUTIQUE_SCHEMA = {
    name: mongoose.Schema.Types.String,
    slug: mongoose.Schema.Types.String,
    location: {
      lon: mongoose.Schema.Types.Number,
      lat: mongoose.Schema.Types.Number
    },
    description: mongoose.Schema.Types.String,
    google_places_id: mongoose.Schema.Types.String,
  };

  // Add a middleware called by Mongoose each time that a Boutique is created
  //  or updated. It automatically updates its Google Places ID
  let schema = new mongoose.Schema(BOUTIQUE_SCHEMA);

  schema.pre('save', function(next) {

    getGooglePlacesID(this.name, this.location.lat, this.location.lon).then((result) => {
      // do not erase any populated if it returns -1 (it can be temporary)
      if (result !== -1) {
        this.set('google_places_id', result);
      }
      next();

    }).catch(() => {
      // continue to save the Boutique anyway, but it should be interesting in that case
      //  to automatically send a Bugreport to the team, to let it know that something
      //  went wrong during the update of a Boutique.
      next();
    });
  });

  return schema;
}
