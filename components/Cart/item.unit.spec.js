import { mount } from '@vue/test-utils'
import CartItem from '@/components/Cart/item'
import { makeServer } from '@/miragejs/server'
import { CartManager } from '@/managers/CartManager'

const mountCartItem = (server) => {
  const cartManager = new CartManager()
  const product = server.create('product', {
    title: 'Lindo relógio',
    price: '22.33',
  })
  const wrapper = mount(CartItem, {
    propsData: {
      product,
    },
    mocks: {
      $cart: cartManager,
    },
  })

  return {
    product,
    wrapper,
    cartManager,
  }
}
describe('CartItem - unit', () => {
  let server
  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })
  afterEach(() => {
    server.shutdown()
  })

  it('should mount the component', async () => {
    const { wrapper } = await mountCartItem(server)

    expect(wrapper.vm).toBeDefined()
  })

  it('should display product info', async () => {
    const {
      wrapper,
      product: { title, price },
    } = await mountCartItem(server)
    const content = wrapper.text()

    expect(content).toContain(title)
    expect(content).toContain(price)
  })

  it('should display quantity 1 when product is first displayed', async () => {
    const { wrapper } = await mountCartItem(server)
    const quantity = wrapper.find('[data-testid="quantity"]')

    expect(quantity.text()).toContain('1')
  })

  it('should increase quantity when plus button gets clicked', async () => {
    const { wrapper } = await mountCartItem(server)
    const quantity = wrapper.find('[data-testid="quantity"]')
    const button = wrapper.find('[data-testid="+"]')

    await button.trigger('click')
    expect(quantity.text()).toContain('2')

    await button.trigger('click')
    expect(quantity.text()).toContain('3')

    await button.trigger('click')
    expect(quantity.text()).toContain('4')
  })

  it('should descrease quantity when - button gets clicked', async () => {
    const { wrapper } = await mountCartItem(server)
    const quantity = wrapper.find('[data-testid="quantity"]')
    const button = wrapper.find('[data-testid="-"]')

    await button.trigger('click')
    expect(quantity.text()).toContain('0')
  })

  it('should not go below zero when button - is repeat clicked', async () => {
    const { wrapper } = await mountCartItem(server)
    const quantity = wrapper.find('[data-testid="quantity"]')
    const button = wrapper.find('[data-testid="-"]')

    await button.trigger('click')
    await button.trigger('click')
    expect(quantity.text()).toContain('0')
  })

  it('should display a button to remove item from cart', () => {
    const { wrapper } = mountCartItem(server)
    const button = wrapper.find('[data-testid="remove-button"]')

    expect(button.exists()).toBe(true)
  })

  it('should call cart manager removeProduct() when button gets clicked', async () => {
    const { wrapper, cartManager, product } = mountCartItem(server)
    const spyRemoveProduct = jest.spyOn(cartManager, 'removeProduct')

    await wrapper.find('[data-testid="remove-button"]').trigger('click')

    expect(spyRemoveProduct).toHaveBeenCalledTimes(1)
    expect(spyRemoveProduct).toHaveBeenCalledWith(product.id)
  })
})
