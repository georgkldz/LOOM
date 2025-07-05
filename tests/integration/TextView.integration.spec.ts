import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import TextView from "../../src/components/TextView/TextView.vue";
import type { TextSegment } from "../../src";

// Mock für die KaTeX-Bibliothek, um externe Abhängigkeiten zu vermeiden
vi.mock('katex', () => ({
  default: { renderToString: () => '' }
}))

// Ein flexiblerer Store-Mock, der das Setzen von Test-Daten erlaubt
const makeStore = (stateData: Partial<{ textSegments: TextSegment[] }> = {}) => ({
  getProperty: () => ({
    // Standardwerte werden mit den übergebenen Test-Daten überschrieben
    state: {
      fieldValue: '',
      isValid: true,
      isCorrect: true,
      textSegments: [],
      ...stateData
    },
    dependencies: {},
    componentConfiguration: {}
  }),
  // Wir erstellen einen Spy für setProperty, um Aufrufe zu verfolgen
  setProperty: vi.fn()
})

describe('TextView.vue – Erweiterte Tests', () => {

  it('mountet ohne Fehler (Smoke-Test)', () => {
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

  // Neuer Test: Validiert das korrekte Rendern und Formatieren von Textsegmenten
  it('rendert Textsegmente korrekt mit der richtigen Formatierung', () => {
    const testSegments: TextSegment[] = [
      { text: 'Fetter Text, ', bold: true },
      { text: 'kursiver Text, ', italic: true },
      { text: 'normaler Text.' }
    ];

    const store = makeStore({ textSegments: testSegments });

    const wrapper = mount(TextView, {
      props: {
        storeObject: store,
        componentID: 2,
        componentPath: '$.components.tv2'
      }
    });

    // 1. Prüfen, ob der gesamte Text korrekt zusammengesetzt wird
    expect(wrapper.text()).toBe('Fetter Text, kursiver Text, normaler Text.');

    // 2. Prüfen, ob die korrekten CSS-Klassen für die Formatierung angewendet wurden
    const boldSpan = wrapper.find('.bold-text');
    expect(boldSpan.exists()).toBe(true);
    expect(boldSpan.text()).toBe('Fetter Text,');

    const italicSpan = wrapper.find('.italic-text');
    expect(italicSpan.exists()).toBe(true);
    expect(italicSpan.text()).toBe('kursiver Text,');
  })

  // Neuer Test: Stellt sicher, dass die Validierung beim ersten Rendern aufgerufen wird
  it('ruft die Validierung beim Mounten der Komponente auf', () => {
    const store = makeStore({ textSegments: [{ text: 'Initialer Text' }] });

    mount(TextView, {
      props: {
        storeObject: store,
        componentID: 3,
        componentPath: '$.components.tv3'
      }
    });

    // Wir prüfen, ob die `setProperty`-Methode aufgerufen wurde, was durch die `validate`-Funktion geschieht.
    expect(store.setProperty).toHaveBeenCalled();
  });

  // Neuer Test: Stellt sicher, dass die Validierung bei Datenänderungen erneut aufgerufen wird (testet den `watch`-Hook)
  it('ruft die Validierung erneut auf, wenn sich die Textsegmente ändern', async () => {
    const store = makeStore({ textSegments: [{ text: 'Alter Text' }] });
    const wrapper = mount(TextView, {
      props: {
        storeObject: store,
        componentID: 4,
        componentPath: '$.components.tv4'
      }
    });

    // Zähler der Aufrufe zurücksetzen
    store.setProperty.mockClear();

    // Eine neue Store-Instanz mit geänderten Daten erstellen
    const updatedStore = makeStore({ textSegments: [{ text: 'Neuer Text' }] });

    // Die Props der Komponente aktualisieren, um den `watch`-Hook auszulösen
    await wrapper.setProps({ storeObject: updatedStore });

    // Prüfen, ob `setProperty` auf dem *neuen* Store aufgerufen wurde
    expect(updatedStore.setProperty).toHaveBeenCalled();
  });
})
