/**
 * JadeTemplate is a template that renders JADE files.  It's provided
 * as a default for the ghiraldi framework, and is the preferred templating language
 * throughout the framework (many base plugins use jade templates for their views).
 **/

var _ = require('underscore'),
    util = require('util'),
    BaseTemplate = require('./BaseTemplate'),
    ViewEngine = require('./ViewEngine'),
    util = require('util'),
    jade = require('jade'),
    logger = require('ghiraldi-simple-logger');

var JadeTemplate = function(uri) {
    logger.log('trace', 'Inside JadeTemplate with uri ' + uri);
    
    this.cachedTemplateString = "";
    
    this.compileTemplateFunction = jade.compile;
    
    this.uri = uri;
    
    this.extend = {};
    
    this.includes = [];

    this.load(uri);
};

util.inherits(JadeTemplate, BaseTemplate);

module.exports = JadeTemplate;