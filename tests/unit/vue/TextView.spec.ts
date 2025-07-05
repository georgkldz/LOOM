import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TextView from "../../../src/components/TextView/TextView.vue";
import type { TextSegment } from "../../../src";


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

    expect(store.setProperty).toHaveBeenCalled()
  })


  it('ruft Validierung erneut auf, wenn sich Textsegmente ändern', async () => {
    // 1. Initialer Zustand
    const initialStore = makeStore({
      state: { textSegments: [{ text: 'Initialer Text' }] }
    });

    const wrapper = mount(TextView, {
      props: {
        storeObject: initialStore,
        componentID: 4,
        componentPath: '$.components.tv4'
      },
      global: { stubs: { component: true } }
    });

    // Zähler der Aufrufe nach dem Mounten zurücksetzen
    initialStore.setProperty.mockClear();

    // 2. Neuer Store mit geänderten Segmenten
    const updatedStore = makeStore({
      state: { textSegments: [{ text: 'Aktualisierter Text' }] }
    });

    // 3. Komponente mit neuen Props aktualisieren, um den Watcher zu triggern
    await wrapper.setProps({ storeObject: updatedStore });

    // 4. Überprüfen, ob die Validierung (via setProperty) durch den Watcher erneut aufgerufen wurde
    expect(updatedStore.setProperty).toHaveBeenCalled();
  });
})