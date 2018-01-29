App.GrafanaManager = Ember.Object.extend({

	grafanaUrl: null,
	grafanaService: null,
	grafanaStatus: null,
	timeoutObject: null,


	/**
	 * constructor
	 */
	init: function() { var me = this;

		me.set('grafanaStatus', new App.GrafanaStatus());
		me.changeConfiguration();
	},

	changeConfiguration: function(cb) { var me = this;

		var config = $.getLocalConfig();
		if (config['grafanabase']) {
			if (!me.grafanaService) {
				me.set('grafanaService', new App.GrafanaService());
			}
			me.grafanaService.connect(config['grafanabase'], config['grafanaToken'], cb);
		}
	},

	refreshGrafanaStatus: function() { var me = this;

		var config = $.getLocalConfig();

		if (me.grafanaService) {

			me.grafanaService.getAlertList(config, function(triggerList) {
				me.grafanaStatus.updateAlertList(triggerList);
				me.updateIconAndPlaySound(triggerList.length);
			});
		}

		// schedule next update
		clearTimeout(me.timeoutObject);

		me.set('timeoutObject', setTimeout(function() { me.refreshGrafanaStatus(); }, config['interval'] * 1000));
	},


	updateIconAndPlaySound: function(triggerCount) { var me = this;

        var state = me.grafanaStatus.get('state');
        var notifyUser = me.grafanaStatus.get('notifyUser');
        var alreadyNotified = me.grafanaStatus.get('alreadyNotified');


		chrome.browserAction.setIcon({path: 'images/icon_' + state + '.png'});
		if (state !== me.grafanaStatus.PRIORITIES.not_connected && triggerCount > 0) {
			chrome.browserAction.setBadgeBackgroundColor({ color: '#888888' });
			chrome.browserAction.setBadgeText({ text: '' + alreadyNotified.length });
		} else {
			chrome.browserAction.setBadgeText({text: ''});
		}

		if (notifyUser.length > 0 && state !== me.grafanaStatus.PRIORITIES.not_connected) {
            var config = $.getLocalConfig();
			if (config['playSound']) {
				var bing = new Audio('sounds/unsure.mp3');
				bing.play();
			}
			me.notifyUser(notifyUser);
		}
	},

	notifyUser: function(notifyUserList) { var me = this;

			var message  = notifyUserList.map(function(elem){
            return elem.name;
        }).join("\n");

		chrome.notifications.create('notification',  {
			type: "basic",
			title: "Grafana Notifier",
			message: message,
			iconUrl: "images/icon128.png"
		}, function() {
			setTimeout(function() { chrome.notifications.clear('notification', function() {}); }, 5000);
		});
	}
});
