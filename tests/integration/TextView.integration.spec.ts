import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import TextView from "../../src/components/TextView/TextView.vue";

vi.mock('katex', () => ({
  default: { renderToString: () => '' }   // default-Schlüssel nötig :contentReference[oaicite:3]{index=3}
}))

/* 2 ▸ Mini-Store liefert immer ein minimales Serialisat */
const makeStore = () => ({
  getProperty: () => ({
    state: { fieldValue: '', isValid: true, isCorrect: true },
    dependencies: {},
    componentConfiguration: {}
  }),
  setProperty: () => {}
})

/* 3 ▸ Smoke-Suite – eine Assertion reicht */
describe('TextView.vue – Minimal Smoke Test', () => {
  it('mountet ohne Fehler', () => {
    const wrapper = mount(TextView, {
      props: {
        storeObject : makeStore(),
        componentID : 1,                       // Number statt String – Prop-Typ ok
        componentPath: '$.components.tv1'
      },
      global: {
        stubs: { component: true }             // reserviertes Tag stubben :contentReference[oaicite:4]{index=4}
      }
    })

    expect(wrapper.exists()).toBe(true)        // Smoke-Assertion
  })
})