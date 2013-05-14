/**
 * The ViewEngine stores and retrieves views from a central registry.  The views
 * can then be retrieved and modified.
 * 
 * Multiple views can be stored with the same viewName.  If there are multiples,
 * then the most recent is returned unless an index is specified.  This allows
 * multiple plugins to override the same views without losing the original
 * (which is handy for view composition.  ie: creating an admin layout that 
 * derives from earlier admin layouts).
 **/

var _ = require('underscore'),
    util = require('util'),
    Template = require('./BaseTemplate'),
    logger = require('ghiraldi-simple-logger'),
    consolidate = require('consolidate');

// Set up the ghiraldi parser.
var ghJade = require('./JadeAdapter');
    
var ViewEngine = function() {
    var views = {};
    
    // Contains a cache of the rendered views.  This eliminates the need for re-building the views
    // on every call.
    var viewCache = {};
    
    this.TemplateType = null;
    
    var that = this;
    
    /** 
     * Get a view with the specified viewName.  If an index is provided,
     * get the view under that viewName stack with the specified index.  Otherwise,
     * just return the top one.
     **/
    this.getView = function(viewName, index) {
        if (!index) {
            return views[viewName][0];
        }
        return views[viewName][index];
    };
    
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
    this.render = function(viewName, args, fn) {
        args = args || {};
        if (!_.isUndefined(views[viewName]) && !_.isNull(views[viewName])) {
            if (!_.isUndefined(viewCache[viewName]) 
                    && !_.isNull(viewCache[viewName])) {
                return viewCache[viewName];
            } else {
                if (_.isNull(that.TemplateType)) {
                    throw "Please define a template type: No template type class was specified.";
                }
                if (args.index) {
                    views[viewName][args.index].render(args, fn);                    
                } else {
                    views[viewName][0].render(args, fn);
                }
            }
        } else {
            throw "No view found with name " + viewName;
        }
    };
    
    this.getViews = function() {
        return views;
    };
    
    this.setView = function(viewName, view) {
        var newView = new Template(view);
        newView.templateType = that.TemplateType;        
        if (_.isUndefined(views[viewName])) {
            views[viewName] = [];
        }
        views[viewName].unshift(newView);
    };
    
    this.setViews = function(pViews) {
        _.each(pViews, function(value, key, list) {
            that.setView(key, value);
        });
    };
    
};

module.exports = ViewEngine;