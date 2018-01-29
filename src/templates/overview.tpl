<div id="header">
	<a target="_blank" href="https://grafana.com/"><img id="logo" src="images/logo_grafana.png" /></a>
	<h1>Grafana Notifier: Overview</h1>
</div>

<hr />

<div id="menu">
	<span class="link" id="settingsButton">Settings</span>
	|
	<span class="link" id="grafanaButton">Open Grafana</span>
</div>

<hr />

<table class="overview details">
	<tr class="header">
		<th>Dashboard</th>
		<th>Name</th>
		<th>State</th>
	</tr>
	{{#each data.alertList}}
	<tr class="{{this.priorityClass}}">
		<td class="dashboardUri">{{this.dashboardUri}}</td>
		<td class="Name">{{this.name}}</td>
		<td class="State">{{this.state}}</td>
	</tr>
	{{/each}}
	<tr>
</table>