describe('Note app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Huong Do',
      username: 'justkidney',
      password: 'secretpass',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('front page can be opened', function () {
    cy.contains('Notes')
    cy.contains(
      'Note app, Department of Computer Science, University of Helsinki, 2023'
    )
  })

  it('user can login', function () {
    cy.contains('log in').click()
    cy.get('#username').type('justkidney')
    cy.get('#password').type('secretpass')
    cy.get('#login-button').click()

    cy.contains('Huong Do logged in')
  })

  it('login fails with wrong password', function () {
    cy.contains('log in').click()
    cy.get('#username').type('justkidney')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error').contains('Wrong credentials')
    cy.get('.error')
      .should('contain', 'Wrong credentials') // same as above
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Huong Do logged in')
    cy.contains('Huong Do logged in').should('not.exist')
    // common assertions used with 'should' can be found: https://docs.cypress.io/guides/references/assertions#Common-Assertions
    /* Example of using 'should': make sure that error message is red and has border
    cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    cy.get('.error').should('have.css', 'border-style', 'solid')
    */
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'justkidney', password: 'secretpass' })
    })

    it('a new note can be created', function () {
      cy.get('.toggle').contains('new note').click()
      cy.get('#note-form').type('a note created by cypress')
      cy.contains('save').click()

      cy.contains('a note created by cypress')
    })

    describe('and several notes exist', function () {
      beforeEach(function () {
        cy.createNote({
          content: 'first note',
          important: false,
        })
        cy.createNote({
          content: 'second note',
          important: false,
        })
        cy.createNote({
          content: 'third note',
          important: false,
        })
      })

      it('one of those can be made important', function () {
        cy.contains('second note').contains('make important').click()
        /* the following can be used if 'second note' is not in the same component as the 'make important' button
        we have to use 'find', not 'get', because 'get' searches the whole page while 'find' only search within the component
        'as' assigns name which can be used later with @ */

        // cy.contains('second note').parent().find('button').as('theButton')
        // cy.get('@theButton').click()
        cy.contains('second note').contains('make not important')
      })
    })
  })
})
