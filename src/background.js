App = Ember.Application.create({

    ready: function() { var me = this;
    
		// global default config
		if ($.getLocalConfig() === undefined) {
			$.setLocalConfig({
				'grafanabase': '',
				'grafanaToken': '',
				'playSound': 'true',
				'interval': '60'
			});
		}
	
		// global beans
		App.set('grafanaManager', new App.GrafanaManager());
		
		// refresh grafana status
		App.grafanaManager.refreshGrafanaStatus();

    }
    
});