// tests/unit/ts/CollaborativeFormComponent.smoke.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { CollaborativeFormComponent } from "../../../src/components/CollaborativeForm/CollaborativeForm";

describe('CollaborativeFormComponent – Minimal Smoke', () => {
  it('liefert ein ValidationResult-Objekt', () => {
    /* 1  Instanz OHNE Konstruktorlogik anlegen */
    const cmp: any = Object.create(CollaborativeFormComponent.prototype)

    /* 2  Notwendige Properties & Methoden stubben */
    cmp.serialisedBaseComponentPath = '$.components.form1'
    cmp.storeObject = ref({
      setProperty: vi.fn(),
      getProperty: vi.fn()
    })

    // dependencies & getter
    cmp.dependencies = ref({})
    cmp.getDependencies = () => ({ value: {} })

    // verschachtelte Komponenten – leer genügt
    cmp.getNestedComponents = () => ({
      formComponents: {},
      extraRightComponents: {},
      actionComponents: {}
    })

    // Helper-Methoden stubben
    cmp.validateValidityAndCorrectness = () => ({ isValid: true, isCorrect: true })
    cmp.checkLocks = () => true

    /* 3  validate() aufrufen und Ergebnis prüfen */
    const res = cmp.validate()
    expect(res).toHaveProperty('isValid')
    expect(res).toHaveProperty('isCorrect')

    // Neue Assertion: Prüft die zusätzlichen Validierungseigenschaften
    expect(res).toHaveProperty('dependenciesAreValidAndFormFieldsAreCorrect')
    expect(res).toHaveProperty('formFieldsAreValidAndDependenciesAreCorrect')
  })

  // Neuer Test für die Payload-Konstruktion
  it('konstruiert einen Payload', () => {
    const cmp: any = Object.create(CollaborativeFormComponent.prototype)

    // Notwendige Properties & Methoden stubben
    cmp.storeObject = ref({
      getProperty: vi.fn(() => null)
    })

    cmp.getNestedComponents = () => ({
      formComponents: {
        field1: { state: { fieldValue: 'Test' } }
      },
      extraRightComponents: {
        field2: { state: { fieldValue: 123 } }
      }
    })

    cmp.getDependencies = () => ({ value: {} })

    // Kritische Eigenschaft hinzufügen 👇
    cmp.serializedBaseComponent = {
      actions: {
        submit: {
          externalValues: {}
        }
      }
    }

    // Methode aufrufen und Ergebnis prüfen
    const payload = cmp.constructPayload()
    expect(payload).toEqual({
      formFields: { field1: 'Test' },
      extraRightFields: { field2: 123 },
      externalValues: {}
    })
  })
})