const fs = require("node:fs");
const path = require("node:path");

function findServerEntry(root) {
  const direct = path.join(root, "server.js");
  if (fs.existsSync(direct)) {
    return direct;
  }

  const stack = [root];
  const matches = [];

  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && entry.name === "server.js") {
        matches.push(full);
      }
    }
  }

  matches.sort((a, b) => a.length - b.length);
  return matches[0];
}

const workspaceRoot = process.argv[2];
if (!workspaceRoot) {
  console.error("Missing workspace root argument.");
  process.exit(1);
}

const resourceRoot = __dirname;
const serverRoot = path.join(resourceRoot, "server");
const seedWorkspace = path.join(serverRoot, "data", "workspace.json");
const targetDataDir = path.join(workspaceRoot, "data");
const targetWorkspace = path.join(targetDataDir, "workspace.json");

fs.mkdirSync(targetDataDir, { recursive: true });

if (!fs.existsSync(targetWorkspace)) {
  if (!fs.existsSync(seedWorkspace)) {
    console.error("Missing packaged workspace seed:", seedWorkspace);
    process.exit(1);
  }

  fs.copyFileSync(seedWorkspace, targetWorkspace);
}

const serverEntry = findServerEntry(serverRoot);
if (!serverEntry) {
  console.error("Missing packaged server entry under:", serverRoot);
  process.exit(1);
}

process.env.PORT = process.env.PORT || "3210";
process.env.HOSTNAME = process.env.HOSTNAME || "127.0.0.1";
process.env.VERADMIN_WORKSPACE_ROOT = workspaceRoot;
process.chdir(path.dirname(serverEntry));

require(serverEntry);