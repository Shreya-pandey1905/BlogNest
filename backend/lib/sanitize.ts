import sanitizeHtml from "sanitize-html";

// Sanitizes CKEditor output for safe rendering.
export function sanitizePostContentForRender(html: string): string {
  return sanitizeHtml(html ?? "", {
    // Allow CKEditor-friendly markup while stripping scripts and unsafe attributes.
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "figure",
      "iframe",
      "oembed",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "span",
      "pre",
      "code",
      "blockquote",
    ]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
      iframe: ["src", "width", "height", "title", "frameborder", "allow", "allowfullscreen"],
      oembed: ["url"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "ftp", "mailto", "tel"],
    allowedIframeHostnames: ["www.youtube.com", "youtube.com", "youtu.be", "www.youtube-nocookie.com", "player.vimeo.com"],
    allowProtocolRelative: true,
    transformTags: {
      oembed: (_tagName, attribs) => {
        const rawUrl = attribs.url ?? "";
        if (!rawUrl) {
          return { tagName: "span", text: "" };
        }

        const embedUrl = toEmbedUrl(rawUrl);
        if (!embedUrl) {
          return { tagName: "a", attribs: { href: rawUrl, rel: "noopener noreferrer", target: "_blank" }, text: rawUrl };
        }

        return {
          tagName: "iframe",
          attribs: {
            src: embedUrl,
            title: "Embedded media",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            allowfullscreen: "true",
          },
        };
      },
    },
    // Don't discard the contents of disallowed tags (keeps user text).
    disallowedTagsMode: "discard",
  });
}

function toEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = parsed.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (host === "youtu.be") {
      const videoId = parsed.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (host === "youtube-nocookie.com") {
      return url;
    }

    if (host === "vimeo.com") {
      const videoId = parsed.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }

    if (host === "player.vimeo.com") {
      return url;
    }
  } catch {
    return null;
  }

  return null;
}

// Converts a rich-text HTML fragment into plain text for card excerpts.
export function htmlToPlainText(html: string): string {
  const safeHtml = html ?? "";
  const withoutTags = safeHtml.replace(/<[^>]*>/g, " ");
  const decoded = withoutTags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  return decoded.replace(/\s+/g, " ").trim();
}

