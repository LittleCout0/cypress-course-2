import 'cypress-localstorage-commands'

Cypress.Commands.add('assertLoadingIsShownAndHidden', () => {
  cy.contains('Loading ...').should('be.visible')
  cy.contains('Loading ...').should('not.exist')
})

Cypress.Commands.add('assertRequestGetStoriesIsFinished', () => {
  cy.intercept({
    method: 'GET',
    pathname: '**/search',
    query: {
      query: 'React',
      page: '0',
    },
  }).as('getStories')
})

Cypress.Commands.add('assertRequestMoreStoriesIsFinished', () => {
  cy.intercept({
    method: 'GET',
    pathname: '**/search',
    query: {
      query: 'React',
      page: '1',
    },
  }).as('getMoreStories')
})

Cypress.Commands.add('assertRequestNewTermStoriesIsFinished', newTerm => {
  cy.intercept('GET', `**/search?query=${newTerm}&page=0`).as(
    'getNewTermStories'
  )
})

Cypress.Commands.add('assertRequestRandomStoriesIsFinished', () => {
  cy.intercept('GET', '**/search**').as('getRandomStories')
})

Cypress.Commands.add('simulateServerError', () => {
  cy.intercept('GET', '**/search**', { statusCode: 500 }).as('serverError')
})

Cypress.Commands.add('simulateNetworkError', () => {
  cy.intercept('GET', '**/search**', { forceNetworkError: true }).as(
    'networkError'
  )
})

Cypress.Commands.add('fixtureStories', searchTerm => {
  cy.intercept('GET', `**/search?query=${searchTerm}&page=0`, {
    fixture: 'stories',
  }).as('getFixtureStories')
})

Cypress.Commands.add('fixtureEmpty', searchTerm => {
  cy.intercept('GET', `**/search?query=${searchTerm}&page=0`, {
    fixture: 'empty',
  }).as('getFixtureEmpty')
})
