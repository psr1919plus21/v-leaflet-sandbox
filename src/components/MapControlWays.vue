<template>
  <div class="map-ways">
    <div
      :class="mapWaysClass">
      <div
        class="map-ways__button"
        v-text="isProgress ? 'Click on map to add point' : '+ Add point'"
        @click="waitForClickForPoint">
      </div>

      <div
        class="map-ways__control"
        @click="pointsLayerToggle" >
          {{isPointsLayerVisible ? 'Hide' : 'Show'}}
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import { mapState } from 'vuex';

export default {
  props: {
    mapWaysClass: {
      default: '',
    },
  },

  computed: {
    ...mapState({
      map: 'map',
    }),
  },

  data() {
    return {
      isProgress: false,
      isPointsLayerVisible: false,
      pointsGroup: L.layerGroup(),
    };
  },

  methods: {
    pointsLayerToggle() {
      if (this.isPointsLayerVisible) {
        this.map.removeLayer(this.pointsGroup);
        this.isPointsLayerVisible = false;
      } else {
        this.map.addLayer(this.pointsGroup);
        this.isPointsLayerVisible = true;
      }
    },

    setCursorCrosshair() {
      const mapContainer = this.map.getContainer();
      mapContainer.classList.add('cursor-crosshair');
    },

    setCursorDefault() {
      const mapContainer = this.map.getContainer();
      mapContainer.classList.remove('cursor-crosshair');
    },

    waitForClickForPoint() {
      this.setCursorCrosshair();
      this.isProgress = true;

      this.map.addEventListener('click', this.addPointToMap);
    },

    addPointToMap(e) {
      if (!this.isPointsLayerVisible) {
        this.pointsGroup.addTo(this.map);
        this.isPointsLayerVisible = true;
      }
      const wayPoint = this.createPoint(e.latlng);

      this.pointsGroup.addLayer(wayPoint);

      if (e.originalEvent.shiftKey) {
        return;
      }

      this.isProgress = false;
      this.map.removeEventListener('click', this.addPointToMap);
      this.setCursorDefault();
    },

    createPoint(clickPosition) {
      const wayPoint = L.marker(clickPosition, {
        radius: 50,
      });

      return wayPoint;
    },
  },
};
</script>

<style>

</style>
