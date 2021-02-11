import { mount } from '@vue/test-utils'
import ProductCard from '@/components/Product/card'
import { makeServer } from '@/miragejs/server'
import { CartManager } from '@/managers/CartManager'

describe('Product Card - unit', () => {
  let server
  const mountProductCard = () => {
    const product = server.create('product', {
      title: 'Relógio bonito',
      price: '22.00',
      image:
        'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    })
    const cartManager = new CartManager()
    const wrapper = mount(ProductCard, {
      propsData: {
        product,
      },
      mocks: {
        $cart: cartManager,
      },
    })

    return {
      wrapper,
      product,
      cartManager,
    }
  }

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })
  afterEach(() => {
    server.shutdown()
  })

  it('should mount the component', () => {
    const { wrapper } = mountProductCard()

    expect(wrapper.vm).toBeDefined()
    expect(wrapper.text()).toContain('Relógio bonito')
    expect(wrapper.text()).toContain('$22.00')
  })

  it('should match snapshot', () => {
    const { wrapper } = mountProductCard()

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should add item to cartState on button click', async () => {
    const { wrapper, cartManager, product } = mountProductCard()
    const spyOpen = jest.spyOn(cartManager, 'open')
    const spyAddProduct = jest.spyOn(cartManager, 'addProduct')

    await wrapper.find('button').trigger('click')

    expect(spyOpen).toHaveBeenCalledTimes(1)
    expect(spyAddProduct).toHaveBeenCalledTimes(1)
    expect(spyAddProduct).toHaveBeenCalledWith(product)
  })
})
