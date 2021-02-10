import { mount } from '@vue/test-utils'
import ProductCard from '@/components/Product/card'

describe('Product Card - unit', () => {
  it('should mount the component', () => {
    const wrapper = mount(ProductCard, {
      propsData: {
        product: {},
      },
    })

    expect(wrapper.vm).toBeDefined()
  })
})
