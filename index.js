const Datastore = require('@google-cloud/datastore');


exports.subscribe = (event, callback) => {
  // The Cloud Pub/Sub Message object.
  const pubsubMessage = event.data;
  const pubsubContext = event.context;

  // We're just going to log the message to prove that
  // it worked.
  console.log(Buffer.from(pubsubMessage.data, 'base64').toString());
  var data = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());

  // Your Google Cloud Platform project ID
  const projectId = 'environmentmonitor-10770';

  // Creates a client
  const datastore = new Datastore({
    projectId: projectId,
  });
  
  const kind = 'Alerts';
  var alertType
  var logKey
  if(data.temperature > 80) {
    // temperature alert
    alertType = "temperature"
    logKey = datastore.key([kind, alertType]);
    const query = datastore.createQuery(kind);
    datastore.runQuery(query, function(err, entities) {
      // entities = An array of records.

      // Access the Key object for an entity.
      const firstEntityKey = entities[0][datastore.KEY];
    });
    
  }else if(data.humidity < 50) {
    alertType = "humidity"
    logKey = datastore.key([kind, alertType]);
    
  } else {
    // no alert
    callback();
  }
  
  // Prepares the new entity
  const alertLog = {
    key: logKey,
    data: {
      time: Date.now(),
    },
  };

  // Saves the entity
  datastore
    .save(alertLog)
    .then(() => {
      console.log(`Saved ${alertLog.key.name}: ${alertLog.data.description}`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  
  callback();
};


