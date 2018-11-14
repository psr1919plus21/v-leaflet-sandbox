<template>
  <div class="map-wrapper">
    <div id="map" class="map"></div>
    <MapControls
      :baseLayers="baseLayers"
      :overlays="overlays"
      @overlayToggle="overlayToggle"
      @baseLayerChanged="setBaseLayer"
    />
  </div>
</template>

<script>
import L from 'leaflet';
import MapControls from './MapControls';

export default {
  name: 'Map',
  components: {
    MapControls,
  },
  data() {
    return {
      map: null,
      layerSelected: 'openStreetMap',

      baseLayers: {
        openStreetMap: {
          layer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
          key: 'openStreetMap',
          name: 'OpenStreetMap',
        },

        openStreetMapGrey: {
          layer: L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'),
          key: 'openStreetMapGrey',
          name: 'OpenStreetMapGrey',
        },
      },

      overlays: {
        coolPlaces: {
          name: 'coolPlaces',
          layer: null,
          isActive: true,
        },

      },
    };
  },

  computed: {
    activeLayer() {
      return this.baseLayers[this.layerSelected].layer;
    },
  },

  methods: {
    initMap() {
      this.overlays.coolPlaces.layer = this.createLayerCoolPlaces();
      this.map = L.map('map', {
        zoomControl: false,
        attributionControl: false,
      }).setView([-41.29042, 174.78219], 12);

      this.map.addLayer(this.activeLayer);
      this.addActiveOverlays();

      this.map.whenReady(() => {
        this.bindMapEvents();
      });

      console.log(this.map.getZoomScale(2, 3));
    },

    setBaseLayer(newLayer) {
      if (this.map.hasLayer(this.baseLayers[newLayer].layer)) {
        return;
      }

      this.layerSelected = newLayer;
      this.clearBaseLayers();
      this.map.addLayer(this.activeLayer);
    },

    clearBaseLayers() {
      Object.values(this.baseLayers).forEach((baseLayer) => {
        this.map.removeLayer(baseLayer.layer);
      });
    },

    addActiveOverlays() {
      const activeOverlays = Object.values(this.overlays).filter(overlay => overlay.isActive);
      activeOverlays.forEach((overlay) => {
        this.map.addLayer(overlay.layer);
      });
    },

    overlayToggle(overlayName) {
      const overlay = this.overlays[overlayName];

      if (overlay.isActive) {
        this.map.removeLayer(overlay.layer);
      } else {
        this.map.addLayer(overlay.layer);
      }
      overlay.isActive = !overlay.isActive;
    },

    createLayerCoolPlaces() {
      const coolPlaces = new L.LayerGroup();
      // L.polyline([[-41.28313, 174.77736], [-41.2895, 174.77803],
      // [-41.29042, 174.78219], [-41.29437, 174.78405]]).addTo(coolPlaces);
      L.marker([-41.29042, 174.78219]).bindPopup('Te Papa').addTo(coolPlaces);
      L.marker([-41.29437, 174.78405]).bindPopup('Embassy Theatre').addTo(coolPlaces);
      L.marker([-41.2895, 174.77803]).bindPopup('Michael Fowler Centre').addTo(coolPlaces);
      L.marker([-41.28313, 174.77736]).bindPopup('Leuven Belgin Beer Cafe').addTo(coolPlaces);

      return coolPlaces;
    },

    bindMapEvents() {
      this.map.addEventListener('click', this.mapClickHandler);
    },

    mapClickHandler(e) {
      const sevast = L.latLng(44.5890022232585, 33.46695888787508);
      console.log('from sevast: ', (this.map.distance(sevast, e.latlng) / 1000).toFixed(2));
    },
  },

  mounted() {
    setTimeout(() => {
      this.initMap();
    }, 0);
  },
};
</script>

<style scoped>
  .map {
    border: 1px solid #333;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #c9c9c9;
  }
</style>
