describe('Hacker Stories', () => {
  const initialTerm = 'React'
  const newTerm = 'Cypress'

  context('Hitting the real API', () => {
    beforeEach(() => {
      cy.assertRequestGetStoriesIsFinished()
      cy.visit('/')
      cy.wait('@getStories')
      cy.contains('More').should('be.visible')
    })

    it('shows 20 stories, then the next 20 after clicking "More"', () => {
      cy.assertRequestMoreStoriesIsFinished()
      cy.get('.item').should('have.length', 20)
      cy.contains('More').click()
      cy.wait('@getMoreStories')
      cy.get('.item').should('have.length', 40)
    })

    it('searches via the last searched term', () => {
      cy.assertRequestNewTermStoriesIsFinished(newTerm)

      cy.get('#search').clear().type(`${newTerm}{enter}`)
      cy.wait('@getNewTermStories')
      cy.get(`button:contains(${initialTerm})`).should('be.visible').click()
      cy.wait('@getStories')
      cy.get('.item').should('have.length', 20)
      cy.get('.item').first().should('contain', initialTerm)
      cy.get(`button:contains(${newTerm})`).should('be.visible')
    })

    it('shows a max of 5 buttons for the last searched terms', () => {
      const faker = require('faker')
      cy.assertRequestRandomStoriesIsFinished()

      Cypress._.times(6, () => {
        cy.get('#search').clear().type(`${faker.random.word()}{enter}`)
        cy.wait('@getRandomStories')
      })
      cy.get('.last-searches button').should('have.length', 5)
    })

    it('shows only nineteen stories after dimissing the first story', () => {
      cy.get('.button-small').first().click()

      cy.get('.item').should('have.length', 19)
    })

    it('types and hits ENTER', () => {
      cy.assertRequestNewTermStoriesIsFinished(newTerm)
      cy.get('#search').clear().type(`${newTerm}{enter}`)
      cy.wait('@getNewTermStories')
      cy.get('.item').should('have.length', 20)
      cy.get('.item').first().should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`).should('be.visible')
    })

    it('types and clicks the submit button', () => {
      cy.assertRequestNewTermStoriesIsFinished(newTerm)

      cy.get('#search').clear().type(newTerm)
      cy.contains('Submit').click()
      cy.wait('@getNewTermStories')
      cy.get('.item').should('have.length', 20)
      cy.get('.item').first().should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`).should('be.visible')
    })

    it('shows the footer', () => {
      cy.get('footer')
        .should('be.visible')
        .and('contain', 'Icons made by Freepik from www.flaticon.com')
    })
  })

  context('Hacker Stories - Mock Errors', () => {
    it('shows "Something went wrong ..." in case of a server error', () => {
      cy.simulateServerError()
      cy.visit('/')
      cy.wait('@serverError')
      cy.contains('Something went wrong ...').should('be.visible')
    })

    it('shows "Something went wrong ..." in case of a network error', () => {
      cy.simulateNetworkError()
      cy.visit('/')
      cy.wait('@networkError')
      cy.contains('Something went wrong ...').should('be.visible')
    })
  })

  context('Hacker Stories - Mock API', () => {
    context('List of stories', () => {
      beforeEach(() => {
        cy.fixtureStories(initialTerm)
        cy.visit('/')
        cy.wait('@getFixtureStories')
      })

      it('shows one less story after dimissing the first storie', () => {
        cy.get('.button-small').first().click()
        cy.get('.item').should('have.length', 2)
      })

      it('shows the right data for all rendered stories', () => {
        cy.get('.item').should('have.length', 3)
      })
    })

    context('Search', () => {
      beforeEach(() => {
        cy.fixtureEmpty(initialTerm)
        cy.fixtureStories(newTerm)
        cy.visit('/')
        cy.get('#search').clear()
      })

      it('types and hits ENTER with mocked data', () => {
        cy.get('#search').type(`${newTerm}{enter}`)
        cy.wait('@getFixtureStories')
        cy.get('.item').should('have.length', 3)
        cy.get(`button:contains(${initialTerm})`).should('be.visible')
      })

      it('types and clicks the submit button', () => {
        cy.get('#search').clear().type(newTerm)
        cy.contains('Submit').click()
        cy.wait('@getFixtureStories')
        cy.get('.item').should('have.length', 3)
        cy.get(`button:contains(${initialTerm})`).should('be.visible')
      })
    })

    context('Last searches', () => {
      it('shows a max of 5 buttons for the last searched term', () => {
        const faker = require('faker')

        cy.intercept('GET', '**/search**', { fixture: 'empty' }).as(
          'emptyFixture'
        )
        cy.visit('/')
        Cypress._.times(6, () => {
          cy.get('#search').clear().type(`${faker.random.word()}{enter}`)
          cy.wait('@emptyFixture')
        })
        cy.get('.last-searches button').should('have.length', 5)
      })
    })
  })

  context('List of stories', () => {
    // Since the API is external,
    // I can't control what it will provide to the frontend,
    // and so, how can I assert on the data?
    // This is why this test is being skipped.
    // TODO: Find a way to test it out.

    // Since the API is external,
    // I can't control what it will provide to the frontend,
    // and so, how can I test ordering?
    // This is why these tests are being skipped.
    // TODO: Find a way to test them out.
    context.skip('Order by', () => {
      it('orders by title', () => {})

      it('orders by author', () => {})

      it('orders by comments', () => {})

      it('orders by points', () => {})
    })
  })
})
