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
      map: state => state.mapStore.map,
    }),
  },

  data() {
    return {
      isProgress: false,
      isPointsLayerVisible: false,
      pointsGroup: L.layerGroup(),
    };
  },

  watch: {
    map() {
      this.initPanes();
    },
  },

  methods: {
    initPanes() {
      this.map.createPane('lines').style.zIndex = 200;
    },

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
      const wayPoint = L.circleMarker(clickPosition, {
        fillColor: '#f33',
        fillOpacity: 0.9,
        radius: 10,
        draggable: true,
      });

      wayPoint.addEventListener('click', this.setLinesBetweenPoints);

      return wayPoint;
    },

    setLinesBetweenPoints(e) {
      this.setLinesBetweenPoints.points = this.setLinesBetweenPoints.points || [];
      this.setLinesBetweenPoints.points.push(e.latlng);

      if (this.setLinesBetweenPoints.points.length === 2) {
        this.drawLineForPoints(this.setLinesBetweenPoints.points);
        this.setLinesBetweenPoints.points = [];
      }
    },

    drawLineForPoints(points) {
      const line = L.polyline(points, {
        pane: 'lines',
      });
      this.pointsGroup.addLayer(line);
    },
  },
};
</script>

<style>

</style>
