import fs from "fs";
import path from "path";

const ROOT_DIR = "./pages";
const OUTPUT_FILE = "./index.html";

/*
  ディレクトリを再帰走査してHTMLツリー生成
*/
function buildTree(dirPath, relativePath = "") {
  const entries = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .sort((a, b) => {
      // ディレクトリを先
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  let html = `<ul>`;

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const rel = path.join(relativePath, entry.name);

    // ディレクトリ
    if (entry.isDirectory()) {
      html += `
        <li>
          <details>
            <summary>${entry.name}</summary>
            ${buildTree(fullPath, rel)}
          </details>
        </li>
      `;
      continue;
    }

    // htmlファイルのみ表示
    if (entry.isFile() && entry.name.endsWith(".html")) {
      const href = `./pages/${rel}`.replaceAll("\\", "/");

      html += `
        <li class="file">
          <a href="${href}">
            ${entry.name}
          </a>
        </li>
      `;
    }
  }

  html += `</ul>`;
  return html;
}

const treeHtml = buildTree(ROOT_DIR);

const output = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Pages Index</title>

  <style>
    body {
      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Hiragino Sans",
        "Yu Gothic",
        sans-serif;
      padding: 32px;
      line-height: 1.5;
    }

    h1 {
      margin-bottom: 24px;
    }

    ul {
      list-style: none;
      padding-left: 20px;
    }

    li {
      margin: 4px 0;
    }

    summary {
      cursor: pointer;
      user-select: none;
      font-weight: 600;
    }

    summary:hover {
      opacity: 0.7;
    }

    .file::before {
      content: "・ ";
      color: #666;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    details {
      margin: 4px 0;
    }
  </style>
</head>
<body>
  <h1>Pages</h1>
  ${treeHtml}
</body>
</html>
`;

fs.writeFileSync(OUTPUT_FILE, output);

console.log("index.html generated");
