/// <reference types="cypress" />
/* eslint-disable no-undef */

import { makeServer } from '../../miragejs/server'

context('Store', () => {
  let server
  const g = cy.get

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should display the store', () => {
    cy.visit('/')

    g('body').contains('Brand')
    g('body').contains('Wrist Watch')
  })

  context('Store > Search for products', () => {
    it('should type in the search field', () => {
      cy.visit('/')

      g('input[type="search"')
        .type('Some text here')
        .should('have.value', 'Some text here')
    })

    it('should return 1 product when "Relógio Bonito" is used as search term', () => {
      server.create('product', {
        title: 'Relógio bonito',
      })
      server.createList('product', 10)

      cy.visit('/')
      g('input[type="search"').type('Relógio bonito')
      g('[data-testid="search-form"]').submit()
      g('[data-testid="product-card"]').should('have.length', 1)
    })

    it('should type in the search field', () => {
      server.createList('product', 10)

      cy.visit('/')
      g('input[type="search"').type('Relógio bonito')
      g('[data-testid="search-form"]').submit()
      g('[data-testid="product-card"]').should('have.length', 0)
      g('body').contains('0 Products')
    })
  })

  context('Store > Product List', () => {
    it('should display "0 Products" when no product is returned', () => {
      cy.visit('/')
      g('[data-testid="product-card"]').should('have.length', 0)
      g('body').contains('0 Product')
    })

    it('should display "1 Products" when 1 product is returned', () => {
      server.create('product')

      cy.visit('/')
      g('[data-testid="product-card"]').should('have.length', 1)
      g('body').contains('1 Product')
    })

    it('should display "10 Products" when 10 product is returned', () => {
      server.createList('product', 10)

      cy.visit('/')
      g('[data-testid="product-card"]').should('have.length', 10)
      g('body').contains('10 Products')
    })
  })

  context('Store > Shopping Cart', () => {
    it('should not display shopping cart when page first loads', () => {
      cy.visit('/')
      g('[data-testid="shopping-cart"]').should('have.class', 'hidden')
    })

    it('should toggle shopping cart visibility when button is clicked', () => {
      cy.visit('/')
      g('[data-testid="toggle-button"]').as('toggleButton')

      g('@toggleButton').click()
      g('[data-testid="shopping-cart"]').should('have.not', 'hidden')

      g('@toggleButton').click({ force: true })
      g('[data-testid="shopping-cart"]').should('have.class', 'hidden')
    })
  })
})
