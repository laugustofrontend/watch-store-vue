import { mount } from '@vue/test-utils'
import CartItem from '@/components/Cart/item'
import { makeServer } from '@/miragejs/server'

const mountCartItem = (server) => {
  const product = server.create('product', {
    title: 'Lindo relógio',
    price: '22.33',
  })
  const wrapper = mount(CartItem, {
    propsData: {
      product,
    },
  })

  return {
    product,
    wrapper,
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
})
