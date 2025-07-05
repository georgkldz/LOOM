// tests/unit/ts/CollaborativeFormComponent.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { ref, computed } from 'vue'
import { CollaborativeFormComponent } from "../../../src/components/CollaborativeForm/CollaborativeForm";


const makeTestComponent = (state: { isValid: boolean, isCorrect: boolean }) => ({
  state
});

describe('CollaborativeFormComponent – Erweiterte Tests', () => {

  const setupTest = (config: {
    dependencies?: any[],
    formComponents?: Record<string, any>,
    extraRightComponents?: Record<string, any>,
    externalValues?: Record<string, any>,
    locks?: { role?: number, uid?: number }
  } = {}) => {
    const cmp: any = Object.create(CollaborativeFormComponent.prototype);

    cmp.serialisedBaseComponentPath = '$.components.form1';
    cmp.storeObject = ref({
      setProperty: vi.fn(),

      getProperty: vi.fn((path) => {
        if (config.externalValues && config.externalValues[path]) {
          return config.externalValues[path];
        }
        return null;
      })
    });

    const deps = config.dependencies ?? [];
    const locks = config.locks ?? {};
    cmp.dependencies = computed(() => deps);
    cmp.getDependencies = () => computed(() => ({ ...deps, collabRoleId: locks.role, userId: locks.uid }));


    cmp.getNestedComponents = () => ({
      formComponents: config.formComponents ?? {},
      extraRightComponents: config.extraRightComponents ?? {},
      actionComponents: {}
    });


    cmp.serializedBaseComponent = computed(() => ({
      actions: {
        submit: {
          externalValues: Object.keys(config.externalValues ?? {}).reduce((acc, key) => {
            acc[key] = key; // Verwende den Schlüssel als Pfad für den Mock
            return acc;
          }, {} as Record<string, string>)
        }
      }
    }));

    return { cmp };
  };

  describe('validate', () => {
    it('sollte isValid=true zurückgeben, wenn alle Komponenten gültig sind', () => {
      const { cmp } = setupTest({
        dependencies: [makeTestComponent({ isValid: true, isCorrect: true })],
        formComponents: { comp1: makeTestComponent({ isValid: true, isCorrect: true }) },
        extraRightComponents: { comp2: makeTestComponent({ isValid: true, isCorrect: true }) }
      });
      const res = cmp.validate();
      expect(res.isValid).toBe(true);
      expect(res.isCorrect).toBe(true);
    });

    it('sollte isValid=false zurückgeben, wenn eine Komponente ungültig ist', () => {
      const { cmp } = setupTest({
        formComponents: { comp1: makeTestComponent({ isValid: false, isCorrect: true }) }
      });
      const res = cmp.validate();
      expect(res.isValid).toBe(false);
    });

    it('sollte isCorrect=false zurückgeben, wenn eine Komponente nicht korrekt ist', () => {
      const { cmp } = setupTest({
        extraRightComponents: { comp1: makeTestComponent({ isValid: true, isCorrect: false }) }
      });
      const res = cmp.validate();
      expect(res.isCorrect).toBe(false);
    });

    it('sollte die kombinierten Validierungszustände korrekt berechnen', () => {
      const { cmp } = setupTest({
        dependencies: [makeTestComponent({ isValid: true, isCorrect: false })], // dep correct=false
        formComponents: { comp1: makeTestComponent({ isValid: true, isCorrect: true }) },
        extraRightComponents: { comp2: makeTestComponent({ isValid: false, isCorrect: true }) } // extra invalid=false
      });
      const res = cmp.validate();
      expect(res.isValid).toBe(false);
      expect(res.isCorrect).toBe(false);
      expect(res.dependenciesAreValidAndFormFieldsAreCorrect).toBe(true);
      expect(res.formFieldsAreValidAndDependenciesAreCorrect).toBe(false);
    });


    it('sollte setProperty für jeden Validierungsschlüssel aufrufen', () => {
      const { cmp } = setupTest();
      cmp.validate();

      const setPropertySpy = cmp.storeObject.value.setProperty;


      expect(setPropertySpy).toHaveBeenCalledWith(expect.objectContaining({
        path: expect.stringContaining('fieldLocksSatisfied')
      }));
      expect(setPropertySpy).toHaveBeenCalledWith(expect.objectContaining({
        path: expect.stringContaining('isValid')
      }));
      expect(setPropertySpy).toHaveBeenCalledWith(expect.objectContaining({
        path: expect.stringContaining('isCorrect')
      }));
      expect(setPropertySpy).toHaveBeenCalledWith(expect.objectContaining({
        path: expect.stringContaining('dependenciesAreValidAndFormFieldsAreCorrect')
      }));
      expect(setPropertySpy).toHaveBeenCalledWith(expect.objectContaining({
        path: expect.stringContaining('formFieldsAreValidAndDependenciesAreCorrect')
      }));
    });
  });

  describe('checkLocks', () => {
    it('sollte true zurückgeben, wenn Rolle und UID definiert sind', () => {
      const { cmp } = setupTest();
      // Die private Methode wird für den Test zugänglich gemacht
      expect(cmp.checkLocks(1, 123)).toBe(true);
    });

    it('sollte false zurückgeben, wenn die Rolle undefiniert ist', () => {
      const { cmp } = setupTest();
      expect(cmp.checkLocks(undefined, 123)).toBe(false);
    });
  });

  describe('constructPayload', () => {
    it('sollte einen Payload mit formFields und extraRightFields korrekt konstruieren', () => {
      const { cmp } = setupTest({
        formComponents: { field1: { state: { fieldValue: 'Test' } } },
        extraRightComponents: { field2: { state: { fieldValue: 123 } } }
      });
      const payload = cmp.constructPayload();
      expect(payload).toEqual({
        formFields: { field1: 'Test' },
        extraRightFields: { field2: 123 },
        externalValues: {}
      });
    });

    it('sollte externe Werte korrekt aus dem Store holen', () => {
      const { cmp } = setupTest({
        externalValues: { 'path/to/value': 'externalData' }
      });
      const payload = cmp.constructPayload();
      expect(payload.externalValues).toEqual({
        'path/to/value': 'externalData'
      });
      expect(cmp.storeObject.value.getProperty).toHaveBeenCalledWith('path/to/value');
    });
  });
});
