import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import CollaborativeForm from "../../src/components/CollaborativeForm/CollaborativeForm.vue";

// Stubs für die Kind-Komponenten, um den Test zu isolieren
const GenericButtonStub = {
  name: 'GenericButton',
  template: '<button class="submit-btn" @click="$emit(\'buttonClick\')">Submit</button>',
  props: ['isValid']
};

const InputFieldStub = {
  name: 'InputField',
  template: '<div class="input-field-stub">InputField</div>',
  props: ['readonly']
};

const TextViewStub = {
  name: 'TextView',
  template: '<div class="text-view-stub">TextView</div>'
};

// Ein flexiblerer Store-Mock, der verschiedene Konfigurationen erlaubt
const makeStore = (config: any = {}) => ({
  getProperty: (path: string) => {
    // Ein vereinfachter Pfad-Resolver für die Test-Szenarien
    if (path.includes('submitableWhen')) {
      return config.validationConfiguration?.submitableWhen ?? 'isValid';
    }
    if (path.includes('myCollabRoleId')) {
      return config.myCollabRoleId ?? 0;
    }
    // Standard-Struktur, die mit der übergebenen Konfiguration gemischt wird
    const base = {
      state: { isValid: true, isCorrect: true },
      dependencies: {},
      nestedComponents: {
        formComponents: {},
        extraRightComponents: {},
        actionComponents: {
          submit: { type: 'GenericButton', state: { isValid: true, isCorrect: true } }
        }
      },
      actions: {
        submit: {
          type: 'fetch',
          externalValues: {}
        }
      },
      validationConfiguration: { submitableWhen: 'isValid' },
      ...config
    };
    // Für den Test wird angenommen, dass der Basis-Pfad immer das gesamte Objekt zurückgibt
    return base;
  },
  setProperty: vi.fn()
});


describe('CollaborativeForm.vue – Erweiterte Tests', () => {

  it('mountet ohne Fehler (Smoke-Test)', () => {
    const wrapper = mount(CollaborativeForm, {
      props: {
        storeObject: makeStore(),
        componentID: 1,
        componentPath: '$.components.form1'
      },
      global: {
        stubs: {
          'q-expansion-item': true,
          GenericButton: true // Stubbing des Komponentennamens
        }
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('rendert Komponenten in der rechten Spalte', () => {
    const storeConfig = {
      nestedComponents: {
        formComponents: {},
        extraRightComponents: {
          testField: { type: 'InputField', componentConfiguration: {}, state: { isValid: true, isCorrect: true } }
        },
        actionComponents: {
          submit: { type: 'GenericButton', state: { isValid: true, isCorrect: true } }
        }
      }
    };

    const wrapper = mount(CollaborativeForm, {
      props: {
        storeObject: makeStore(storeConfig),
        componentID: 1,
        componentPath: '$.components.form1'
      },
      global: {
        stubs: {
          'q-expansion-item': true,
          InputField: InputFieldStub, // Verwendung des detaillierten Stubs
          GenericButton: true
        }
      }
    });

    expect(wrapper.find('.input-field-stub').exists()).toBe(true);
  });

  it('wendet die readonly-Logik korrekt auf die rechte Spalte an', () => {
    const storeConfig = {
      myCollabRoleId: 1, // Meine Rolle
      nestedComponents: {
        formComponents: {},
        extraRightComponents: {
          editableField: { type: 'InputField', componentConfiguration: { editAllowedForRole: 1 }, state: { isValid: true, isCorrect: true } },
          readonlyField: { type: 'InputField', componentConfiguration: { editAllowedForRole: 2 }, state: { isValid: true, isCorrect: true } }
        },
        actionComponents: {
          submit: { type: 'GenericButton', state: { isValid: true, isCorrect: true } }
        }
      }
    };

    const wrapper = mount(CollaborativeForm, {
      props: {
        storeObject: makeStore(storeConfig),
        componentID: 1,
        componentPath: '$.components.form1'
      },
      global: {
        stubs: {
          'q-expansion-item': true,
          InputField: InputFieldStub,
          GenericButton: true
        }
      }
    });

    const fields = wrapper.findAllComponents(InputFieldStub);
    // Das erste Feld sollte editierbar sein (readonly=false)
    expect(fields[0].props('readonly')).toBe(false);
    // Das zweite Feld sollte schreibgeschützt sein (readonly=true)
    expect(fields[1].props('readonly')).toBe(true);
  });

  it('löst den actionHandler aus, wenn der Submit-Button geklickt wird', async () => {
    // KORREKTUR: Der Store wird so konfiguriert, dass die Aktion den Typ 'submit' hat.
    const store = makeStore({
      actions: {
        submit: {
          type: 'submit',
          externalValues: {}
        }
      }
    });
    const wrapper = mount(CollaborativeForm, {
      props: {
        storeObject: store,
        componentID: 1,
        componentPath: '$.components.form1'
      },
      global: {
        stubs: {
          'q-expansion-item': true,
          GenericButton: GenericButtonStub
        }
      }
    });

    // Klick auf den Submit-Button simulieren
    await wrapper.find('.submit-btn').trigger('click');

    // Prüfen, ob das 'action'-Event ausgelöst wurde
    expect(wrapper.emitted()).toHaveProperty('action');
    const actionEvent = wrapper.emitted('action')?.[0];

    // Das Event sollte die Form [actionType, payload] haben
    expect(actionEvent?.[0]).toBe('submit');
  });
});
