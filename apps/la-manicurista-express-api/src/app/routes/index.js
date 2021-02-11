var routers = require('express').Router(),
  typeaheadRoutes = require('./typeahead.routes');

routers.use(typeaheadRoutes);

module.exports = routers;
