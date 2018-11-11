/* eslint-disable dot-notation */
import { mount } from '@vue/test-utils';
import Map from '@/components/Map';

const wrapper = mount(Map, {
  attachToDocument: true,
});

describe('Map.vue', () => {
  it('should render map container', () => {
    expect(wrapper.find('.map')).toBeDefined();
  });

  it('should create a leaflet instance', (done) => {
    setTimeout(() => {
      expect(wrapper.vm.map.boxZoom).toBeDefined();
      done();
    }, 200);
  });

  it('should have openStreetMap as base layer', () => {
    const { vm } = wrapper;

    expect(vm.map.hasLayer(vm.baseLayers['openStreetMap'].layer)).toBe(true);
  });

  it('should change base layer', () => {
    const { vm } = wrapper;

    expect(vm.map.hasLayer(vm.baseLayers['openStreetMap'].layer)).toBe(true);
    vm.setBaseLayer('openStreetMapGrey');
    expect(vm.map.hasLayer(vm.baseLayers['openStreetMap'].layer)).toBe(false);
    expect(vm.map.hasLayer(vm.baseLayers['openStreetMapGrey'].layer)).toBe(true);
  });

  it('should clear layers from the map', () => {
    const { vm } = wrapper;
    let layersCount = 0;

    vm.clearBaseLayers();
    // eslint-disable-next-line no-plusplus
    vm.map.eachLayer(() => layersCount++);
    expect(layersCount).toBe(0);
  });

  it('should add overlay to the map', () => {
    const { vm } = wrapper;

    vm.overlayToggle('coolPlaces');
    expect(vm.map.hasLayer(vm.overlays['coolPlaces'].layer)).toBe(true);
  });

  it('should remove overlay to the map by second call overlayToggle', () => {
    const { vm } = wrapper;

    expect(vm.map.hasLayer(vm.overlays['coolPlaces'].layer)).toBe(true);
    vm.overlayToggle('coolPlaces');
    expect(vm.map.hasLayer(vm.overlays['coolPlaces'].layer)).toBe(false);
  });
});
