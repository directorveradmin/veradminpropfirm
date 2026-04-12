const fs = require("node:fs");
const path = require("node:path");

function copyResolved(src, dst) {
  let st = fs.lstatSync(src);
  if (st.isSymbolicLink()) {
    src = fs.realpathSync(src);
    st = fs.statSync(src);
  }

  if (st.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyResolved(path.join(src, name), path.join(dst, name));
    }
  } else {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
}

const [src, dst] = process.argv.slice(2);
if (!src || !dst) {
  throw new Error("usage: node deref-copy.cjs <src> <dst>");
}

copyResolved(src, dst);
console.log("copied", src, "->", dst);