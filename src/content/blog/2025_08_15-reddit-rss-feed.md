---
title: 'Using RSS to Follow Sub-Reddits'
subtitle: 'configured for Relevant Posts Only'
image: 'src/assets/blog/reddit-to-rss.png'
date: 2025-08-15
category: 'digital minimalism'
ogImageName: 'reddit-rss.jpg'
description: 'Using RSS to Follow Subreddits – configured for a Curated Feed'
mastodonId: ''
---

A few month ago, I wrote about how I pulled all my favorite YouTube channels into my RSS feed to
avoid falling into the autoplay/thumbnail trap. ([That post is here](2025_05_05-youtube-rss-feed))

Now, I’m applying the same principle to Reddit.

## But why?

There are a few subreddits I truly enjoy. Niche communities where I can stay updated on specific
topics and learn new things. They’re valuable enough that I don’t want to miss the best posts each
day.

But, just like with YouTube, the problem is the packaging:

- Infinite scroll makes it too easy to keep going “just one more post”
- The Reddit website/app is full of distractions that have nothing to do with my interests
- I’ve developed a habit of automatically opening the Reddit website on both my desktop and mobile
  whenever I’m bored – and that’s not a good thing.

My RSS reader, on the other hand, is a quiet, focused space. No popups, no infinite scroll, no
clickbait thumbnails. If I can bring just the top Reddit posts I care about into my feed, I can
consume them in the same mindful way as blogs, newsletters, and (now) YouTube videos.

## Solution 1: Reddit’s Built-In RSS

It turns out Reddit already offers RSS feeds for any subreddit. You just have to tweak the URL to
get the top N posts of the day. The format looks like this[^1]:

```
https://www.reddit.com/r/<subreddit>/top/.rss?sort=top&t=day&limit=N
```

For example, if I want the top 5 posts of today from r/dataisbeautiful and r/explainlikeimfive
combined:

```
https://www.reddit.com/r/dataisbeautiful+explainlikeimfive/top/.rss?sort=top&t=day&limit=5

```

#### ✅ Advantages

- **No extra setup** – works instantly, no tool, coding experience or API keys needed.
- **Customizable** – combine multiple subreddits, change t=day to week or month, adjust limit to
  your preferred number of posts.

#### ❌ Disadvantages

- **The feed is _live_** – it always shows the current top posts for the chosen time range. If you
  check it in the morning and again in the evening, the content may have changed.
- **No advanced filtering** – you can’t exclude certain domains, keywords, or NSFW content.
- **Sorting and ranking** follow Reddit’s own algorithm, not custom scoring.

These drawbacks kept me from adding Reddit to my RSS reader for months, as they didn’t meet my
needs. In particular, the fact that the posts could change every time the feed was refreshed was
frustrating. On top of that, having the filtering and ranking tied to Reddit’s own algorithm didn’t
give me the control I was looking for.

## Solution 2: Upvote RSS

While Reddit’s built-in RSS is great for a quick win, I wanted more control. That’s where
[Upvote RSS](https://github.com/johnwarne/upvote-rss) comes in.

[Upvote RSS](https://github.com/johnwarne/upvote-rss) is a self-hosted PHP tool built by
[John Warne](https://github.com/johnwarne) that can pull in posts from Reddit (and other platforms
like Hacker News or Lemmy) and filter them based on your own criteria – score thresholds, keywords,
timeframes, and more.

It then outputs its own RSS feed, which you can add to your reader.

#### ✅ Advantages

- **Advanced filtering** – set minimum upvotes, block specific keywords, choose exact time ranges.
- **Custom scoring** – sort by metrics you care about, not just Reddit’s defaults.
- **Enrichment** – can fetch linked article text or media previews.

#### ❌ Disadvantages

- **Requires hosting** (you need a PHP server).
- Needs some **initial setup**, including API keys for Reddit.
- **More complex** than just pasting a URL.

## How I set it up

I already have a PHP-capable server for other projects, so I didn’t need to rent anything new.

Here’s a quick overview of the steps I followed, just to give you an idea of the setup effort. For
detailed instructions, I recommend checking the official
[Upvote RSS documentation](https://github.com/johnwarne/upvote-rss/blob/main/README.md) (it’s
well-written and easy to follow).

- I've Created a new subdomain on one of my existing domains
- Cloned the Upvote RSS project from GitHub on the php server
- Created a .env file with my Reddit API credentials[^2]
- Secured the .env file with a quick .htaccess rule so it can’t be downloaded
- Accessed the Upvote RSS interface in the browser through my new subdomain and configured my Reddit
  feed
- Copied the generated RSS URL into my feed reader.

## Conclusion

The small amount of effort I put in at the beginning was definitely worthwhile (for me). This setup,
combined with the YouTube-to-RSS[^3] approach I described earlier, has removed two of my biggest
“just one more scroll” traps. My RSS reader is becoming the single point where I check for new
content — without the noise.

[^1]:
    `t=day` shows the top posts from the last 24 hours. You can replace `day` with `week`, `month`,
    `year`, or `all`. `limit` sets the maximum number of posts returned (Reddit caps it at 100).

[^2]:
    To create a Reddit API application, go to
    [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps) and click “create app”. The
    `CLIENT_ID` is the short string under the app name, and the `CLIENT_SECRET` is the longer string
    labeled “secret.” Use your Reddit username as the `REDDIT_USER`.

[^3]:
    If you missed it, here’s my [YouTube RSS post](2025_05_05-youtube-rss) that started this whole
    process.
