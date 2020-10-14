// Copyright © 2020 The Things Network Foundation, The Things Industries B.V.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

describe('Gateway general settings', () => {
  let user
  let gateway

  before(() => {
    cy.dropAndSeedDatabase()
    user = {
      ids: { user_id: 'gtw-settings-test-user' },
      primary_email_address: 'gtw-settings-test-user@example.com',
      password: 'ABCDefg123!',
      password_confirm: 'ABCDefg123!',
    }
    cy.createUser(user)
    gateway = {
      ids: { gateway_id: 'test-gateway', eui: '0000000000000000' },
      name: 'Test Gateway',
      description: 'Gateway for testing gateway general settings',
      schedule_anytime_delay: '523ms',
      enforce_duty_cycle: true,
      gateway_server_address: 'localhost',
    }
  })

  it('displays gateway values that are set', () => {
    cy.loginConsole({ user_id: user.ids.user_id, password: user.password })
    cy.createGateway(gateway, user.ids.user_id)
    cy.visit(
      `${Cypress.config('consoleRootPath')}/gateways/${gateway.ids.gateway_id}/general-settings`,
    )
    cy.findByText('General settings', { selector: 'h1' }).should('be.visible')
    cy.findByText('Basic settings', { selector: 'h3' }).should('be.visible')
    cy.findByText('General settings, gateway updates and metadata', { selector: 'p' }).should(
      'be.visible',
    )
    cy.findByText('General settings', { selector: 'h4' }).should('be.visible')
    cy.findByLabelText('Gateway ID')
      .should('be.disabled')
      .and('have.attr', 'value')
      .and('eq', gateway.ids.gateway_id)
    cy.findByLabelText('Gateway EUI')
      .should('not.be.disabled')
      .and('have.attr', 'value')
      .and('eq', gateway.ids.eui)
    cy.findByLabelText('Gateway Name')
      .should('be.visible')
      .and('have.attr', 'value')
      .and('eq', gateway.name)
    cy.findByLabelText('Gateway description')
      .should('be.visible')
      .and('have.text', gateway.description)
    cy.findDescriptionByLabelText('Gateway description')
      .should(
        'contain',
        'Optional gateway description; can also be used to save notes about the gateway',
      )
      .and('be.visible')
    cy.findByLabelText('Gateway Server address')
      .should('be.visible')
      .and('have.attr', 'value', gateway.gateway_server_address)
    cy.findDescriptionByLabelText('Gateway Server address')
      .should('contain', 'The address of the Gateway Server to connect to')
      .and('be.visible')
    cy.findDescriptionByLabelText('Automatic updates')
      .should('contain', 'Gateway can be updated automatically')
      .and('be.visible')
    cy.findByLabelText('Channel')
      .should('be.visible')
      .and('have.attr', 'placeholder')
      .and('eq', 'Stable')
    cy.findDescriptionByLabelText('Channel')
      .should('contain', 'Channel for gateway automatic updates')
      .and('be.visible')
    cy.findByText('LoRaWAN options', { selector: 'h3' }).should('be.visible')
    cy.findByText('LoRaWAN network-layer settings', { selector: 'p' }).should('be.visible')
    cy.findByLabelText('Frequency plan').should('not.exist')
    cy.findByRole('button', { name: 'Expand' }).click()
    cy.findByLabelText('Frequency plan').should('be.visible')
    cy.findByLabelText('Duty cycle')
      .should('be.visible')
      .and('have.attr', 'value', 'true')
    cy.findDescriptionByLabelText('Duty cycle')
      .should('contain', 'Recommended for all gateways in order to respect spectrum regulations')
      .and('be.visible')
    cy.findByTestId('unit-input')
      .should('be.visible')
      .and('have.attr', 'value', '0.523')
    cy.findByRole('button', { name: 'Save changes' }).should('be.visible')
    cy.findByRole('button', { name: /Delete gateway/ }).should('be.visible')
  })

  it('shows warning modal on click delete button', () => {
    cy.loginConsole({ user_id: user.ids.user_id, password: user.password })
    cy.visit(
      `${Cypress.config('consoleRootPath')}/gateways/${gateway.ids.gateway_id}/general-settings`,
    )
    cy.findByRole('button', { name: /Delete gateway/ }).click()
    cy.findByTestId('modal-window')
      .should('be.visible')
      .within(() => {
        cy.findByText('Delete gateway', { selector: 'h1' }).should('be.visible')
        cy.findByText(
          `Are you sure you want to delete "${gateway.name}"? This action cannot be undone and it will not be possible to reuse the gateway ID.`,
        ).should('be.visible')

        cy.findByRole('button', { name: /Cancel/ }).should('be.visible')
        cy.findByRole('button', { name: /Delete gateway/ }).should('be.visible')
      })
  })
})
