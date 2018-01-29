function listNotContainsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].id === obj.id) {
            return false;
        }
    }
    return true;
}

App.GrafanaStatus = Ember.Object.extend({

    PRIORITIES: {
        'not_connected': -1,
        'ok': 0,
        'paused': 1,
        'pending': 2,
        'no_data': 3,
        'alerting': 4
    },

    init: function () {
        var me = this;
        var config = $.getLocalConfig();

        me.set('alertList', []);
        me.set('state', 'not_connected');
        me.set('notifyUser', []);
        me.set('alreadyNotified', []);
    },

    /**
     * update alert list
     */
    updateAlertList: function (list) {
        var me = this;

        var alertList = me.parsAlertList(list, me);

        me.set('alertList', alertList);

        if (alertList.length > 0) {
            var state = me.getMaxStateFromAlertList(alertList);
            var stateName = me.getNameByValue(me.PRIORITIES, state);
            me.set('state', stateName);
        } else {
            me.set('state', 'not_connected');
        }

        var alreadyNotified = me.get('alreadyNotified');
        var toNotifyUser = me.getToNotifyUserList(alertList, alreadyNotified);
        var newAlreadyNotified = me.removeFromAlreadyNotifiedListNotAlertOnes(alertList, alreadyNotified);
        newAlreadyNotified = newAlreadyNotified.concat(toNotifyUser);
        me.set('notifyUser', toNotifyUser);
        me.set('alreadyNotified', newAlreadyNotified);
    },

    filterToBeNotified: function (alertList) {
        return alertList.filter(function (item) {
            return item.priority > 3;
        });
    },

    filterNotToBeNotified: function (alertList) {
        return alertList.filter(function (item) {
            return item.priority <= 3;
        });
    },

    getToNotifyUserList: function (alertList, alreadyNotified) {
        var alertsOnly = this.filterToBeNotified(alertList);
        return alertsOnly.filter(function (item) {
            return listNotContainsObject(item, alreadyNotified);
        });
    },

    removeFromAlreadyNotifiedListNotAlertOnes: function (alertList, alreadyNotified) {
        var oksOnly = this.filterNotToBeNotified(alertList);
        return alreadyNotified.filter(function (item) {
            return listNotContainsObject(item, oksOnly);
        });
    },

    getMaxStateFromAlertList: function (alertList) {
        return Math.max.apply(Math, alertList.map(function (it) {
            return it.priority;
        }));
    },

    parsAlertList: function (list, me) {
        var alertList = [];
        $(list).each(function (index, value) {
            var item = {
                'priority': me.PRIORITIES[value.state],
                'state': value.state,
                'id': value.id,
                'dashboardId': value.dashboardId,
                'panelId': value.panelId,
                'name': value.name,
                'message': value.message,
                'newStateDate': value.newStateDate,
                'evalDate': value.evalDate,
                'evalData': value.evalData,
                'executionError': value.executionError,
                'dashboardUri': value.dashboardUri
            };
            alertList.push(item);
        });

        this.sortList(alertList);
        return alertList;
    },

    sortList: function (alertList) {
        alertList.sort(function (a, b) {
            var byPriority = b.priority - a.priority;
            if (byPriority === 0) {
                return ((a.dashboardId > b.dashboardId) - (a.dashboardId < b.dashboardId))
            } else {
                return byPriority
            }
        });
    },

    getNameByValue: function (object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

});
