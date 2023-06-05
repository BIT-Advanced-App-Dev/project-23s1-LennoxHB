import { act } from "react-dom/test-utils";
import SimpleForm from '../src/components/SimpleForm.js'
import { createRoot } from "react-dom/client";
import { rootContainer, expect } from "./setup.test.js";
import sinon from "sinon";
import { fireEvent } from "@testing-library/react";


describe("App Component Testing", () => {
  it("Simple Form", () => {
    expect.fail('TODO: Figure out how to test reactstrap Modals')
    act(() => {
      createRoot(rootContainer).render(<SimpleForm
        formName="test"
        submitCallback={() => false}
        inputData={[
          { name: 'Name', type: 'string' },
          { name: 'Password', type: 'string' }
        ]} />)
    });
    const button = rootContainer.querySelector("button");
    fireEvent.click(button)
  });
});