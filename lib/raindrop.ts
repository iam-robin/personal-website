import { Bookmark } from "../types/bookmark";

const PER_PAGE = 50;

export const fetchBookmarks = async (page: number = 0) => {
  const bookmarks: Bookmark[] = [];

  const req = await fetch(
    `https://api.raindrop.io/rest/v1/raindrops/${process.env.RAINDROP_COLLECTION}?perpage=${PER_PAGE}&page=${page}&search=❤️`,
    {
      headers: {
        Authorization: `Bearer ${process.env.RAINDROP_TOKEN}`,
      },
    }
  );

  const data = await req.json();

  if (data.items) {
    bookmarks.push(
      ...data.items.map(({ cover, title, link, tags, created, type }) => ({
        link,
        title,
        cover,
        tags,
        created,
        type,
      }))
    );
  }

  if (data.items.length === PER_PAGE) {
    bookmarks.push(...(await fetchBookmarks(page + 1)));
  }

  bookmarks.sort((a, b) => {
    const dateA = new Date(a.created).getTime();
    const dateB = new Date(b.created).getTime();
    return dateB - dateA;
  });

  return bookmarks;
};
