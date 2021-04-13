(function($){

$.jqgrafana = function(options) {

// initialize options
options = $.extend({
    // default settings
    url: 'http://localhost/grafana/api/alerts',
    password: 'grafana',
    basicauth: false,
    busername: '',
    bpassword: '',
    timeout: 10000,
    limit: 100
}, options);

// initialize variables
var rpcid = 0;
var errormsg = null;


function createAjaxOption(params, success, error, complete) {

    // create AJAX option
    var ajaxOption = {
        contentType: 'application/json',
        type: 'GET',
        cache: false,
        processData: false,
        timeout: options.timeout,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods":"GET,HEAD,OPTIONS,POST,PUT, DELETE",
            "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"   
            
        },
        url: options.url,
        success: function(response, status) {
            // resuest error
            if (response === null) {
                errormsg = {
                    data: 'Network error'
                };
                if (typeof error === 'function') {
                    error();
                }
            }
            else if ('error' in response) {
                errormsg = response.error;
                if (typeof error === 'function') {
                    error();
                }
            }
            // resuest success
            else {

                // clear error message
                errormsg = null;

                // do success function
                if (typeof success === 'function') {
                    success(response, status);
                }
            }
        },
        error: function(response, status) {
            if (status === 'timeout') {
                errormsg = 'Network timeout';
            }
            else if (response.status && response.statusText) {
                errormsg = status + ' : ' + response.status + ' ' + response.statusText;
            }
            else {
                errormsg = 'Unknown error';
            }

            if (errormsg && typeof error === 'function') {
                error();
            }
        },
        complete: function() {

            if (typeof complete === 'function') {
                complete();
            }
        }
    };

    ajaxOption.beforeSend = function (xhr) {
        // if use http basic authentication
        if (options.basicauth === true) {
            var base64 = base64encode(options.busername + ':' + options.bpassword);
            xhr.setRequestHeader("Authorization", "Basic " + base64);
        } else {
            xhr.setRequestHeader("Authorization", "Bearer " + options.password);
        }
    };

    return ajaxOption;
}

function base64encode(string) {

    var base64list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var t = '', p = -6, a = 0, i = 0, v = 0, c;

    while ( (i < string.length) || (p > -6) ) {
        if ( p < 0 ) {
            if ( i < string.length ) {
            c = string.charCodeAt(i++);
            v += 8;
            } else {
                c = 0;
            }
            a = ((a&255)<<8)|(c&255);
            p += 8;
        }
        t += base64list.charAt( ( v > 0 )? (a>>p)&63 : 64 );
        p -= 6;
        v -= 6;
    }
    return t;
}

this.init = function() {
    rpcid = 0;
    errormsg = null;

    return true;
}

this.sendAjaxRequest = function(params, success, error, complete) {

    return $.ajax(createAjaxOption(params, success, error, complete));
}


} // end plugin
})(window.jQuery);