async function loadPosts() {
  const postsArea = document.getElementById("news-list");

  const repo = "yhisato-sys/practice-site";
  const branch = "main";
  const postsFolder = "posts";

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${postsFolder}?ref=${branch}`;

  const res = await fetch(apiUrl);
  const files = await res.json();

  for (const file of files.reverse()) {
    if (!file.name.endsWith(".md")) continue;

    const fileRes = await fetch(file.download_url);
    const text = await fileRes.text();

    const match = text.match(/---([\s\S]*?)---/);
    if (!match) continue;

    const frontMatter = match[1];

    const title = frontMatter.match(/title:\s*(.*)/)?.[1] || "タイトルなし";
    let date = frontMatter.match(/date:\s*(.*)/)?.[1] || "日付なし";

    // ▼ 日付整形
    const d = new Date(date);
    const formattedDate = `${d.getFullYear()}.${String(
      d.getMonth() + 1
    ).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;

    const item = document.createElement("li");
    item.className = "news-item";
    item.innerHTML = `
      <span class="news-date">${formattedDate}</span>
      <span class="news-title">${title}</span>
    `;

    postsArea.appendChild(item);
  }
}

loadPosts();
