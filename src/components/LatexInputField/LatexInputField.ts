import type {
  SerializedBaseComponent,
  SerialisedDependencies,
  ComponentDependencies,
  ComponentProps,
  ComponentTypeSpecification, ComponentState, ValidationConfiguration, ComponentConfiguration
} from "@/components/BaseComponent/BaseComponent";
import { BaseComponent } from "@/components/BaseComponent/BaseComponent";
import type { JSONPathExpression } from "@/stores/Store";
import { unref } from "vue";
import katex from "katex";
import type { QInputProps } from "quasar";


/**
 * The LatexInputFieldProps interface is used to define the properties, that are passed from the parent component to the LatexInputField component.
 */
export interface LatexInputFieldProps extends ComponentProps {
  modelValue?: string; // Der LaTeX-Inhalt wird optional übergeben
  readonly?: boolean;
}
/**
 * The type of the LatexInputField component.
 */
export declare type LatexInputFieldComponentType = "LatexInputField";



/**
 * The InputField-component may receive a path to a reference value for the initialization of the input field value.
 */
export interface SerializedLatexInputFieldDependencies
  extends SerialisedDependencies {
  referenceValue?: JSONPathExpression;
}

/**
 * The LatexInputField-component may utilize a reference value for the initialization of the input field value.
 */
export interface LatexInputFieldDependencies extends ComponentDependencies {
  referenceValue?: string | undefined | null;
}

export interface LatexInputFieldConfiguration extends Omit<ComponentConfiguration & QInputProps, "modelValue" | "inputStyle"> {
  placeholder?: string;
  prepend?: string;
  editAllowedForRole?: number;
  readonly?: boolean;
}

/**
 * The InputField-component may hold a static input field value in its componentData.
 */
export declare interface LatexInputFieldComponentState extends ComponentState {
  fieldConfiguration: LatexInputFieldConfiguration;
  fieldValue: string | undefined | null;
  fieldValueByUser?: Record<string, QInputProps["modelValue"]>;
}

/**
 * Configuration for basic comparison operations with static values.
 */
export interface ComparisonConfiguration {
}

/**
 * Validation strategy that compares static values to the value of the input field.
 */
export interface LatexInputFieldValidationConfiguration
  extends ValidationConfiguration {
  comparisons: Array<ComparisonConfiguration>;
}

/**
 * The SerializedLatexInputFieldComponent interface is used to define the serialised properties of the LatexInputField component.
 */
export interface SerializedLatexInputFieldComponent
  extends SerializedBaseComponent<LatexInputFieldComponentType>{
    dependencies: SerializedLatexInputFieldDependencies;
    state: LatexInputFieldComponentState;
    validationConfiguration: LatexInputFieldValidationConfiguration;
    componentConfiguration: LatexInputFieldConfiguration;
}

export interface LatexInputFieldSpecification extends ComponentTypeSpecification {
  SerializedComponent: SerializedLatexInputFieldComponent;
  Dependencies: LatexInputFieldDependencies;
}

/**
 * The InputFieldComponent class is a derived taskComponent, that allows users to enter textual or numeric input.
 */
export class LatexInputFieldComponent extends BaseComponent<LatexInputFieldSpecification> {
  /**
   * A InputFieldComponent is valid, if it matches the value in the InputFieldValidationConfiguration.
   * @returns
   */
  /**
   * Validate the LaTeX content entered by the user.
   * @param userValue The LaTeX content provided by the user.
   */
  public validate(userValue: string | undefined | null) {
    const error = this.getSyntaxError(userValue);
    const isValid = error === null || userValue?.toString() == "";
    const isCorrect =  false;
    unref(this.storeObject).setProperty({
      path: `${this.serialisedBaseComponentPath}.state.isValid`,
      value: isValid
    });
    unref(this.storeObject).setProperty({
      path: `${this.serialisedBaseComponentPath}.state.isCorrect`,
      value: isCorrect
    });
    return { isValid, isCorrect };
  }


  /**
   * Checks the LaTeX syntax and returns either null or an error message.
   * @param latex The LaTeX string to validate.
   * @returns Null if the syntax is valid, or an error message if it is not.
   */

  public getSyntaxError(latex: string | undefined | null): string | null {
    if (!latex || latex.trim() === "") return "Leerer Input ist ungültig.";

    try {
      katex.renderToString(latex, { throwOnError: true });
      return null; // Kein Fehler
    } catch (error) {
      return error instanceof Error ? error.message : "Unbekannter Fehler.";
    }
  }


}

