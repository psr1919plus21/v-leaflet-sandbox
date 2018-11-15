import { mount } from '@vue/test-utils';
import MapControls from '@/components/MapControls';

let wrapper;

beforeEach(() => {
  wrapper = mount(MapControls, {
    propsData: {
      baseLayers: {
        openStreetMap: {
          key: 'openStreetMap',
          name: 'OpenStreetMap',
        },

        openStreetMapGrey: {
          key: 'openStreetMapGrey',
          name: 'OpenStreetMapGrey',
        },
      },

      overlays: {
        coolPlaces: {
          layer: null,
          isActive: false,
          name: 'Cool Places',
        },

        streetNames: {
          layer: null,
          isActive: false,
          name: 'streetNames',
        },
      },
    },
  });
});

describe('MapControls.vue', () => {
  it('should render map controls container', () => {
    expect(wrapper.find('.map-controls')).toBeDefined();
  });

  it('should render map control items', () => {
    const mapControlsItems = wrapper.findAll('.map-controls__item');

    expect(mapControlsItems.length).toBe(4);
  });

  it('should emit baseLayerChanged event with OpenStreetMap value by click', () => {
    const firstMapControlItem = wrapper.findAll('.map-controls__item').at(0);

    firstMapControlItem.trigger('click');

    expect(wrapper.emitted().baseLayerChanged[0][0]).toBe('openStreetMap');
  });

  it('should emit baseLayerChanged event with OpenStreetMapGrey value by click on second item', () => {
    const firstMapControlItem = wrapper.findAll('.map-controls__item').at(1);

    firstMapControlItem.trigger('click');

    expect(wrapper.emitted().baseLayerChanged[0][0]).toBe('openStreetMapGrey');
  });

  it('should emit overlayToggle event with coolPlaces value by click on third item', () => {
    const firstMapControlItem = wrapper.findAll('.map-controls__item').at(2);

    firstMapControlItem.trigger('click');

    expect(wrapper.emitted().overlayToggle[0][0]).toBe('Cool Places');
  });

  it('should render base layers through props', () => {
    const mapControlItems = wrapper.findAll('.map-controls__item');

    expect(mapControlItems.at(0).text()).toBe('OpenStreetMap');
    expect(mapControlItems.at(1).text()).toBe('OpenStreetMapGrey');
  });

  it('should render overlay layers through props', () => {
    const mapControlItems = wrapper.findAll('.map-controls__item');

    expect(mapControlItems.at(2).text()).toBe('Show Cool Places');
  });

  it('should show Hide text if overlay is active.', () => {
    wrapper.setProps({
      overlays: {
        coolPlaces: {
          layer: null,
          isActive: true,
          name: 'Cool Places',
        },
      },
    });

    const mapControlItems = wrapper.findAll('.map-controls__item');

    expect(mapControlItems.at(2).text()).toBe('Hide Cool Places');
  });

  it('should emit streetNames overlay toggle', () => {
    const streetNamesControl = wrapper.findAll('.map-controls__item').at(3);

    streetNamesControl.trigger('click');

    expect(wrapper.emitted().overlayToggle[0][0]).toBe('streetNames');
  });
});
