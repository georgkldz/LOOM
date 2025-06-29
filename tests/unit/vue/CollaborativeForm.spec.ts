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
        submit: { state: { isValid: true, isCorrect: true } }
      }
    },

    /* simple Validation-Config, damit validate() keinen Pfad vermisst */
    validationConfiguration: { submitableWhen: 'isValid' }
  }),
  setProperty: () => {}
})

/** 2) Einziger Smoke-Check: wrapper existiert  */
describe('CollaborativeForm.vue – Minimal Smoke Test', () => {
  it('mountet ohne Fehler', () => {
    const wrapper = mount(CollaborativeForm, {
      props: {
        storeObject: makeStore(),
        componentID: 1,
        componentPath: '$.components.form1'
      },
      global: {
        stubs: {
          component: true,          // dynamische Sub-Komponenten
          'q-expansion-item': true  // Quasar-Accordion-Stub
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})
