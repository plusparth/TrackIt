var DEFAULT_TR_CONTENTS = '<tr class="listRow" id="row{UUID}"><td><div class="checkbox"><label><input type="checkbox" name="{UUID}" onchange="changeMapDisplay(this.name, this.checked)" id="checkbox{UUID}"></label></div></td><td class="uuid" id="uuid{UUID}">{UUID}</td><td class="name" id="name{UUID}">{NAME}</td><td class="location" id="location{UUID}"><p>Starting location: <span id="start{UUID}">{STARTLOCATION}</span></p><p>Current location: <span id="current{UUID}">{CURRENTLOCATION}</span></p><p>Destination: <span id="dest{UUID}">{DESTLOCATION}</span></p></td><td><a href="javascript:removeRow(\'{UUID}\')" class="btn btn-raised btn-danger">Stop Tracking</a></td></tr>';
var packagesMonitored = [];
var packagesOnMap = [];

// For testing purposes, remove later
var isValidUUID = true;


function getLocationName(lat, lon) {

	return "Washington, DC";
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function populateRow(uuid, name) {
	var newRow = DEFAULT_TR_CONTENTS;
	newRow = replaceAll(newRow, '{UUID}', uuid);
	newRow = replaceAll(newRow, '{NAME}', name);
	newRow = replaceAll(newRow, '{CURRENTLOCATION}', "Loading...");
	newRow = replaceAll(newRow, '{STARTLOCATION}', "Loading...");
	newRow = replaceAll(newRow, '{DESTLOCATION}', "Loading...");
	return newRow;
}

function addRow(uuid, name, start, current, dest) {
	rowToAdd = populateRow(uuid, name);
	$('#packageTable > tbody:last-child').append(rowToAdd);
	$.material.checkbox();
	console.log("uuid: " + uuid);
	$("#start" + uuid).text(getLocationName(start[0], start[1]));
	$("#current" + uuid).text(getLocationName(current[0], current[1]));
	$("#dest" + uuid).text(getLocationName(dest[0], dest[1]));
}

function changeMapDisplay(id, checked) {
	console.log(id);
	if(!checked) {
		packagesOnMap.splice($.inArray(id, packagesOnMap), 1);
	} else {
		packagesOnMap.push(id);
	}
	$.cookie("packagesOnMap", JSON.stringify(packagesOnMap));
}

function removeRow(uuid) {
	packagesMonitored.splice($.inArray(uuid, packagesMonitored), 1);
	$("#row" + uuid).remove();
}

function addPackage() {
	uuid = $("#newPackage").val();
	console.log(uuid);
	// TODO: add real condition here for check
	if(isValidUUID) {
		$("#newPackage").val("");
		packagesMonitored.push(uuid);
		$.cookie("packagesMonitored", JSON.stringify(packagesMonitored));
		addRow(uuid, "name", [1, 1], [2, 2], [3, 3])
	} else {
		$("#invalidUUIDAlert").show();
        $("#invalidUUIDAlert").fadeTo(2000, 500).slideUp(500, function(){
       		$("#invalidUUIDAlert").hide();
       	});
	}
}

function writePackages(packageList, mapList) {
	packagesMonitored = packageList;
	packagesOnMap = mapList;
	for(i = 0; i < packageList.length; i++) {
		addRow(packageList[i], "name", [1, 1], [2, 2], [3, 3]);
	}
	for(i = 0; i < mapList.length; i++) {
		$("#checkbox" + mapList[i]).prop("checked", true);
	}
}

$(document).ready(function() {
	if (typeof $.cookie('packagesOnMap') == 'undefined') {
		$.cookie('packagesMonitored', '[]');
 	}
 	if (typeof $.cookie('packagesOnMap') == 'undefined') {
		$.cookie('packagesOnMap', '[]');
 	}
	writePackages(JSON.parse($.cookie("packagesMonitored")), JSON.parse($.cookie("packagesOnMap")));
});






