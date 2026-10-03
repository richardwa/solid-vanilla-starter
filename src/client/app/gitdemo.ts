import { div, fragment, grid, h, signal } from "solid-vanilla";
import { NumberInput } from "./components";
import { fetchJson, GitLog } from "../../common/interface";
import { formatDate } from "../../common/util";

const logRow = (log: GitLog) =>
  h("tr").inner(
    h("td").inner(log.commitHash.slice(0, 10)),
    h("td").inner(formatDate(log.commitDate)),
    h("td").inner(log.commitAuthor),
    h("td").inner(log.commitMessage),
  );

export const GitDemo = () => {
  const maxLines = signal(5);
  const selectedBranch = signal<string>();

  return div().inner(
    // label above the textbox
    h("div").inner(
      h("span").inner("log limit: "),
      NumberInput(maxLines).css("display", "block"),
    ),
    h("br"),
    h("div").do(async (node) => {
      const branches = await fetchJson("gitBranches");
      selectedBranch.set(branches[0]);
      node.inner(
        ...branches.map((branch) =>
          h("span")
            .cn("nowrap-inline")
            .inner(
              h("a")
                .css("cursor", "pointer")
                .css("font-weight", () =>
                  selectedBranch.get() === branch ? "bold" : "normal",
                )
                .on("click", () => selectedBranch.set(branch))
                .inner(`[ ${branch} ]`),
            ),
        ),
      );
    }),
    h("br"),
    h("table").inner(
      h("thead").inner(
        h("tr").inner(
          h("th").inner("Commit"),
          h("th").inner("Date"),
          h("th").inner("Author"),
          h("th").inner("Message"),
        ),
      ),
      h("tbody").watch([maxLines, selectedBranch], (node) => {
        const branch = selectedBranch.get();
        if (branch) {
          fetchJson("gitLogs", branch, maxLines.get()).then((logs) => {
            node.inner(
              ...logs.map((log) =>
                node.memo([branch, log.commitHash].join(" "), () =>
                  logRow(log),
                ),
              ),
            );
          });
        }
      }),
    ),
  );
};
