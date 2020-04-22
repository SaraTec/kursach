const config = {
  mongodb: {
    url: 'mongodb+srv://Taras:20081999@boichuk-gt3rn.mongodb.net/',
    databaseName: 'defibrillatorDB',
    options: {
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
    }
  },

  migrationsDir: './migrations/adminMigration/migration',

  changelogCollectionName: 'changelog'
};

module.exports = config;
