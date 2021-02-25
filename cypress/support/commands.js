/* eslint-disable no-undef */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('getByTestId', (selector) => {
  return cy.get(`[data-testid="${selector}"]`)
})

Cypress.Commands.add('addToCart', (mode) => {
  cy.getByTestId('product-card').as('productCards')

  const click = (index) => {
    cy.get('@productCards')
      .eq(index)
      .find('button')
      .click({ force: true, multiple: true })
  }

  const addByIndexes = () => {
    for (const index in mode) {
      click(index)
    }
  }

  const addByIndex = () => click(mode)

  const addAll = () => {
    cy.get('@productCards')
      .find('button')
      .click({ force: true, multiple: true })
  }

  if (Array.isArray(mode)) {
    addByIndexes()
  } else if (typeof mode === 'number') {
    addByIndex()
  } else if (typeof mode === 'string' && mode === 'all') {
    addAll()
  } else {
    throw new Error(
      'please provide a valid input for cy.addToCart()\r\nPossible value are Array, number or "all"'
    )
  }
})
