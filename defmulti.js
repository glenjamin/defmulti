module.exports = defmulti;

function identity(x) { return x; }

function defmulti(dispatchFn) {
    dispatchFn = dispatchFn || identity;
    var methods = makeJsonMap();
    var fallback;
    var multimethod = function MultiFn() {
        var val = methods.get(dispatchFn.apply(this, arguments));
        if (typeof val === 'function') {
            return val.apply(this, arguments);
        }
        if (typeof fallback === 'function') {
            return fallback.apply(this, arguments);
        }
        throw new Error('No matching dispatch value');
    };
    /**
     * method(value, fn) // call fn when dispatch matches value
     * method(fn)        // call fn when dispatch doesn't match
     */
    multimethod.method = function method(value, fn) {
        if (fn === undefined && typeof value === 'function') {
            fallback = value;
        } else {
            methods.set(value, fn);
        }
    };
    return multimethod;
}

function makeJsonMap() {
    var map = {};
    var json = JSON.stringify;
    return {
        get: function(k) { return map[json(k)]; },
        set: function(k, v) { map[json(k)] = v; }
    };

}
