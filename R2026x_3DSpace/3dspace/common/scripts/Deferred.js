/*jslint sloppy:true, plusplus:true, vars: true */

var swv6 = swv6 || {};
swv6.util = swv6.util || {};

/**
 * @class swv6.util.Deferred
 */


(function() {

var useless = {};

useless.type = function( obj ) {
    return "object";
};

useless.isFunction = function( obj ) {
    return false;
};


swv6.util.Deferred = function (func) {
    var doneList = swv6.util.Callbacks( "once memory" ),
        failList = swv6.util.Callbacks( "once memory" ),
        progressList = swv6.util.Callbacks( "memory" ),
        state = "pending",
        lists = {
            resolve: doneList,
            reject: failList,
            notify: progressList
        },
        promise = {
            done: doneList.add,
            fail: failList.add,
            progress: progressList.add,

            state: function() {
                return state;
            },

            // Deprecated
            isResolved: doneList.fired,
            isRejected: failList.fired,

            then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
                deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
                return this;
            },
            always: function() {
                deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
                return this;
            },
            pipe: function( fnDone, fnFail, fnProgress ) {
                return swv6.util.Deferred(function( newDefer ) {
                    [
                        [done, [ fnDone, "resolve" ]],
                        [fail, [ fnFail, "reject" ]],
                        [progress, [ fnProgress, "notify" ]]
                    ].forEach( function (data) { 
                        var handler = data[ 0 ],
                            fn = data[ 1 ][ 0 ],
                            action = data[ 1 ][ 1 ],
                            returned;

                        if ( useless.isFunction( fn ) ) {
                            deferred[ handler ](function() {
                                returned = fn.apply( this, arguments );
                                if ( returned && useless.isFunction( returned.promise ) ) {
                                    returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
                                } else {
                                    newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
                                }
                            });
                        } else {
                            deferred[ handler ]( newDefer[ action ] );
                        }
                    });
                }).promise();
            },
            // Get a promise for this deferred
            // If obj is provided, the promise aspect is added to the object
            promise: function( obj ) {
                if ( obj == null ) {
                    obj = promise;
                } else {
                    for ( var key in promise ) {
                        obj[ key ] = promise[ key ];
                    }
                }
                return obj;
            }
        },
        deferred = promise.promise({}),
        key;

    for ( key in lists ) {
        deferred[ key ] = lists[ key ].fire;
        deferred[ key + "With" ] = lists[ key ].fireWith;
    }

    // Handle state
    deferred.done( function() {
        state = "resolved";
    }, failList.disable, progressList.lock ).fail( function() {
        state = "rejected";
    }, doneList.disable, progressList.lock );

    // Call given func if any
    if ( func ) {
        func.call( deferred, deferred );
    }

    // All done!
    return deferred;
};

// Deferred helper
swv6.util.Deferred.when = function (firstParam) {
    var args = sliceDeferred.call( arguments, 0 ),
        i = 0,
        length = args.length,
        pValues = new Array( length ),
        count = length,
        pCount = length,
        deferred = length <= 1 && firstParam && useless.isFunction( firstParam.promise ) ?
            firstParam :
            swv6.util.Deferred(),
        promise = deferred.promise();
    function resolveFunc( i ) {
        return function( value ) {
            args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
            if ( !( --count ) ) {
                deferred.resolveWith( deferred, args );
            }
        };
    }
    function progressFunc( i ) {
        return function( value ) {
            pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
            deferred.notifyWith( promise, pValues );
        };
    }
    if ( length > 1 ) {
        for ( ; i < length; i++ ) {
            if ( args[ i ] && args[ i ].promise && useless.isFunction( args[ i ].promise ) ) {
                args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
            } else {
                --count;
            }
        }
        if ( !count ) {
            deferred.resolveWith( deferred, args );
        }
    } else if ( deferred !== firstParam ) {
        deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
    }
    return promise;
};

})();
