describe('Form Tests', () => {
  // Prevent Cypress from failing tests on uncaught exceptions
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    return false
  })

  beforeEach(() => {
    cy.visit('/automation-practice-form')
  })

  it('should show validation errors when submitting empty form', () => {
    // Submit empty form
    cy.get('#submit').click()

    // Check for required field validations
    cy.get('#firstName').should('have.css', 'border-color', 'rgb(220, 53, 69)')
    cy.get('#lastName').should('have.css', 'border-color', 'rgb(220, 53, 69)')
    cy.get('input[name="gender"]').should('not.be.checked')
    cy.get('#userNumber').should('have.css', 'border-color', 'rgb(220, 53, 69)')
  })

  it('should validate email format', () => {
    // Try invalid email
    cy.get('#userEmail').type('invalid-email')
    cy.get('#submit').click()
    cy.get('#userEmail').should('have.css', 'border-color', 'rgb(220, 53, 69)')

    // Try valid email
    cy.get('#userEmail').clear().type('valid@email.com')
    cy.get('#userEmail').should('not.have.css', 'border-color', 'rgb(220, 53, 69)')
  })

  it('should validate mobile number format', () => {
    
    // Try valid mobile number
    cy.get('#userNumber').clear().type('1234567890')
    cy.get('#userNumber').should('not.have.css', 'border-color', 'rgb(220, 53, 69)')
  })

  it('should handle date picker correctly', () => {
    // Open date picker
    cy.get('#dateOfBirthInput').click()

    // Select a date
    cy.get('.react-datepicker__month-select').select('January')
    cy.get('.react-datepicker__year-select').select('1990')
    cy.get('.react-datepicker__day--001:not(.react-datepicker__day--outside-month)').first().click()

    // Verify selected date
    cy.get('#dateOfBirthInput').should('have.value', '01 Jan 1990')
  })

  it('should handle subject autocomplete', () => {
    // Type partial subject name
    cy.get('#subjectsInput').type('Mat')
    
    // Select Maths from dropdown
    cy.get('.subjects-auto-complete__menu').contains('Maths').click()
    
    // Verify selection
    cy.get('.subjects-auto-complete__multi-value__label').should('contain', 'Maths')
  })

  it('should handle file upload', () => {
    // Upload a sample image
    cy.get('#uploadPicture').attachFile('sample.jpg')
  })

  it('should handle state and city dependency', () => {
    // Select state
    cy.get('#state').click()
    cy.get('#react-select-3-option-0').click() // Select NCR

    // Verify city dropdown is enabled and has options
    cy.get('#city').should('not.be.disabled')
    cy.get('#city').click()
    cy.get('#react-select-4-option-0').should('exist') // Delhi should exist
  })

  it('should submit form successfully with valid data', () => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      gender: 'Male' as const,
      mobile: '1234567890',
      dateOfBirth: {
        day: '01',
        month: 'January',
        year: '1990'
      },
      subjects: ['Maths'],
      hobbies: ['Sports'] as Array<'Sports' | 'Reading' | 'Music'>,
      address: '123 Test Street',
      state: '0', // NCR
      city: '0' // Delhi
    }

    // Fill form using custom command
    cy.fillForm(formData)

    // Submit form
    cy.get('#submit').click()

    // Verify successful submission
    cy.get('#example-modal-sizes-title-lg').should('contain', 'Thanks for submitting the form')
    cy.get('.table').within(() => {
      cy.contains('td', `${formData.firstName} ${formData.lastName}`)
      cy.contains('td', formData.email)
      cy.contains('td', formData.mobile)
    })
  })
}) 