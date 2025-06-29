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
      setProperty: vi.fn(),        // wird in validate() aufgerufen
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
    const res = cmp.validate()                       // darf nicht werfen
    expect(res).toHaveProperty('isValid')
    expect(res).toHaveProperty('isCorrect')
  })
})
