describe('Hacker Stories', () => {
  const faker = require('faker')
  const initialTerm = 'React'
  const newTerm = 'Cypress'

  context('Requests on real API', () => {
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

    it('searches for the last searched term', () => {
      cy.assertRequestNewTermStoriesIsFinished(newTerm)

      cy.get('#search').should('be.visible').clear().type(`${newTerm}{enter}`)
      cy.wait('@getNewTermStories')

      cy.getLocalStorage('search').should('be.equal', newTerm)

      cy.get(`button:contains(${initialTerm})`).should('be.visible').click()
      cy.wait('@getStories')

      cy.getLocalStorage('search').should('be.equal', initialTerm)

      cy.get('.item').should('have.length', 20)
      cy.get('.item').first().should('contain', initialTerm)
      cy.get(`button:contains(${newTerm})`).should('be.visible')
    })

    it('shows 5 buttons for the last searched terms', () => {
      cy.assertRequestRandomStoriesIsFinished()

      Cypress._.times(6, () => {
        const word = faker.random.word()
        cy.get('#search').should('be.visible').clear().type(`${word}{enter}`)
        cy.wait('@getRandomStories')
        cy.getLocalStorage('search').should('be.equal', word)
      })
      cy.get('.last-searches button').should('have.length', 5)
    })

    it('shows 19 stories after dimissing the first story', () => {
      cy.get('.button-small').first().should('be.visible').click()
      cy.get('.item').should('have.length', 19)
    })

    it(`types "${newTerm}" and hit ENTER`, () => {
      cy.assertRequestNewTermStoriesIsFinished(newTerm)
      cy.get('#search').should('be.visible').clear().type(`${newTerm}{enter}`)
      cy.wait('@getNewTermStories')

      cy.getLocalStorage('search').should('be.equal', newTerm)
      cy.get('.item').should('have.length', 20)
      cy.get('.item').first().should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`).should('be.visible')
    })

    it(`types "${newTerm}" and click on submit button`, () => {
      cy.assertRequestNewTermStoriesIsFinished(newTerm)

      cy.get('#search').should('be.visible').clear().type(newTerm)
      cy.contains('Submit').should('be.visible').click()
      cy.wait('@getNewTermStories')
      cy.getLocalStorage('search').should('be.equal', newTerm)

      cy.get('.item').should('have.length', 20)
      cy.get('.item').first().should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`).should('be.visible')
    })

    it('check the footer page', () => {
      cy.get('footer')
        .should('be.visible')
        .and('contain', 'Icons made by Freepik from www.flaticon.com')
    })
  })

  context('Mock Errors', () => {
    it('show message "Something went wrong ..." in case of a server error', () => {
      cy.simulateServerError()
      cy.visit('/')
      cy.wait('@serverError')
      cy.contains('Something went wrong ...').should('be.visible')
    })

    it('show message "Something went wrong ..." in case of a network error', () => {
      cy.simulateNetworkError()
      cy.visit('/')
      cy.wait('@networkError')
      cy.contains('Something went wrong ...').should('be.visible')
    })
  })

  context('Mock API', () => {
    const stories = require('../fixtures/stories')

    context('List of stories', () => {
      beforeEach(() => {
        cy.fixtureStories(initialTerm)
        cy.visit('/')
        cy.wait('@getFixtureStories')
      })

      it('shows one less story after dimissing the first one', () => {
        cy.get('.button-small').first().should('be.visible').click()
        cy.get('.item').should('have.length', 2)
      })

      it('shows the right data for all rendered stories', () => {
        cy.get('.item').should('have.length', 3)
      })

      it('show the right data for all mocked stories', () => {
        cy.get('.item')
          .first()
          .should('contain', stories.hits[0].title)
          .and('contain', stories.hits[0].author)
          .and('contain', stories.hits[0].num_comments)
          .and('contain', stories.hits[0].points)

        cy.get(`.item a:contains(${stories.hits[0].title})`).should(
          'have.attr',
          'href',
          stories.hits[0].url
        )

        cy.get('.item')
          .last()
          .should('contain', stories.hits[2].title)
          .and('contain', stories.hits[2].author)
          .and('contain', stories.hits[2].num_comments)
          .and('contain', stories.hits[2].points)
        cy.get(`.item a:contains(${stories.hits[2].title})`).should(
          'have.attr',
          'href',
          stories.hits[2].url
        )
      })

      it('show one less story after dismissing the first one', () => {
        cy.get('.button-small').first().should('be.visible').click()
        cy.get('.item').should('have.length', 2)
      })

      context('List order by', () => {
        it('orders by title', () => {
          cy.get('.list-header-button:contains(Title)')
            .should('be.visible')
            .click()

          cy.get('.item')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[0].title)
          cy.get(`.item a:contains(${stories.hits[0].title})`).should(
            'have.attr',
            'href',
            stories.hits[0].url
          )

          cy.get('.list-header-button:contains(Title)').click()
          cy.get('.item')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[2].title)
          cy.get(`.item a:contains(${stories.hits[2].title})`).should(
            'have.attr',
            'href',
            stories.hits[2].url
          )
        })

        it('orders by author', () => {
          cy.get('.list-header-button:contains(Author)')
            .as('authorHeader')
            .should('be.visible')
            .click()

          cy.get('.item')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[0].author)

          cy.get('@authorHeader').click()

          cy.get('.item')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[2].author)
        })

        it('orders by comments', () => {
          cy.get('.list-header-button:contains(Comments)')
            .as('commentsHeader')
            .should('be.visible')
            .click()

          const commentList = stories.hits.map(story => {
            return story.num_comments
          })

          cy.get('.item')
            .first()
            .should('be.visible')
            .and('contain', Cypress._.max(commentList))

          cy.get('@commentsHeader').click()

          cy.get('.item')
            .first()
            .should('be.visible')
            .and('contain', Cypress._.min(commentList))
        })

        it('orders by points', () => {
          const pointsList = stories.hits.map(story => {
            return story.points
          })

          cy.get('.list-header-button:contains(Points)')
            .as('pointsHeader')
            .should('be.visible')
            .click()

          cy.get('.item')
            .first()
            .should('be.visible')
            .and('contain', Cypress._.max(pointsList))

          cy.get('@pointsHeader').click()

          cy.get('.item')
            .first()
            .should('be.visible')
            .and('contain', Cypress._.min(pointsList))
        })
      })
    })

    context('Search box', () => {
      beforeEach(() => {
        cy.fixtureEmpty(initialTerm)
        cy.fixtureStories(newTerm)
        cy.visit('/')
        cy.get('#search').clear()
      })

      it(`type "${newTerm}" and hits ENTER with mocked data`, () => {
        cy.get('#search').should('be.visible').type(`${newTerm}{enter}`)
        cy.wait('@getFixtureStories')
        cy.get('.item').should('have.length', 3)
        cy.get(`button:contains(${initialTerm})`).should('be.visible')
      })

      it(`type "${newTerm}" and click on submit button`, () => {
        cy.get('#search').should('be.visible').clear().type(newTerm)
        cy.contains('Submit').click()
        cy.wait('@getFixtureStories')
        cy.get('.item').should('have.length', 3)
        cy.get(`button:contains(${initialTerm})`).should('be.visible')
      })
    })

    context('Last searches', () => {
      it('shows 5 buttons for the last searched terms', () => {
        cy.intercept('GET', '**/search**', { fixture: 'empty' }).as(
          'emptyFixture'
        )
        cy.visit('/')
        Cypress._.times(6, () => {
          cy.get('#search')
            .should('be.visible')
            .clear()
            .type(`${faker.random.word()}{enter}`)
          cy.wait('@emptyFixture')
        })
        cy.get('.last-searches button').should('have.length', 5)
      })
    })
  })
})
