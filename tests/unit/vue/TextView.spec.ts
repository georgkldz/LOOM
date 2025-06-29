// tests/unit/vue/TextView.smoke.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TextView from "../../../src/components/TextView/TextView.vue";
import type { TextSegment } from "../../../src";

/* 1 ── KaTeX komplett stubben (leer) ─────────────────────────────── */
vi.mock('katex', () => ({ default: { renderToString: () => '' } }))

/* 2 ── Winziger Store mit konsistentem Typ ───────────────────────── */
const makeStore = (config: Partial<{
  state: Record<string, any>,
  dependencies: Record<string, any>,
  componentConfiguration: Record<string, any>
}> = {}) => ({
  getProperty: () => ({
    state: {
      fieldValue: '',
      isValid: true,
      isCorrect: true,
      textSegments: [] as TextSegment[],
      ...config.state
    },
    dependencies: {},
    componentConfiguration: {},
    ...config
  }),
  setProperty: vi.fn()
})

/* 3 ── Tests ─────────────────────────────────────────────────────── */
describe('TextView.vue – Erweiterte Tests', () => {
  it('mountet ohne Fehler', () => {
    const wrapper = mount(TextView, {
      props: {
        storeObject: makeStore(),
        componentID: 1,
        componentPath: '$.components.tv1'
      },
      global: {
        stubs: { component: true }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  // Neuer Test: Rendert Textsegmente korrekt
  it('rendert Textsegmente mit Formatierung', async () => {
    const textSegments: TextSegment[] = [
      { text: 'Hello', bold: true },
      { text: ' World!', italic: true },
      { text: ' Test', cssClass: 'test-class' }
    ]

    const store = makeStore({
      state: {
        textSegments: textSegments
      }
    })

    const wrapper = mount(TextView, {
      props: {
        storeObject: store,
        componentID: 2,
        componentPath: '$.components.tv2'
      },
      global: {
        stubs: { component: true }
      }
    })

    // Prüft ob alle Textsegmente gerendert wurden
    expect(wrapper.text()).toBe('Hello World! Test')

    // Prüft Formatierungsklassen
    expect(wrapper.find('.bold-text').exists()).toBe(true)
    expect(wrapper.find('.italic-text').exists()).toBe(true)
    expect(wrapper.find('.test-class').exists()).toBe(true)
  })

  // Neuer Test: Validierung wird aufgerufen
  it('ruft Validierung beim Mount auf', async () => {
    const store = makeStore({
      state: {
        textSegments: [
          { text: 'Test' }
        ]
      }
    })

    mount(TextView, {
      props: {
        storeObject: store,
        componentID: 3,
        componentPath: '$.components.tv3'
      },
      global: {
        stubs: { component: true }
      }
    })

    // Prüft ob setProperty aufgerufen wurde
    expect(store.setProperty).toHaveBeenCalled()
  })
})