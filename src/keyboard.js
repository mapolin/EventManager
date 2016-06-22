;(function(window) {

    function Keyboard() {
        this._keys = {
            27: 'esc',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        this.handleKey = function(event) {
            if(this._keys[event.keyCode]) {
                this.eventManager.invoke(this._keys[event.keyCode], event)
            }
        };

        this.on = function(event, callback, name) {
            if(event && callback) {
                this.eventManager.on(event.toLowerCase(), callback, name);
            }
        };

        this.off = function(event, name, force) {
            this.eventManager.off(event, name, force);
        };

        this.eventManager = new EventManager();

        document.addEventListener('keyup', _.bind(this.handleKey, this));
    };

    // expose to global scope
    window.Keyboard = Keyboard;

})(window)