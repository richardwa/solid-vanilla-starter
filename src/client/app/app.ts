import { div, h } from "solid-vanilla";
import { router } from "./routes";

export const App = () =>
  div().inner(h("h3").inner("Git Logs"), router.getRoot());
