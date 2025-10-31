const newsList = document.getElementById("news-list");

// サンプル記事データ（実際は Markdown から生成）
const articles = [
  {
    title: "テスト記事1",
    date: "2025-10-31",
    body: "ここに記事本文1",
  },
  {
    title: "テスト記事2",
    date: "2025-10-30",
    body: "ここに記事本文2",
  },
];

// 日付順にソート（新しいものが上）
articles.sort((a, b) => new Date(b.date) - new Date(a.date));

// HTMLに反映
articles.forEach((article) => {
  const li = document.createElement("li");
  li.innerHTML = `<strong>${article.date}</strong> - ${article.title}`;
  newsList.appendChild(li);
});
