/**
 * This BaseTemplate can be used to store any abstrat type of template.  Templates
 * are compiled using the abstract compileTemplateFunction, which other template
 * engines are encouraged to implement.  New template types can be added
 * via packages with the form ghiraldi-views-engine-* (ie: ghiraldi-views-engine-jade).
 * 
 * The views engine is configured in the ghiraldi variable in the package.json
 * file for this project.
 **/
var _ = require('underscore'),
    fs = require('fs'),
    logger = require('ghiraldi-simple-logger'),
    util = require('util'),
    consolidate = require('consolidate');
    
// Set up the ghiraldi parser.
var ghParser = require('./JadeAdapter');

function Template(uri) {    

    this.cachedTemplateString = "";
    
    this.templateType = null;
    
    this.uri = uri;
    
    this.extend = {};
    
    this.includes = [];

    this.load(uri);
}

/**
 * Loads the file at the URI into the template string and performs the injections
 * of the extends and includes.
 * @param uri an optional uri that can be used to re-load the template with a new file.
 * @param returnFn, a function that fires when the load is complete.
 **/
Template.prototype.load = function(uri, returnFn) {
    logger.log("trace", "in the load function of the template. Args = " + util.inspect(arguments));
    if (!_.isUndefined(uri) && !_.isNull(uri)) {
        this.uri = uri;
    }
    
    // Load up the URI into the cached template string.
    this.cachedTemplateString = fs.readFileSync(this.uri, 'utf8');
    logger.log('trace', 'At the end of the load function.');
    
    if (!_.isUndefined(returnFn) && !_.isNull(returnFn)) {
        returnFn();
    }
};

/**
 * Renders the template with the given locals and calls the return function with
 * the HTML to be rendered.
 * @param locals an object with local variables to pass into the template.
 * @param a function that is called when the render is complete.  The function
 *      takes an err and html parameter.
 **/
Template.prototype.render = function(locals, fn) {
    var compileConfig = {};
    compileConfig.filename = this.uri;
    compileConfig.parser = ghParser;
    if (!_.isUndefined(locals) && !_.isNull(locals)) {
        _.extend(compileConfig, locals);
    }
    
    if (this.cachedTemplateString === '') {
        this.load(this.uri);
    }
    
    if (_.isNull(this.templateType || _.isUndefined(this.templateType))) {
        throw "No compile template function was found.  Please specify a compile template function.";
    }
    
    consolidate[this.templateType].render(this.cachedTemplateString, compileConfig, fn);

    // var compiledTemplate = this.compileTemplateFunction(this.cachedTemplateString, compileConfig);
    // var compiledTemplate2 = compiledTemplate(compileConfig.locals);
    // console.log("Compiled template: " + compiledTemplate + " : " + compiledTemplate2);
};

module.exports = Template;