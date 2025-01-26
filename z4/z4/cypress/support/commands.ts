// Custom commands can be added here
Cypress.Commands.add('fillForm', (data: {
  firstName: string;
  lastName: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  dateOfBirth: { day: string; month: string; year: string };
  subjects: string[];
  hobbies: ('Sports' | 'Reading' | 'Music')[];
  address: string;
  state: string;
  city: string;
}) => {
  cy.get('#firstName').type(data.firstName)
  cy.get('#lastName').type(data.lastName)
  cy.get('#userEmail').type(data.email)
  
  // More specific gender selection
  const genderMap = { Male: '1', Female: '2', Other: '3' }
  cy.get(`input[name="gender"][value="${data.gender}"]`).check({force: true})
  
  cy.get('#userNumber').type(data.mobile)
  
  // Date of birth - more specific selector
  cy.get('#dateOfBirthInput').click()
  cy.get('.react-datepicker__month-select').select(data.dateOfBirth.month)
  cy.get('.react-datepicker__year-select').select(data.dateOfBirth.year)
  cy.get(`.react-datepicker__day--0${data.dateOfBirth.day}:not(.react-datepicker__day--outside-month)`).first().click()
  
  // Subjects
  data.subjects.forEach(subject => {
    cy.get('#subjectsInput').type(`${subject}{enter}`)
  })
  
  // Hobbies
  data.hobbies.forEach(hobby => {
    const hobbyMap = { Sports: '1', Reading: '2', Music: '3' }
    cy.get(`#hobbies-checkbox-${hobbyMap[hobby]}`).check({force: true})
  })
  
  cy.get('#currentAddress').type(data.address)
  
  // State and City
  cy.get('#state').click()
  cy.get(`#react-select-3-option-${data.state}`).click()
  cy.get('#city').click()
  cy.get(`#react-select-4-option-${data.city}`).click()
}) 