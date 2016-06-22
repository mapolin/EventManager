;(function(window) {

    function EventManager() {
        // collection of all events added to the instance
        this.events = {};

        /* 
            Add an event to the manager instance
            
            @condition [String] - name of event condition (example: 'esc')
            @callback [Function]
            @name [String] - name that indetifies the callback (example: 'close-modal'), used when removing a callback
            
            @return EventManger instance
        */
        this.on = function(condition, callback, name) {
            if(!_.isArray(this.events[condition])) {
                this.events[condition] = [];
            }

            if(name) {
                var existing = _.find(this.events[condition], {name: name});
                if(existing) {
                    _.each(existing, function(item) {
                        item.callback = callback;
                    });
                } else {
                    this.events[condition].push({
                        name: name,
                        callback: callback
                    });
                }
            } else {
                this.events[condition].push({
                    name: name || _.uniqueId('callback-' + condition + '-'),
                    callback: callback
                });
            }

            return this;
        };

        /* 
            Remove an event from the collection
            
            @condition [String] - name of the event condition
            @name [String] - the name indetifying the callback we want to remove
            @force [Boolean] - if 'true' will be remove all callbacks matching @condition

            @return EventManger instance
        */
        this.off = function(condition, name, force) {
            if(!condition) {
                console.warn('Please provide an event to remove callbacks for.');
                return this;
            }
            if(!name && !force) {
                console.warn('You\'re trying to a callback without a name for ' + condition + '. If this is not a mistake, please use @force .off(condition, name, force)');
                return this;
            }

            if(name === true && _.isNil(force) || _.isNil(name) && force === true) {
                this.events[condition] = [];
            }

            if(_.isString(name)) {
                _.remove(this.events[condition], function(item) {
                    return item.name == name;
                });
            }

            return this;
        };

        /* 
            Invoke a collection of callbacks
            
            @condition [String] - name of the event condition
            @event [Event] - the original event passed to the listener (will be forwarded to the callback)
            @name [? String] - the indentifier of the callback to invoke
            @scope [? Boolean] - scope to bind the callback to

            @return EventManger instance
        */
        this.invoke = function(condition, event, name, scope) {
            if(!condition) {
                console.warn('Please provide an event to invoke callbacks for.');
                return this;
            }

            if(_.isNil(scope)) {
                scope = window;
            }

            _.each(this.events[condition], function(item) {
                if(_.isString(name)) {
                    if(item.name == name) {
                        _.bind(item.callback, scope, event)();
                    }
                } else {
                    _.bind(item.callback, scope, event)();
                }
            });

            return this;
        };

        return this;
    };

    // expose to global scope
    window.EventManager = EventManager;

})(window)