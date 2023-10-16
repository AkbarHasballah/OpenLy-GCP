import { get } from "https://jscroot.github.io/api/croot.js";
import { URLGeoJson } from "../SIG/View/template.js";
import { MakeGeojsonFromAPI, responseData, AddLayerToMAP } from "../SIG/Controller/controller.js";
import {map} from '../SIG/Model/config.js';
import {onClosePopupClick,onDeleteMarkerClick,onSubmitMarkerClick,onMapClick,onMapPointerMove,disposePopover} from '../SIG/Controller/popup.js';
import {onClick} from 'https://jscroot.github.io/element/croot.js';
import {getAllCoordinates} from '../SIG/Controller/cog.js';


onClick('popup-closer',onClosePopupClick);
onClick('insertmarkerbutton',onSubmitMarkerClick);
onClick('hapusbutton',onDeleteMarkerClick);
onClick('hitungcogbutton',getAllCoordinates);

map.on('click', onMapClick);
map.on('pointermove', onMapPointerMove);
map.on('movestart', disposePopover);
    
get(URLGeoJson,data => {
    responseData(data)
    let link = MakeGeojsonFromAPI(data)
    // console.log(link)
    // console.log(geojson)
    AddLayerToMAP(link)
}); 



document.addEventListener('DOMContentLoaded', () => {
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([107.60701584098513,-6.914777351366908]),
            zoom: 15.1
        })
    });

    // Mendownload data waypoint, line string, dan polyline
    const waypointSource = new ol.source.Vector({
        url: 'https://raw.githubusercontent.com/AkbarHasballah/OpenLY/main/SIG/waypoint.json',
        format: new ol.format.GeoJSON()
    });

    const lineStringSource = new ol.source.Vector({
        url: 'https://raw.githubusercontent.com/AkbarHasballah/OpenLY/main/SIG/polygon.json',
        format: new ol.format.GeoJSON()
    });

    const polylineSource = new ol.source.Vector({
        url: 'https://raw.githubusercontent.com/AkbarHasballah/OpenLY/main/SIG/polyline.json',
        format: new ol.format.GeoJSON()
    });

    // Membuat layer untuk waypoint, line string, dan polyline
    const waypointLayer = new ol.layer.Vector({
        source: waypointSource,
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: 'blue'
                })
            })
        })
    });

    const lineStringLayer = new ol.layer.Vector({
        source: lineStringSource,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'green',
                width: 2
            })
        })
    });

    const polylineLayer = new ol.layer.Vector({
        source: polylineSource,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'black',
                width: 5
                
            })
        })
    });

    // Menambahkan layer ke peta
    map.addLayer(waypointLayer);
    map.addLayer(lineStringLayer);
    map.addLayer(polylineLayer);

    // Mendapatkan koordinat dari GeoJSON
    const getCoordinates = (source) => {
        const features = source.getFeatures();
        const coordinates = features[0].getGeometry().getCoordinates();
        return coordinates;
    };

    // Menampilkan koordinat di dalam tabel
    waypointSource.once('change', () => {
        const waypointCoords = getCoordinates(waypointSource);
        document.getElementById('featureName').textContent = 'Waypoint';
        document.getElementById('featureType').textContent = 'Point';
        document.getElementById('featureCoords').textContent = waypointCoords.toString();
    });

    lineStringSource.once('change', () => {
        const lineStringCoords = getCoordinates(lineStringSource);
        document.getElementById('featureName').textContent = 'Line String';
        document.getElementById('featureType').textContent = 'Line String';
        document.getElementById('featureCoords').textContent = lineStringCoords.toString();
    });

    polylineSource.once('change', () => {
        const polylineCoords = getCoordinates(polylineSource);
        document.getElementById('featureName').textContent = 'Polyline';
        document.getElementById('featureType').textContent = 'Polyline';
        document.getElementById('featureCoords').textContent = polylineCoords.toString();
    });
});


    // Menambahkan layer ke peta
   

    // Mendapatkan koordinat dari GeoJSON
    function getCoordinates(source) {
        var features = source.getFeatures();
        var coordinates = features[0].getGeometry().getCoordinates();
        return coordinates;
    }

  