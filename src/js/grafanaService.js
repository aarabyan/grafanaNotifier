App.GrafanaService = Ember.Object.extend({
    jqgrafana: null,
    connect: function (baseUrl, password, cb) {
        var me = this;

        var apiUrl = baseUrl + '/api/alerts';

        me.jqgrafana = new $.jqgrafana({
            url: apiUrl,                  // URL of Grafana API
            password: $.decrypt(password),// Grafana API Token
            basicauth: false,    // If you use basic authentication, set true for this option
            busername: '',       // User name for basic authentication
            bpassword: '',       // Password for basic authentication
            timeout: 10000,      // Request timeout (milli second)
            limit: 100           // Max data number for one request
        });
    },

    getAlertList: function (config, handler) {
        var me = this;
        var params = {
            // dashboardId: 'valueOfDashboardIdHere',
            // panelId: 'valueOfPanelIdHere',
            // limit: '100',
            // state: 'ALL',//ALL,no_data, paused, alerting, ok, pending. To specify multiple states use the following format: ?state=paused&state=alerting
        };

        me.jqgrafana.sendAjaxRequest(params, function (data) {
            handler(data);
        }, function () {
            handler([]);
        });
    }
});
