'use strict';

module.exports = function (apiConfig) {
    // move to routes
    const route = {};

    route.uris = apiConfig.api.uris;
    route.strip_uri = apiConfig.api.strip_uri;
    route.preserve_host = apiConfig.api.preserve_host;
    route.plugins = apiConfig.plugins;

    apiConfig.api.routes = [ route ];

    delete apiConfig.api.uris;
    delete apiConfig.api.strip_uri;
    delete apiConfig.api.preserve_host;
    delete apiConfig.plugins;

    return apiConfig;
};