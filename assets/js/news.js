async function loadPosts() {
  const postsArea = document.getElementById("news-list");

  const repo = "yhisato-sys/practice-site";
  const branch = "main";
  const postsFolder = "posts";

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${postsFolder}?ref=${branch}`;

  const res = await fetch(apiUrl);
  const files = await res.json();

  const converter = new showdown.Converter();

  for (const file of files.reverse()) {
    if (!file.name.endsWith(".md")) continue;

    const fileRes = await fetch(file.download_url);
    const text = await fileRes.text();

    const match = text.match(/---([\s\S]*?)---/);
    if (!match) continue;

    const frontMatter = match[1];
    const body = text.replace(match[0], "").trim();

    const title = frontMatter.match(/title:\s*(.*)/)?.[1] || "タイトルなし";
    const date = frontMatter.match(/date:\s*(.*)/)?.[1] || "日付なし";

    const htmlBody = converter.makeHtml(body);

    const article = document.createElement("div");
    article.className = "news-item";
    article.innerHTML = `
      <h3>${title}</h3>
      <p>${date}</p>
      <div>${htmlBody}</div>
      <hr>
    `;
    postsArea.appendChild(article);
  }
}

loadPosts();
