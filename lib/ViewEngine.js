/**
 * ViewEngine is the base object that all other view engines are based upon.
 * The ViewEngine defines the base functions that are available to all
 * ghiraldi view engines.
 **/

var _ = require('underscore'),
    util = require('util'),
    Template = require('./BaseTemplate'),
    logger = require('ghiraldi-simple-logger'),
    consolidate = require('consolidate');
    
var ViewEngine = function() {
    var views = {};
    
    // Contains a cache of the rendered views.  This eliminates the need for re-building the views
    // on every call.
    var viewCache = {};
    
    this.TemplateType = null;
    
    var that = this;
    
    /** 
     * Get a view from the viewCache. Optionally, the cached item can be rebuilt.
     * @param viewName the name of the view to be retrieved.
     * @param args (optional) an object of arguments with the following format (all are optional)
     *      {
     *          recache: true          // True if the cached item should be re-rendered. Can be turned off for static pages and other rarely changing content.
     *          locals: {               // A object containing local variables to be replaced in the template.
     *              key: replacement
     *          }
     *      }
     * @param fn a function that contains the html of the rendered template or an error.
     **/
    this.getView = function(viewName, args, fn) {
        args = args || {};
        logger.log('trace', 'Inside of getView in the view engine: ' + viewName);
        logger.log('trace', util.inspect(views[viewName]));
        if (!_.isUndefined(views[viewName]) && !_.isNull(views[viewName])) {
            logger.log('trace', "Template exists in views");
            if (!_.isUndefined(viewCache[viewName]) 
                    && !_.isNull(viewCache[viewName])) {
                logger.log('trace', util.inspect(viewCache[viewName]));
                return viewCache[viewName];
            } else {
                if (_.isNull(that.TemplateType)) {
                    throw "Please define a template type: No template type class was specified.";
                }
                views[viewName].render(args, fn);
                // return views[viewName].render(locals);
                
             // function(err, html) {
             //        if (!err) {
             //            logger.log('trace', 'Html = ' + html); 
             //            if (!_.isUndefined(fn) && !_.isNull(fn) && _.isFunction(fn)) {
             //                fn(html);
             //            }
             //        } else throw err;
             //    });
            }
        } else {
            throw "No view found with name " + viewName;
        }
    };
    
    this.getViews = function() {
        return views;
    };
    
    this.setView = function(viewName, view) {
        logger.log('trace', 'in setView, template = ' + viewName + ': ' + view);
        logger.log('trace', 'that.templateType = ' + that.TemplateType);
        // logger.log('trace', 'in setView, template = ' + util.inspect(new that.TemplateType(view)));
        views[viewName] = new Template(view);
        views[viewName].templateType = that.TemplateType;
        logger.log('trace', 'In setView, Set view ' + viewName + ' to ' + util.inspect(views[viewName]));
    };
    
    this.setViews = function(pViews) {
        _.each(pViews, function(value, key, list) {
            that.setView(key, value);
        });
    };
    
};

module.exports = ViewEngine;