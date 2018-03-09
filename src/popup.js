$(document).ready(function() {

	// load data from backend
	Handlebars = chrome.extension.getBackgroundPage().Handlebars;
	Ember = chrome.extension.getBackgroundPage().Ember;
	App = chrome.extension.getBackgroundPage().App;

	var $body = $('body');

	// OVERVIEW
	var $overview = $.createView('overview', App.grafanaManager.get('grafanaStatus'), function($content) {

		var config = $.getLocalConfig();

		$content.find('#settingsButton').click(function() {
			$overview.hide();
			$settings.show();
			$body.show();
		});
		$content.find('#grafanaButton').click(function() {
			var grafanaUrl = config['grafanabase'];
			if (grafanaUrl) {
				window.open(grafanaUrl);
			}
		});
        $content.find('.dashboardUri').click(function () {
            var url = $(this).attr('id') ? $(this).attr('id') : 'dashboard/' + $(this).text();
            window.open(config['grafanabase'] + url);
        });
	});

	// SETTINGS
	var $settings = $.createView('settings', $.getLocalConfig(), function($content) {

		$content.find('#saveButton').click(function() {
			var grafanabase = $content.find('#grafanabase').val();
			if (grafanabase.length > 0 && !(/\/$/.test(grafanabase))) {
				grafanabase += '/';
			}
			var oldConfig = $.getLocalConfig();
			var grafanaToken = $content.find('#grafanaToken').val();
			if (grafanaToken == '***********') {
				grafanaToken = oldConfig['grafanaToken'];
			} else {
				grafanaToken = $.encrypt($content.find('#grafanaToken').val())
			}

			$.setLocalConfig({
				'grafanabase': grafanabase,
				'grafanaToken': grafanaToken,
				'playSound': $content.find('input[name="playSound"][value="true"]').attr('checked') ? true : false,
				'interval': $content.find('#interval').val(),
			});
			App.grafanaManager.changeConfiguration(function() {
				App.grafanaManager.refreshGrafanaStatus();
			});
			window.close();
		});

		$content.find('#cancelButton').click(function() {
			window.close();
		});
	});
});
