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

      <div
        class="map-ways__control"
        @click="waitForStartPoint">
          {{ isStartPointProgress ? 'Click to start point' : 'Set start point' }}
      </div>

      <div
        class="map-ways__control"
        @click="setFinishPoint">
          Set finish point
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
      isStartPointProgress: false,
      isPointsLayerVisible: false,
      pointsGroup: L.layerGroup(),
      points: [],
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
      const wayPoint = {
        id: this.points.length,
        point: this.createPoint(e.latlng),
        weight: Infinity,
        prevPoint: null,
        arcs: [],
        isStart: false,
        ifFinish: false,
      };

      this.points.push(wayPoint);

      wayPoint.point.bindTooltip(`point: ${wayPoint.id}<br>weight: ${wayPoint.weight}<br>prevPoint: ${wayPoint.prevPoint}`, {
        permanent: true,
        direction: 'top',
        offset: [0, -10],
      });

      this.pointsGroup.addLayer(wayPoint.point);

      if (e.originalEvent.shiftKey) {
        return;
      }

      this.isProgress = false;
      this.map.removeEventListener('click', this.addPointToMap);
      this.setCursorDefault();
    },

    updatePointLabel(wayPoint) {
      wayPoint.point.unbindTooltip();
      wayPoint.point.bindTooltip(`point: ${wayPoint.id}<br>weight: ${wayPoint.weight}<br>prevPoint: ${wayPoint.prevPoint}`, {
        permanent: true,
        direction: 'top',
        offset: [0, -10],
      });
    },

    createPoint(clickPosition) {
      const wayPoint = L.circleMarker(clickPosition, {
        className: 'map-ways__point',
        color: '#444',
        fillColor: '#f7ff05',
        fillOpacity: 0.9,
        radius: 10,
        draggable: true,
      });

      wayPoint.addEventListener('click', this.setLinesBetweenPoints);

      return wayPoint;
    },

    setLinesBetweenPoints(e) {
      if (this.isStartPointProgress) {
        this.setStartPoint(e.sourceTarget);
        return;
      }

      this.setLinesBetweenPoints.points = this.setLinesBetweenPoints.points || [];
      this.setLinesBetweenPoints.points.push(e);

      const currentMarker = e.sourceTarget;
      currentMarker.setStyle({ color: '#922' });

      if (this.setLinesBetweenPoints.points.length === 2) {
        const line = this.drawLineForPoints(this.setLinesBetweenPoints.points);
        const distance = this.addDistance(this.setLinesBetweenPoints.points, line);
        this.setLinesBetweenPoints.points.forEach(point => point.sourceTarget.setStyle({ color: '#444' }));
        this.linkPoints(this.setLinesBetweenPoints.points, line, distance);
        this.setLinesBetweenPoints.points = [];
      }
    },

    linkPoints(points, line, distance) {
      const firstPoint = this.points.find(({ point }) => point === points[0].sourceTarget);
      const secondPoint = this.points.find(({ point }) => point === points[1].sourceTarget);

      firstPoint.arcs.push({
        line,
        distance,
        point: secondPoint.point,
      });

      secondPoint.arcs.push({
        line,
        distance,
        point: firstPoint.point,
      });
    },


    addDistance(points, line) {
      const lineCenter = line.getBounds().getCenter();
      const pointsLatLng = points.map(point => point.latlng);
      const distance = (this.map.distance(pointsLatLng[0], pointsLatLng[1]) / 1000).toFixed(2);

      const myIcon = L.divIcon({ html: `${distance} km`, className: 'map-ways__distance-label' });
      this.pointsGroup.addLayer(L.marker(lineCenter, { icon: myIcon }));
      return distance;
    },

    drawLineForPoints(points) {
      const pointsLatLng = points.map(point => point.latlng);
      const line = L.polyline(pointsLatLng, {
        pane: 'lines',
      });
      this.pointsGroup.addLayer(line);
      return line;
    },

    waitForStartPoint() {
      this.isStartPointProgress = true;
    },

    clearOldStartPoint() {
      const oldStartPoint = this.points.find(wayPoint => wayPoint.isStart);

      if (!oldStartPoint) {
        return;
      }

      oldStartPoint.isStart = false;
      oldStartPoint.weight = Infinity;
      this.updatePointLabel(oldStartPoint);
    },

    setStartPoint(pointForStart) {
      this.clearOldStartPoint();
      const startPoint = this.points.find(({ point }) => point === pointForStart);
      startPoint.isStart = true;
      startPoint.weight = 0;
      startPoint.point.setStyle({ color: '#393' });
      this.updatePointLabel(startPoint);
      this.isStartPointProgress = false;
    },

    setFinishPoint() {
      console.log('finish');
    },
  },
};
</script>

<style>
.map-ways__distance-label {
    font-size: 11px;
    width: auto !important;
    height: auto !important;
    white-space: nowrap;
    background: #fff;
    font-weight: bold;
    color: #444;
    padding: 2px;
    border: 1px solid #333;
}

.map-ways__point:hover {
  fill-opacity: .7;
}

</style>
