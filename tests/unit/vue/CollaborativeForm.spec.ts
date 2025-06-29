// tests/unit/vue/CollaborativeForm.smoke.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CollaborativeForm from "../../../src/components/CollaborativeForm/CollaborativeForm.vue";

/** 1) Mini-Store – liefert immer das gleiche Basisserialisat  */
const makeStore = () => ({
  getProperty: () => ({
    /* minimales State-Objekt */
    state: { isValid: true, isCorrect: true },

    /* leere Dependencies – werden trotzdem gefunden */
    dependencies: {},

    /* alle verschachtelten Gruppen als leere Objekte */
    nestedComponents: {
      formComponents: {},
      extraRightComponents: {},
      actionComponents: {
        submit: {
          type: 'GenericButton',  // 👈 Typ hinzugefügt
          state: { isValid: true, isCorrect: true }
        }
      }
    },

    /* simple Validation-Config, damit validate() keinen Pfad vermisst */
    validationConfiguration: { submitableWhen: 'isValid' }
  }),
  setProperty: () => {}
})

/** 2) Erweiterter Store mit einem Beispiel-Feld in der rechten Spalte */
const makeStoreWithRightField = () => ({
  getProperty: () => ({
    state: { isValid: true, isCorrect: true },
    dependencies: {},
    nestedComponents: {
      formComponents: {},
      extraRightComponents: {
        testField: {
          type: 'InputField',
          state: { fieldValue: 'Test' }
        }
      },
      actionComponents: {
        submit: {
          type: 'GenericButton',  // 👈 Typ hinzugefügt
          state: { isValid: true, isCorrect: true }
        }
      }
    },
    validationConfiguration: { submitableWhen: 'isValid' }
  }),
  setProperty: () => {}
})

describe('CollaborativeForm.vue – Erweiterte Tests', () => {
  it('mountet ohne Fehler', () => {
    const wrapper = mount(CollaborativeForm, {
      props: {
        storeObject: makeStore(),
        componentID: 1,
        componentPath: '$.components.form1'
      },
      global: {
        stubs: {
          component: true,
          'q-expansion-item': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  // Neuer Test: Rechte Spalte mit Feld
  it('rendert Komponenten in der rechten Spalte', () => {
    const wrapper = mount(CollaborativeForm, {
      props: {
        storeObject: makeStoreWithRightField(),
        componentID: 1,
        componentPath: '$.components.form1'
      },
      global: {
        stubs: {
          'q-expansion-item': true,
          InputField: { template: '<div class="test-field">Test Field</div>' }
        }
      }
    })

    // Prüft ob das Testfeld gerendert wurde
    expect(wrapper.find('.test-field').exists()).toBe(true)
    expect(wrapper.find('.test-field').text()).toBe('Test Field')
  })

  // Neuer Test: Submit-Button wird gerendert
  it('rendert den Submit-Button', () => {
    const wrapper = mount(CollaborativeForm, {
      props: {
        storeObject: makeStore(),
        componentID: 1,
        componentPath: '$.components.form1'
      },
      global: {
        stubs: {
          'q-expansion-item': true,
          GenericButton: { template: '<button class="submit-btn">Submit</button>' }
        }
      }
    })

    // Prüft ob der Submit-Button existiert und den richtigen Text hat
    expect(wrapper.find('.submit-btn').exists()).toBe(true)
    expect(wrapper.find('.submit-btn').text()).toBe('Submit')
  })
})