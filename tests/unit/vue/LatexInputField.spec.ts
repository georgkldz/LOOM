// tests/unit/vue/LatexInputField.smoke.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LatexInputField from "../../../src/components/LatexInputField/LatexInputField.vue";

/* katex komplett stubben */
vi.mock('katex', () => ({ default: { renderToString: () => '' } }))

/* winziger Store – ein Objekt für jeden Pfad */
const makeStore = () => ({
  getProperty: () => ({
    state: { fieldValue: '', isValid: true, isCorrect: true },
    dependencies: {},
    componentConfiguration: {}
  }),
  setProperty: () => {}
})

describe('LatexInputField.vue – Minimal Smoke Test', () => {
  it('mountet ohne Fehler', () => {
    const wrapper = mount(LatexInputField, {
      props: {
        storeObject: makeStore(),
        componentID: 1,
        componentPath: '$.components.1'
      },
      global: {
        stubs: { QInput: true, component: true } // völlig leere Stubs
      }
    })

    // EINZIGE ASSERTION
    expect(wrapper.exists()).toBe(true)
  })
})
