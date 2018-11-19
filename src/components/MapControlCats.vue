<template>
  <div>
    <div
      class="map-controls__item"
      @click="waitForClickForCat">
      {{ isProgress ? 'Click on map to place cat' : '+ Add cat' }}
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      isProgress: false,
    };
  },

  computed: {
    ...mapState({
      map: 'map',
    }),
  },

  methods: {
    setCursorCrosshair() {
      const mapContainer = this.map.getContainer();
      mapContainer.classList.add('cursor-crosshair');
    },

    setCursorDefault() {
      const mapContainer = this.map.getContainer();
      mapContainer.classList.remove('cursor-crosshair');
    },

    waitForClickForCat() {
      this.setCursorCrosshair();
      this.isProgress = true;

      this.map.addEventListener('click', this.addCatToMap);
    },

    addCatToMap(e) {
      const catMarker = this.createCatMarker(e.latlng);

      catMarker.addTo(this.map);

      if (e.originalEvent.shiftKey) {
        return;
      }

      this.isProgress = false;
      this.map.removeEventListener('click', this.addCatToMap);
      this.setCursorDefault();
    },

    createCatMarker(clickPosition) {
      const myIcon = L.icon({
        iconUrl: 'http://www.pngmart.com/files/1/Cat-PNG-File.png',
        iconSize: [80, 80],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowUrl: '',
        shadowSize: [350, 350],
        shadowAnchor: [22, 94],
      });

      const catMarker = L.marker(clickPosition, {
        icon: myIcon,
        draggable: true,
        autoPan: true,
      });

      return catMarker;
    },
  },
};
</script>

<style>
.cursor-crosshair {
  cursor: crosshair;
}

</style>
