// Testing may not matter much when you are working on a small app but it becomes very important
// in large scale apps which are worked on by many developers.

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react"; // screen = document (as in document.querySelector)
import userEvent from "@testing-library/user-event";
import AppTest, { AppTest2 } from "./tests/Apptest";

// describe("something truthy and falsy", () => {
//   it("true to be true", () => {
//     expect(true).toBe(true);
//   });

//   it("false to be false", () => {
//     expect(false).toBe(false);
//   });
// });

describe("App component", () => {
  it("renders correct heading", () => {
    render(<AppTest />);

    screen.debug(); // will render HTML of the rendered component in command-line (a la snapshot)

    expect(screen.getByRole("heading").textContent).toMatch(/our first test/i);
  });
});

describe("App Component 2", () => {
  it("renders magnificent monkeys", () => {
    // since screen does not have the container property, we'll destructure
    // render to obtain a container for this test
    const { container } = render(<AppTest2 />);
    // perhaps a good idea to render each component once (with mock props) and check outs snap-shot
    expect(container).toMatchSnapshot();
  });

  it("render radical rhinos after button click", async () => {
    const user = userEvent.setup();

    render(<AppTest2 />);

    const button = screen.getByRole("button", { name: "Click Me Again" });
    await user.click(button); // don't seem to work otherwise

    expect(screen.getByRole("heading").textContent).toMatch(/radical rhinos/i);
  });
});

it.skip("can open accordion items to see the contents", () => {
  // We give it our own React element of the Accordion component with our fake props,
  // then we interact with the rendered output by querying the output for the contents
  // that will be displayed to the user (or ensuring that it wont be displayed)
  // and clicking the buttons that are rendered.
  // i.e., we do not want to test the implementation of state or props directly, focus on user perspective.
  const hats = { title: "Favorite Hats", contents: "Fedoras are classy" };
  const footware = {
    title: "Favorite Footware",
    contents: "Flipflops are the best",
  };
  render(<Accordion items={[hats, footware]} />);

  expect(screen.getByText(hats.contents)).toBeInTheDocument();
  expect(screen.queryByText(footware.contents)).not.toBeInTheDocument();

  userEvent.click(screen.getByText(footware.title));

  expect(screen.getByText(footware.contents)).toBeInTheDocument();
  expect(screen.queryByText(hats.contents)).not.toBeInTheDocument();
});

// What to test:
// 1. What part of your untested codebase would be really bad if it broke? (The checkout process)
// 2. Try to narrow it down to a unit or a few units of code (When clicking the "checkout" button
//    a request with the cart items is sent to /checkout)
// 3. Look at that code and consider who the "users" are (The developer rendering the checkout form,
//    the end user clicking on the button)
// 4. Write down a list of instructions for that user to manually test that code to make sure it's
//    not broken. (render the form with some fake data in the cart, click the checkout button,
//    ensure the mocked /checkout API was called with the right data, respond with a
//    fake successful response, make sure the success message is displayed).
// 5. Turn that list of instructions into an automated test.
