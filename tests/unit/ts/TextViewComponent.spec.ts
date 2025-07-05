// tests/unit/ts/TextViewComponent.smoke.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { TextViewComponent } from "../../../src";
import type { StoreAPI } from "../../../src";

describe('TextViewComponent – Erweiterte Tests', () => {

  const setupTest = () => {
    const component = new (TextViewComponent as any)();

    const componentPath = '$.components.testTextView';

    // Minimaler Mock-Store, der nur die für den Test benötigte Funktion enthält.
    const mockStore = ref<Partial<StoreAPI>>({
      setProperty: vi.fn(),
    });

    component.storeObject = mockStore;
    component.serialisedBaseComponentPath = componentPath;

    return { component, mockStore, componentPath };
  };

  it('markiert leeren Text als ungültig', () => {
    const { component } = setupTest();
    const { isValid } = component.validate('');
    expect(isValid).toBe(false);
  });

  it('markiert Text mit nur Leerzeichen als ungültig', () => {
    const { component } = setupTest();
    const { isValid } = component.validate('   ');
    expect(isValid).toBe(false);
  });

  it('markiert null als ungültig', () => {
    const { component } = setupTest();
    const { isValid } = component.validate(null);
    expect(isValid).toBe(false);
  });

  it('markiert undefined als ungültig', () => {
    const { component } = setupTest();
    const { isValid } = component.validate(undefined);
    expect(isValid).toBe(false);
  });

  it('markiert einen nicht-leeren Text als gültig', () => {
    const { component } = setupTest();
    const { isValid } = component.validate('Ein gültiger Text');
    expect(isValid).toBe(true);
  });

  it('ruft store.setProperty mit den korrekten Werten auf', () => {
    const { component, mockStore, componentPath } = setupTest();

    component.validate('Gültiger Text');


    expect(mockStore.value.setProperty).toHaveBeenCalledWith({
      path: `${componentPath}.state.isValid`,
      value: true
    });


    expect(mockStore.value.setProperty).toHaveBeenCalledWith({
      path: `${componentPath}.state.isCorrect`,
      value: true
    });
  });
});