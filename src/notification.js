$(document).ready(function() {

	// load data from backend
	Handlebars = chrome.extension.getBackgroundPage().Handlebars;
	Ember = chrome.extension.getBackgroundPage().Ember;
	App = chrome.extension.getBackgroundPage().App;

	$overview = $.createView('notification', App.grafanaManager.grafanaStatus.get('notifyUser'));
	App.grafanaManager.grafanaStatus.set('notifyUser', []);
});