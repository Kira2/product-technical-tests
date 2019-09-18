# Trouva Product Technical Tests

## Challenges

Thank you for sending me this technical test. Here's a reminder of what I had to do:

1. Populate all existing boutiques in the database with their Google Places ID
2. Whenever a new boutique is create or updated, you need to retrieve and store the Google Places ID
3. Return the Google Places ID as part of the API response

I will explain what I did for each of these deliverables. Feel free to contact me if you need more information.

## Requirements

I created my own Google API Key for this. I imported it as an environement variable via the file ```docker-compose.yml```. It is necessary to run the code and the integration tests ```boutique-service/test/integration/googleApiGateway/places.test.js```.

So, you will need to use yours instead.

### Return the Google Places ID as part of the API response

This is the first thing that I did, simply by adding the field "google_places_id" into the schema defined for Mongoose. File : ```boutique-service/src/schemas/boutique.js```.

From there, as soon as the Google Placed IDs would be populated, this value would be included into the result returned by the requests made on http://localhost:3050/v1/boutiques.

### Populate all existing boutiques in the database with their Google Places ID

This part was the opportunity to learn more about the Google API, and check all the cases that could be encountered. I noticed several things that push me to improve a little bit the example given by Google at the URL https://developers.google.com/places/place-id. Indeed, they just get the first item of the returned Google Places, but in some cases, this is not the right result.

Let see the logic behind the code of the file ```boutique-service/src/googleApiGateway/places.js```.

#### Case n°1

There is only one result returned by Google, so we keep it as the good result.

#### Case n°2

There are several results returned by Google. In this case, the first one is not necessary the good one. To try to detect the good one, I browse the result and I compare the name stored by Trouva and the name stored by Google. If this is a perfect match, I have my result. "Debbie Bliss Home" and "Hill & Friends" are some examples of this case.

But this is not perfect, because the comparison between the two names requires a perfect match. So, if the name is very slightly different on google because shortened, or with an acronym, the good result is not detected. I guess that this point could be improved. "Wonderound" and "Rachel Usher" are some examples of this case.

#### Case n°3

You will notice that I did not add the parameter ```type=store```into the request sent to Google, as some boutiques referenced by Trouva have not this keywords into their types' list on Google. "Posh Totty Designs" and "Whitespace Kids" are some examples of this case.

#### Result

In the end, I was able to add a new route to the API ```http://localhost:3050/v1/boutiques/populateGPID``` to be able to populate all the Google Places ID of the existing boutiques. Only 73 boutiques out of 446 have not their Google Places ID.

You'll see into the next part that the new Middleware on Mongoose allowed me to simplify the associated code. See the commit 

### Whenever a new boutique is create or updated, you need to retrieve and store the Google Places ID

To do that, I decided to use the Middleware supplied by Mongoose. File : ```boutique-service/src/schemas/boutique.js```.

It allow to trigger some actions each time that an operation is done on a document. I just wrote a middleware for the 'save' operation as a Proof Of Concept, but, according to the way in which the creation and saving operations of the boutiques are written, it could be necessary to add a specific Middleware for the 'update' operations. Like this:

```
schema.pre('update', function() {
  // populate the Google Places ID here
});
```

You will see that I decided to not update the value if the returned value is -1. It is to avoid to erase an information about the Google Places ID if this is due to another thing than juste an inexistant Google Places ID. This part of code can be improved by detecting all cases to set the value to -1 only if it is really relevant to an inexistant Google Places ID.

I also specified into the comments of the middleware, that in case of failure to get the Google Places ID, the operation to save the boutique can continue. However, there should be a bugreport system to notify the team that something went wrnong, and make the needed actions to correct it.

After writing this Middleware, I could simplified the file ```boutique-service/src/httpApi/v1/handlers/populateGPID.js```to just use this mechanisme to automatially update all the boutiques without any Google Places ID, by visiting the url http://localhost:3050/v1/boutiques/populateGPID.
