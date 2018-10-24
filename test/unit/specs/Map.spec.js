import { mount } from '@vue/test-utils';
import Map from '@/components/Map';

describe('Map.vue', () => {
  it('should render map container', () => {
    const wrapper = mount(Map);

    expect(wrapper.find('.map')).toBeDefined();
  });
});
