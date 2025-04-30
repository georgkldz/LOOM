import type {
  SerializedBaseComponent,
  SerialisedDependencies,
  ComponentDependencies,
  ComponentProps,
  ComponentState,
  ValidationConfiguration,
  NestedComponents,
  ComponentTypeSpecification,
  PublicComponentEmit,
  ComponentEmits,
  ActionPayload,
  FetchAction,
  ComponentActions
} from "@/components/BaseComponent/BaseComponent";
import { BaseComponent } from "@/components/BaseComponent/BaseComponent";
import type { JSONPathExpression } from "@/stores/Store";
import type { SerializedInputFieldComponent } from "../InputField/InputField";
import type { SerializedButtonComponent } from "../GenericButton/GenericButton";
import type {SerializedLatexInputFieldComponent} from "@/components/LatexInputField/LatexInputField";
import type {SerializedTextViewComponent} from "@/components/TextView/TextView";

import { unref } from "vue";

/**
 * The FormProps interface is used to define the properties of the Form component.
 */
export interface CollaborativeFormProps extends ComponentProps {}

/**
 * The type of the Form component.
 */
export type CollaborativeFormComponentType = "CollaborativeForm";

/**
 * The Form-component may point to external dependencies for validation checks.
 * The external dependencies must be references to other components.
 */
export type SerializedCollabDependencies =
  SerialisedDependencies & {
  userId?: JSONPathExpression;
  roleId?: JSONPathExpression;
};


/**
 * The Form-component may have external dependencies for validation checks.
 */
export type CollabFormDependencies =
  ComponentDependencies & {
  userId?: number;
  roleId?: number;
};

/**
 * The structure of the payload that is emitted by the Form-component.
 */
export interface CollabFormPayload extends ActionPayload {
  collabFields: Record<string, any>      // Werte der koll. Felder
  external?: Record<string, any>
  formFields: { [key: string]: any };
  externalValues: { [key: string]: any };
}

/**
 * The Form-component emits an action event.
 * The payload contains the form fields and the values of potential dependencies.
 * The triggered action has to be specified in the component configuration.
 */
export type CollabFormEmit = [actionType: "submit", payload: CollabFormPayload] & PublicComponentEmit;

export type CollabFormEmits = {
  action: CollabFormEmit;
} & ComponentEmits;

/**
 * The Form-component has additional state properties for validation.
 */
export interface CollabFormComponentState extends ComponentState {
  fieldLocksSatisfied: boolean;
  dependenciesAreValidAndFormFieldsAreCorrect: boolean;
  formFieldsAreValidAndDependenciesAreCorrect: boolean;
}

/**
 * The form-component is submitable if the validation checks that are governed by the FormValidationConfiguration are passed.
 */
export interface CollabValidationConfiguration extends ValidationConfiguration {
  submitableWhen:
    | "isValid"
    | "fieldLocksSatisfied"
    | "isCorrect"
    | "dependenciesAreValidAndFormFieldsAreCorrect"
    | "formFieldsAreValidAndDependenciesAreCorrect";
}

/**
 * The Form-component consists of arbitrarily many input fields and a set of buttons.
 */
export interface CollabNestedComponents extends NestedComponents {
  /**
   * Components used as formComponents MUST expose their user input value as fieldValue in their componentState. See InputField for an example.
   */
  formComponents: {
    [key: string]:
      | SerializedInputFieldComponent
      | SerializedLatexInputFieldComponent
      | SerializedTextViewComponent;
  };
  actionComponents: {
    submit: SerializedButtonComponent;
    reset?: SerializedButtonComponent;
  };
}

/**
 * The ValidationResult holds the validation information for all combinations of validity and correctnes for fields and dependencies.
 */
export interface ValidationResult {
  isValid: boolean;
  isCorrect: boolean;
  dependenciesAreValidAndFormFieldsAreCorrect: boolean;
  formFieldsAreValidAndDependenciesAreCorrect: boolean;
}

export interface SubmitAction extends FetchAction {
  externalValues?: {
    [key: string]: JSONPathExpression;
  };
}

