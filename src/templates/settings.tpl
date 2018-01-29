<div id="header">
	<a target="_blank" href="https://grafana.com/"><img id="logo" src="images/logo_grafana.png" /></a>
	<h1>Grafana Notifier: Settings</h1>
</div>

<hr />

<div id="settings">
	<form>
		<div>
			<label for="grafanabase">Grafana Base: </label>
			<input id="grafanabase" type="text" value="{{data.grafanabase}}" />
		</div>
		<div>
			<label for="grafanaToken">Grafana Pass: </label>
			<input id="grafanaToken" type="password" value="***********" />
		</div>
		<div>
			<label for="interval">Update Interval (s): </label>
			<input id="interval" type="text" value="{{data.interval}}" />
		</div>
		<div>
			<label for="playSound">Play Sound: </label>
			<input id="playSound" name="playSound" type="radio" value="true" {{#if data.playSound}}checked="checked"{{/if}}>Yes</input>
			<input id="playSound" name="playSound" type="radio" value="false" {{#unless data.playSound}}checked="checked"{{/unless}}>No</input>
		</div>

		<div class="buttons">
			<input id="saveButton" type="submit" value="Save" />
			<input id="cancelButton" type="button" value="Cancel" />
		</div>
	</form>
</div>