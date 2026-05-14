import fs from "fs";
import path from "path";

const pagesDir = "./pages";

const dirs = fs
  .readdirSync(pagesDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .sort();

const links = dirs
  .map((dir) => {
    return `
    <li>
      <a href="./pages/${dir}/">${dir}</a>
    </li>
  `;
  })
  .join("\n");

const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Pages</title>

  <style>
    body {
      font-family: sans-serif;
      padding: 40px;
    }

    ul {
      display: grid;
      gap: 12px;
      padding: 0;
      list-style: none;
    }

    li {
      border: 1px solid #ccc;
      border-radius: 8px;
    }

    a {
      display: block;
      padding: 16px;
      text-decoration: none;
    }
  </style>
</head>

<body>
  <h1>Pages</h1>

  <ul>
    ${links}
  </ul>
</body>
</html>
`;

fs.writeFileSync("./index.html", html);

console.log("index.html generated");
