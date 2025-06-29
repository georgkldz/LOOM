import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import CollaborativeForm from "../../src/components/CollaborativeForm/CollaborativeForm.vue";

const makeStore = () => ({
  getProperty: () => ({
    state: { isValid: true, isCorrect: true },
    dependencies: {},
    /* leere Gruppen, aber Aktion mit gültigem .type! */
    nestedComponents: {
      formComponents: {},
      extraRightComponents: {},
      actionComponents: {
        submit: {
          type : 'div',                     //  ←  wichtig
          state: { isValid: true, isCorrect: true }
        }
      }
    },
    validationConfiguration: { submitableWhen: 'isValid' }
  }),
  setProperty: () => {}
})

describe('CollaborativeForm.vue – Minimal Smoke Test', () => {
  it('mountet ohne Fehler', () => {
    const wrapper = mount(CollaborativeForm, {
      props: {
        storeObject  : makeStore(),
        componentID  : 1,
        componentPath: '$.components.form1'
      },
      global: {
        stubs: { component: true, 'q-expansion-item': true }
      }
    })

    expect(wrapper.exists()).toBe(true)        // ✅ Smoke-Assertion
  })
})