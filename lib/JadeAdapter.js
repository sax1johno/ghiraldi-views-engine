/**
 * The JadeAdapter is a set of filters that allows a JADE template to extend
 * and include from a view stored in the ghiraldi views engine and plugin 
 * registry.  See the blog post at http://tjholowaychuk.com/post/1180958201/jade-templates-introspection
 * for more information on how this works.
 **/

var _ = require('underscore'),
    util = require('util'),
    logger = require('ghiraldi-simple-logger'),
    jade = require('jade'),
    Parser = jade.Parser;

/**
 * The JadePARSER is an alternative parser for the jade templating system
 * that allows us to modify the standard include and extends to point to the
 * absolute paths pointed to by the Ghiraldi views engine.
 * 
 * We'll do this by creating our own parser that overwrites the resolvePath
 * function to read the template and plugin names.  The parser
 * then uses the ghiraldi views engine to resolve the plugin and template names 
 * into absolute paths to templates, and then delegates the rest to the standard
 * JADE parser.
 **/

/**
 * Constructor just calls the base class.
 * @param str the string to be parsed.
 * @param filename the filename param.
 * @param options the options map.
 **/
function ghParser(str, filename, options) {
    logger.log('trace', '*************************************Called the ghParser');
    Parser.call(this, str, filename, options);
}

// Extends the jade parser.
ghParser.prototype.__proto__ = Parser.prototype;

// override the resolvePath method.
// Replaces the extends and includes paths in a jade template with the
// plugin/template_name syntax.
ghParser.prototype.resolvePath = function(path, purpose) {
    logger.log('trace', '*****************************Inside of the resolvePath method in ghParser');
    var _super = Parser.prototype.resolvePath;
    var pluginName;
    var templateName;
    var plugins = require('ghiraldi-plugin-registry').registry;
    var index = undefined;
    // Absolulte and relative paths will start with '/' or '.'
    if (path[0] !== '/' && path[0] !== '.') {
        // Parse the path.  Should be plugin/viewname
        logger.log('trace', 'In the parser, path = ' + path);
        logger.log('trace', 'path match = ' + path.match('/'));
        if (_.isNull(path.match('/'))) {
            // the base app can omit the plugin name.
            pluginName = 'app';
            templateName = path;
            var pluginPath = plugins.get(pluginName).getView(templateName).uri;
            logger.log('trace', "Would get template " + templateName + " from plugin " + pluginName + " and pluginPath = " + pluginPath);
            return pluginPath;
        } else {
            var pathRegex = /(.*)\/(.+)(\/.*)?/;
            var pathArray = pathRegex.exec(path);
            pluginName = pathArray[1];
            templateName = pathArray[2];
            if(_.size(pathArray) > 2) {
                index = pathArray[3];
            }
            var pluginPath = plugins.get(pluginName).getView(templateName, index).uri;
            logger.log('trace', "Would get template " + templateName + " from plugin " + pluginName + " and pluginPath = " + pluginPath);
            return pluginPath;
        }
    } else {
        // We already have an absolute or relative path, so pass it along.
        logger.log('trace', 'In the parser, path = ' + path);        
        return _super.call(this, path, purpose);
    }
};

module.exports = ghParser;