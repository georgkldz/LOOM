// tests/unit/vue/TextView.smoke.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TextView from "../../../src/components/TextView/TextView.vue";

/* 1 ── KaTeX komplett stubben (leer) ─────────────────────────────── */
vi.mock('katex', () => ({ default: { renderToString: () => '' } }))

/* 2 ── Winziger Store: liefert immer ein knappes Serialisat ──────── */
const makeStore = () => ({
  getProperty: () => ({
    state: { fieldValue: '', isValid: true, isCorrect: true },
    dependencies: {},
    componentConfiguration: {}
  }),
  setProperty: () => {}
})

/* 3 ── Einzige Smoke-Assertion ───────────────────────────────────── */
describe('TextView.vue – Minimal Smoke Test', () => {
  it('mountet ohne Fehler', () => {
    const wrapper = mount(TextView, {
      props: {
        storeObject: makeStore(),
        componentID: 1,
        componentPath: '$.components.tv1'
      },
      global: {
        stubs: { component: true }           // reserviertes <component> stubben
      }
    })

    expect(wrapper.exists()).toBe(true)      // ✔ Smoke-Check
  })
})
