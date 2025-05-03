import type {
  SerializedBaseComponent,
  SerialisedDependencies,
  ComponentDependencies,
  ComponentProps,
  ComponentState,
  ValidationConfiguration,
  NestedComponents,
  ComponentTypeSpecification,
  ActionPayload
} from "@/components/BaseComponent/BaseComponent";
import { BaseComponent } from "@/components/BaseComponent/BaseComponent";
import type { JSONPathExpression } from "@/stores/Store";
import type { SerializedInputFieldComponent } from "../InputField/InputField";
import type {SerializedLatexInputFieldComponent} from "@/components/LatexInputField/LatexInputField";
import type {SerializedTextViewComponent} from "@/components/TextView/TextView";

import { unref } from "vue";

/**
 * The SimpleFormProps interface is used to define the properties of the SimpleForm component.
 */
export interface SimpleFormProps extends ComponentProps {}

/**
 * The type of the SimpleForm component.
 */
export type SimpleFormComponentType = "SimpleForm";

/**
 * The SimpleForm-component may point to external dependencies for validation checks.
 * The external dependencies must be references to other components.
 */
export interface SerializedSimpleFormDependencies extends SerialisedDependencies {
  [key: string]: JSONPathExpression;
}

/**
 * The SimpleForm-component may have external dependencies for validation checks.
 */
export interface SimpleFormDependencies extends ComponentDependencies {
  [key: string]: SerializedBaseComponent;
}


/**
 * The SimpleForm-component has additional state properties for validation.
 */
export interface SimpleFormComponentState extends ComponentState {
  dependenciesAreValidAndFormFieldsAreCorrect: boolean;
  formFieldsAreValidAndDependenciesAreCorrect: boolean;
}

/**
 * The SimpleForm-component is submitable if the validation checks that are governed by the SimpleFormValidationConfiguration are passed.
 */
export interface SimpleFormValidationConfiguration extends ValidationConfiguration {
  submitableWhen:
    | "isValid"
    | "isCorrect"
    | "dependenciesAreValidAndFormFieldsAreCorrect"
    | "formFieldsAreValidAndDependenciesAreCorrect";
}

/**
 * The SimpleForm-component consists of arbitrarily many input fields and a set of buttons.
 */
export interface SimpleFormNestedComponents extends NestedComponents {
  /**
   * Components used as SimpleFormComponents MUST expose their user input value as fieldValue in their componentState. See InputField for an example.
   */
  simpleFormComponents: {
    [key: string]:
      | SerializedInputFieldComponent
      | SerializedLatexInputFieldComponent
      | SerializedTextViewComponent;
  };
}

/**
 * The SimpleValidationResult holds the validation information for all combinations of validity and correctnes for fields and dependencies.
 */
export interface SimpleValidationResult {
  isValid: boolean;
  isCorrect: boolean;
  dependenciesAreValidAndFormFieldsAreCorrect: boolean;
  formFieldsAreValidAndDependenciesAreCorrect: boolean;
}


/**
 * The SerializedSimpleFormComponent interface is used to define the serialised properties of the SimpleForm component.
 */
export interface SerializedSimpleFormComponent extends SerializedBaseComponent<SimpleFormComponentType> {
  dependencies: SerializedSimpleFormDependencies;
  state: SimpleFormComponentState;
  validationConfiguration: SimpleFormValidationConfiguration;
  nestedComponents: SimpleFormNestedComponents;

}

export interface SimpleFormSpecification extends ComponentTypeSpecification {
  SerializedComponent: SerializedSimpleFormComponent;
  Dependencies: SimpleFormDependencies;
}

/**
 * The SimpleFormComponent class is a derived taskComponent, that displays a Graph specified in the Graphviz-DOT language.
 */
export class SimpleFormComponent extends BaseComponent<SimpleFormSpecification> {
  /**
   * A SimpleFormComponent is valid, if all elements in the SimpleForm are valid and all external dependencies are valid.
   * A SimpleFormComponent is correct, if all elements in the SimpleForm are correct and all external dependencies are correct.
   * @returns
   */
  public validate() {
    const { isValid: areDependenciesValid, isCorrect: areDependenciesCorrect } =
      this.validateValidityAndCorrectness(Object.values(unref(this.dependencies)));

    const { isValid: areFormComponentsValid, isCorrect: areFormComponentsCorrect } =
      this.validateValidityAndCorrectness(Object.values(this.getNestedComponents().simpleFormComponents));

    const simpleValidationResult: SimpleValidationResult = {
      isValid: areDependenciesValid && areFormComponentsValid,
      isCorrect: areDependenciesCorrect && areFormComponentsCorrect,
      dependenciesAreValidAndFormFieldsAreCorrect: areDependenciesValid && areFormComponentsCorrect,
      formFieldsAreValidAndDependenciesAreCorrect: areFormComponentsValid && areDependenciesCorrect
    };

    console.log("simpleValidationResult", simpleValidationResult);

    Object.entries(simpleValidationResult).forEach(([key, value]) => {
      unref(this.storeObject).setProperty({
        path: `${this.serialisedBaseComponentPath}.state.${key}`,
        value
      });
    });

    return simpleValidationResult;
  }

  private validateValidityAndCorrectness(serializedComponents: Array<SerializedBaseComponent>) {
    return serializedComponents.reduce(
      (validity, dependentComponent) => {
        validity.isValid = validity.isValid && dependentComponent.state.isValid;
        validity.isCorrect = validity.isCorrect && dependentComponent.state.isCorrect;
        return validity;
      },
      { isValid: true, isCorrect: true }
    );
  }

}