/**
 * The FormComponent allows to emit a fetch-action on submitting the form.
 */
export interface CollabActions extends ComponentActions {
  submit: SubmitAction;
}

/**
 * The SerializedFormComponent interface is used to define the serialised properties of the Form component.
 */
export interface SerializedCollabFormComponent extends SerializedBaseComponent<CollaborativeFormComponentType> {
  dependencies: SerializedCollabDependencies;
  state: CollabFormComponentState;
  validationConfiguration: CollabValidationConfiguration;
  nestedComponents: CollabNestedComponents;
  actions: CollabActions;
}

export interface CollabSpecification extends ComponentTypeSpecification {
  SerializedComponent: SerializedCollabFormComponent;
  Dependencies: CollabFormDependencies;
  Emits: CollabFormEmits;
}

/**
 * The FormComponent class is a derived taskComponent, that displays a Graph specified in the Graphviz-DOT language.
 */
export class CollaborativeFormComponent extends BaseComponent<CollabSpecification> {
  /**
   * A FormComponent is valid, if all elements in the form are valid and all external dependencies are valid.
   * A FormComponent is correct, if all elements in the form are correct and all external dependencies are correct.
   * @returns
   */
  public validate() {
    const role = this.getDependencies().value.roleId
    const userId = this.getDependencies().value.userId
    const locksOk = this.checkLocks(role, userId)
    unref(this.storeObject).setProperty({
      path: `${this.serialisedBaseComponentPath}.state.fieldLocksSatisfied`,
      value: locksOk
    })

    const { isValid: areDependenciesValid, isCorrect: areDependenciesCorrect } =
      this.validateValidityAndCorrectness(Object.values(unref(this.dependencies)));

    const { isValid: areFormComponentsValid, isCorrect: areFormComponentsCorrect } =
      this.validateValidityAndCorrectness(Object.values(this.getNestedComponents().formComponents));

    const validationResult: ValidationResult = {
      isValid: areDependenciesValid && areFormComponentsValid,
      isCorrect: areDependenciesCorrect && areFormComponentsCorrect,
      dependenciesAreValidAndFormFieldsAreCorrect: areDependenciesValid && areFormComponentsCorrect,
      formFieldsAreValidAndDependenciesAreCorrect: areFormComponentsValid && areDependenciesCorrect
    };

    console.log("validationResult", validationResult);

    Object.entries(validationResult).forEach(([key, value]) => {
      unref(this.storeObject).setProperty({
        path: `${this.serialisedBaseComponentPath}.state.${key}`,
        value
      });
    });

    return validationResult;
  }

  private checkLocks(role: number|undefined, uid: number|undefined) {
    // hier könnten Sie die Schreibrechte pro Feld prüfen …
    return role !== undefined && uid !== undefined
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

  /**
   * The FormComponent emits a submit event with the values of the form fields and potential external values as its payload.
   * Assumes that user values in the form fields are stored in the fieldValue property of their componentState.
   * @returns
   */
  protected constructPayload() {
    const externalValueReferences =
      unref(this.serializedBaseComponent).actions.submit.externalValues || {};

    const externalValues = Object.entries(externalValueReferences).reduce(
      (externalValues, [key, path]) => {
        const externalValue = unref(this.storeObject).getProperty(path);
        externalValues[key] = externalValue;
        return externalValues;
      },
      {} as { [key: string]: any }
    );
    const uid = this.getDependencies().value.userId
    const collabFields = Object.fromEntries(
      Object.entries(this.getNestedComponents().formComponents).map(
        ([id, comp]) => [id, (comp.state as any).fieldValueByUser?.[uid!] ?? '']
      )
    )

    const formFields = Object.entries(this.getNestedComponents().formComponents).reduce(
      (formFieldValues, [key, component]) => {
        const value = component.state.fieldValue;
        formFieldValues[key] = value;

        return formFieldValues;
      },
      {} as { [key: string]: any }
    );

    return { formFields, collabFields, externalValues };
  }
}
