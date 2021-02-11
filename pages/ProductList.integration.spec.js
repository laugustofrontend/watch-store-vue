import { mount } from '@vue/test-utils'
import axios from 'axios'
import Vue from 'vue'

import { makeServer } from '@/miragejs/server'
import ProductCard from '@/components/Product/card.vue'
import Search from '@/components/Search'
import ProductList from '.'

jest.mock('axios', () => ({
  get: jest.fn(),
}))

describe('ProductList - integration', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })
  afterEach(() => {
    server.shutdown()
    jest.clearAllMocks()
  })

  const getProducts = (quantity = 10, overrides = []) => {
    let overrideList = []

    if (overrides.length > 0) {
      overrideList = overrides.map((override) =>
        server.create('product', override)
      )
    }

    const products = [
      ...server.createList('product', quantity),
      ...overrideList,
    ]

    return products
  }
  const mountProductsList = async (
    quantity = 10,
    overrides = [],
    shouldReject = false
  ) => {
    const products = await getProducts(quantity, overrides)

    if (shouldReject) {
      axios.get.mockReturnValue(Promise.reject(new Error('')))
    } else {
      axios.get.mockReturnValue(Promise.resolve({ data: { products } }))
    }

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    })

    await Vue.nextTick()

    return {
      wrapper,
      products,
    }
  }

  it('should mount the component', async () => {
    const { wrapper } = await mountProductsList()

    expect(wrapper.vm).toBeDefined()
  })

  it('should mount rhe Search component as a child', async () => {
    const { wrapper } = await mountProductsList()

    expect(wrapper.findComponent(Search)).toBeDefined()
  })

  it('should call axios.get  on component mount', async () => {
    await mountProductsList()

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('/api/products')
  })

  it('should mount rhe ProductCard component 10 times', async () => {
    const { wrapper } = await mountProductsList()

    const cards = wrapper.findAllComponents(ProductCard)

    expect(cards).toHaveLength(10)
  })

  it('should display the error message when Promisse rejects', async () => {
    const { wrapper } = await mountProductsList(10, [], true)

    expect(wrapper.text()).toContain('Problemas ao carregar a lista')
  })

  it('should filter the product list when a search is performed', async () => {
    // Arrange
    const { wrapper } = await mountProductsList(10, [
      {
        title: 'Meu relógio amado',
      },
      {
        title: 'Meu relógio estimado',
      },
    ])

    // act
    const search = wrapper.findComponent(Search)
    search.find('input[type="search"]').setValue('relógio')
    await search.find('form').trigger('submit')

    // Assert
    const cards = wrapper.findAllComponents(ProductCard)

    expect(wrapper.vm.searchTerm).toEqual('relógio')
    expect(cards).toHaveLength(2)
  })

  it('should filter the product list when a search is performed', async () => {
    // Arrange
    const { wrapper } = await mountProductsList(10, [
      { title: 'Meu relógio amado' },
    ])

    // act
    const search = wrapper.findComponent(Search)

    search.find('input[type="search"]').setValue('relógio')
    await search.find('form').trigger('submit')

    search.find('input[type="search"]').setValue('')
    await search.find('form').trigger('submit')

    // Assert
    const cards = wrapper.findAllComponents(ProductCard)

    expect(wrapper.vm.searchTerm).toEqual('')
    expect(cards).toHaveLength(11)
  })
})
