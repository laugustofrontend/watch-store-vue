/// <reference types="cypress" />
/* eslint-disable no-undef */

import { makeServer } from '../../miragejs/server'

context('Store', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should display the store', () => {
    cy.visit('/')

    cy.get('body').contains('Brand')
    cy.get('body').contains('Wrist Watch')
  })

  context('Store > Search for products', () => {
    it('should type in the search field', () => {
      cy.visit('/')

      cy.get('input[type="search"')
        .type('Some text here')
        .should('have.value', 'Some text here')
    })

    it('should return 1 product when "Relógio Bonito" is used as search term', () => {
      server.create('product', {
        title: 'Relógio bonito',
      })
      server.createList('product', 10)

      cy.visit('/')
      cy.get('input[type="search"').type('Relógio bonito')
      cy.get('[data-testid="search-form"]').submit()
      cy.get('[data-testid="product-card"]').should('have.length', 1)
    })

    it('should type in the search field', () => {
      server.createList('product', 10)

      cy.visit('/')
      cy.get('input[type="search"').type('Relógio bonito')
      cy.get('[data-testid="search-form"]').submit()
      cy.get('[data-testid="product-card"]').should('have.length', 0)
      cy.get('body').contains('0 Products')
    })
  })

  context('Store > Product List', () => {
    it('should display "0 Products" when no product is returned', () => {
      cy.visit('/')
      cy.get('[data-testid="product-card"]').should('have.length', 0)
      cy.get('body').contains('0 Product')
    })

    it('should display "1 Products" when 1 product is returned', () => {
      server.create('product')

      cy.visit('/')
      cy.get('[data-testid="product-card"]').should('have.length', 1)
      cy.get('body').contains('1 Product')
    })

    it('should display "10 Products" when 10 product is returned', () => {
      server.createList('product', 10)

      cy.visit('/')
      cy.get('[data-testid="product-card"]').should('have.length', 10)
      cy.get('body').contains('10 Products')
    })
  })

  context('Store > Shopping Cart', () => {
    it('should not display shopping cart when page first loads', () => {
      cy.visit('/')
      cy.get('[data-testid="shopping-cart"]').should('have.class', 'hidden')
    })

    it('should toggle shopping cart visibility when button is clicked', () => {
      cy.visit('/')
      cy.get('[data-testid="toggle-button"]').as('toggleButton')

      cy.get('@toggleButton').click()
      cy.get('[data-testid="shopping-cart"]').should('have.not', 'hidden')

      cy.get('@toggleButton').click({ force: true })
      cy.get('[data-testid="shopping-cart"]').should('have.class', 'hidden')
    })
  })
})
