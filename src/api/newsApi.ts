const API_KEY = "5b2089efc01349a2a0ac54b1912d2b8d";
const BASE_URL = "https://newsapi.org/v2";

export type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  content: string;
};

const translateText = async (text: string): Promise<string> => {
  if (!text || text.trim().length === 0) return "";
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(
        text
      )}`
    );
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();
    if (data && data[0] && data[0][0] && data[0][0][0]) return data[0][0][0];
    return text;
  } catch {
    return text;
  }
};

const isValidArticle = (article: any): boolean =>
  article &&
  article.title &&
  article.title !== "[Removed]" &&
  article.title.length > 10 &&
  article.description &&
  article.description.length > 10;

export const getTopHeadlines = async (category: string = "general"): Promise<Article[]> => {
  try {
    console.log("📡 Obteniendo noticias...");
    const response = await fetch(
      `${BASE_URL}/top-headlines?country=us&pageSize=10&category=${category}&apiKey=${API_KEY}`
    );
    const data = await response.json();
    if (!data.articles) return [];

    const validArticles = data.articles.filter(isValidArticle).slice(0, 6);
    const translatedArticles: Article[] = [];

    for (let i = 0; i < validArticles.length; i++) {
      const article = validArticles[i];
      try {
        const [translatedTitle, translatedDescription] = await Promise.all([
          translateText(article.title),
          translateText(article.description.substring(0, 200)),
        ]);
        translatedArticles.push({
          ...article,
          title: translatedTitle,
          description: translatedDescription,
          urlToImage:
            article.urlToImage ||
            "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400",
        });
      } catch {
        translatedArticles.push({
          ...article,
          urlToImage:
            article.urlToImage ||
            "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400",
        });
      }
      if (i < validArticles.length - 1) await new Promise((r) => setTimeout(r, 1000));
    }
    return translatedArticles;
  } catch (error) {
    console.error("Error general:", error);
    return [];
  }
};

export const searchNews = async (query: string): Promise<Article[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/everything?q=${encodeURIComponent(query)}&language=es&pageSize=10&apiKey=${API_KEY}`
    );
    const data = await response.json();
    if (!data.articles) return [];
    return data.articles.filter(isValidArticle).map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage:
        article.urlToImage ||
        "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400",
      content: article.content || article.description,
    }));
  } catch (error) {
    console.error("Error en búsqueda API:", error);
    return [];
  }
};
