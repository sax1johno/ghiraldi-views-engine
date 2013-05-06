var nodeunit = require('nodeunit');
var ViewEngine = require('../lib/ViewEngine');
var Template = require('../lib/BaseTemplate');

exports.viewEngineTest = nodeunit.testCase({
    'testViewEngineConstructor': function(test) {
        var ve = new ViewEngine();
        test.done();
    },
    'testTemplateConstructor': function(test) {
        var t = new Template();
        test.done();
    },
    'testAdd': function(test) {
        var reg = require('../lib/plugin_registry').registry;
        var testPlugin = new Plugin({views: [
                '../test/test',
                '../test/test2'
            ]
        });
        reg.add('t', testPlugin, function(success) {
            test.ok(success, "Registration adding should've succceeded");
            reg.log(function(plugins) {
                console.log(JSON.stringify(plugins));
                test.done();                
            })
        })
    },
    'testAddEvent': function(test) {
        var reg = require('../lib/plugin_registry').registry;
        var testPlugin = new Plugin({
        });
        reg.on('add', function(tag, plugin) {
            console.log("Tag " + tag + " was added with plugin " + JSON.stringify(plugin));
            test.done();
        });
        reg.add('t', testPlugin);
        
    },
    'testRemove': function(test) {
        var reg = require('../lib/plugin_registry').registry;
        var testPlugin = new Plugin({
            
        });
        reg.add('t', testPlugin, function(success) {
            reg.remove('t', function(success) {
                test.ok(success, 'Should have removed the plugin from the registry');
                reg.log(function(plugins) {
                    console.log(JSON.stringify(plugins));
                    test.done();
                });
            });
        });
    },
    'testRemoveEvent': function(test) {
        var reg = require('../lib/plugin_registry').registry;
        var testPlugin = new Plugin({
            
        });
        reg.on('remove', function(plugin) {
            console.log("plugin = " + JSON.stringify(plugin));
            test.done();
        })
        reg.add('t', testPlugin, function(success) {
            reg.remove('t');
        });
    },    
    'testGet': function(test) {
        var reg = require('../lib/plugin_registry').registry;
        var testPlugin = new Plugin({
            
        });
        reg.add('t', testPlugin, function(success) {
            reg.get('t', function(plugin) {
                test.deepEqual(plugin, testPlugin, 'Schemas should be deep equal to each other.');
                reg.log(function(plugins) {
                    console.log(JSON.stringify(plugins));
                    test.done();
                });
            });
        });
    },
    'testKeys': function(test) {
        var reg = require('../lib/plugin_registry').registry;
        var testPlugin = new Plugin({views: ['testview1']});
        var testPlugin2 = new Plugin({});
        var testPlugin3 = new Plugin({});
        
        reg.add('t', testPlugin, function(success) {
            reg.add('t2', testPlugin2, function(success) {
                reg.add('t3', testPlugin3, function(success) {
                    reg.getKeys(function(keys) {
                        var testArray = ['t', 't2', 't3'];
                        test.deepEqual(testArray, keys);
                        test.done();
                    })
                })
            })
        })
    }
});