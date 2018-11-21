import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import MapControlWays from '@/components/MapControlWays';
import storeInit from '../../../src/store';

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store(storeInit);

let wrapper;

beforeEach(() => {
  wrapper = mount(MapControlWays, {
    localVue,
    store,
  });
});

describe('MapControlWays.vue', () => {
  it('should render control ways component', () => {
    expect(wrapper.find('.map-ways').element).toBeDefined();
  });

  it('should set class through props', () => {
    expect(wrapper.find('.additional-class').element).not.toBeDefined();

    wrapper.setProps({ mapWaysClass: 'additional-class' });

    expect(wrapper.find('.additional-class').element).toBeDefined();
  });

  it('should add point button exist', () => {
    const addPointsBtn = wrapper.find('.map-ways__button');
    expect(addPointsBtn.element).toBeDefined();
  });

  it('should add point button contain correct text', () => {
    const addPointsBtn = wrapper.find('.map-ways__button');
    expect(addPointsBtn.text()).toBe('+ Add point');
  });
});
