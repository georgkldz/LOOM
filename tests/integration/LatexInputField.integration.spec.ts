// tests/integration/LatexInputField.smoke.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LatexInputField from "../../src/components/LatexInputField/LatexInputField.vue";

/* 1 - KaTeX leer mocken, um DOM-Abhängigkeiten zu vermeiden */
vi.mock('katex', () => ({ default: { renderToString: () => '' } }))

/* 2 ─ Store mit gültigem Serialisat */
const makeStore = (setProperty = vi.fn()) => ({
  getProperty: () => ({
    state: { fieldValue: '', isValid: true, isCorrect: true },
    componentConfiguration: {},
    dependencies: {}
  }),
  setProperty
})

/* 3 ─ QInput-Stub: rendert <input> & leitet v-model weiter */
const QInputStub = {
  props  : ['modelValue'],
  emits  : ['update:modelValue', 'focusin', 'focusout'],
  template: `<input
               :value="modelValue"
               @input="$emit('update:modelValue', $event.target.value)"
             >`
}

describe('LatexInputField.vue – Integration Smoke', () => {
  it('ruft store.setProperty() bei Nutzereingabe auf', async () => {
    const setProperty = vi.fn()
    const wrapper = mount(LatexInputField, {
      props: {
        storeObject : makeStore(setProperty),
        componentID : 1,
        componentPath: '$.components.1'
      },
      global: {
        stubs: {
          QInput   : QInputStub,   // ‼️ neuer Stub mit echtem <input>
          component: true
        }
      }
    })

    await wrapper.get('input').setValue('\\alpha')

    expect(setProperty).toHaveBeenCalled()          // Smoke-Check
  })
})