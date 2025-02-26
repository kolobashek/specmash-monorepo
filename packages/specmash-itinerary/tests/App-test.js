import React from "react";
import { render } from "@testing-library/react-native";
import App from "../App";

describe("App", () => {
  it("renders without crashing", () => {
    const rendered = render(<App />);

    expect(rendered.toJSON()).toBeTruthy();
  });

  it("contains NavigationContainer", () => {
    const { getByType } = render(<App />);

    expect(getByType(NavigationContainer)).toBeTruthy();
  });

  it("contains StackNavigator", () => {
    const { getByType } = render(<App />);

    expect(getByType(Stack.Navigator)).toBeTruthy();
  });

  it("contains correct screens", () => {
    const { getByText } = render(<App />);

    expect(getByText("Register")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
    expect(getByText("Home")).toBeTruthy();
  });
});
