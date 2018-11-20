/* eslint-disable dot-notation */
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import Map from '@/components/Map';

import storeInit from '../../../src/store';

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store(storeInit);

const wrapper = mount(Map, {
  localVue,
  store,
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

  it('shouldn\'t clear layers if selected layer visible already', () => {
    const { vm } = wrapper;
    const clearBaseLayersSpy = jest.spyOn(vm, 'clearBaseLayers');
    vm.setBaseLayer(vm.layerSelected);

    expect(clearBaseLayersSpy).not.toBeCalled();
  });

  it('should clear layers from the map', () => {
    const { vm } = wrapper;

    vm.clearBaseLayers();

    Object.values(vm.baseLayers).forEach((baseLayer) => {
      expect(vm.map.hasLayer(baseLayer.layer)).toBe(false);
    });
  });

  it('should remove overlay from the map', () => {
    const { vm } = wrapper;

    expect(vm.map.hasLayer(vm.overlays['coolPlaces'].layer)).toBe(true);

    vm.overlayToggle('coolPlaces');

    expect(vm.map.hasLayer(vm.overlays['coolPlaces'].layer)).toBe(false);
  });

  it('should add overlay to the map by second call overlayToggle', () => {
    const { vm } = wrapper;

    expect(vm.map.hasLayer(vm.overlays['coolPlaces'].layer)).toBe(false);

    vm.overlayToggle('coolPlaces');

    expect(vm.map.hasLayer(vm.overlays['coolPlaces'].layer)).toBe(true);

    vm.overlayToggle('coolPlaces');

    expect(vm.map.hasLayer(vm.overlays['coolPlaces'].layer)).toBe(false);
  });
});
