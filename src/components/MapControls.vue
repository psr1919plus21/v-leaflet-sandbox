<template lang="html">
  <div class="map-controls">
    <div
      class="map-controls__item"
      v-for="(baseLayer, index) in baseLayers"
      :key="index"
      v-text="baseLayer.name"
      @click="setBaseLayer(baseLayer.key)"
    ></div>

    <div
      class="map-controls__item"
      v-for="(overlay, index) in overlays"
      :key="index"
      v-text="(overlay.isActive ? 'Hide ' : 'Show ') + overlay.name"
      @click="toggleOverlay(overlay.name)"
    ></div>

    <map-control-cats></map-control-cats>
    <map-control-ways map-ways-class="map-controls__item"></map-control-ways>


  </div>
</template>

<script>
import MapControlCats from './MapControlCats';
import MapControlWays from './MapControlWays';

export default {
  components: {
    MapControlCats,
    MapControlWays,
  },

  props: {
    baseLayers: {
      required: true,
      type: Object,
    },

    overlays: {
      required: true,
      type: Object,
    },
  },

  methods: {
    setBaseLayer(newBaseLayer) {
      this.$emit('baseLayerChanged', newBaseLayer);
    },

    toggleOverlay(overlayName) {
      this.$emit('overlayToggle', overlayName);
    },
  },
};
</script>

<style lang="css">
  .map-controls {
    background: #f9f9f9;
    position: fixed;
    z-index: 9;
    top: 20px;
    right: 20px;
    text-align: left;
  }

  .map-controls__item {
    cursor: pointer;
    padding: 16px;
  }

  .map-controls__item:hover {
    background: #999;
    color: #fff;
  }
</style>
