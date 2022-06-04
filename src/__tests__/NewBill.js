/**
 * @jest-environment jsdom
 */

import mockStore from "../__mocks__/store";
import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import NewBill from "../containers/NewBill.js";
import "@testing-library/jest-dom/extend-expect";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I submit a file different from jpg and png the file should be  denied", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname, data: bills });
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      document.body.innerHTML = NewBillUI();

      const store = null;
      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        bills,
        localStorage: window.localStorage,
      });

      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));

      const fileInput = screen.getByTestId("file");
      fileInput.addEventListener("change", handleChangeFile);

      fireEvent.change(fileInput, {
        target: {
          files: [
            new File(["sample"], "sample.pdf", {
              type: "application/pdf",
            }),
          ],
        },
      });

      expect(handleChangeFile).toHaveBeenCalled();

      expect(fileInput.files[0].name).toBe("sample.pdf");
    });
    test("Then I submit the good file format the upload is accepted", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname, data: bills });
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      document.body.innerHTML = NewBillUI();

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        bills,
        localStorage: window.localStorage,
      });

      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));

      const fileInput = screen.getByTestId("file");
      fileInput.addEventListener("change", handleChangeFile);

      fireEvent.change(fileInput, {
        target: {
          files: [
            new File(["test"], "test.jpg", {
              type: "image/jpeg",
            }),
          ],
        },
      });

      expect(handleChangeFile).toHaveBeenCalled();

      expect(fileInput.files[0].name).toBe("test.jpg");
    });
    test("Then I submit the form with good information the new bill is created", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname, data: bills });
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      document.body.innerHTML = NewBillUI();

      const store = null;
      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });

      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
      newBill.fileName = "sample.jpg";

      const formNewBill = screen.getByTestId("form-new-bill");
      formNewBill.addEventListener("submit", handleSubmit);

      fireEvent.submit(formNewBill);

      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
