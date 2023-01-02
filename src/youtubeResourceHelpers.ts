const UNAVAILABLE_THUMBNAIL_URL = "https://i.ytimg.com/img/no_thumbnail.jpg";

// Dimensions of a "thumbnail for a video – or a resource that refers to a video, such as a playlist item or search result."
// Channel images have different resolutions
const VIDEO_THUMBNAIL_DIMENSIONS = {
    default: {
        width: 120,
        height: 90,
    },
    medium: {
        width: 320,
        height: 180,
    },
    high: {
        width: 480,
        height: 360,
    },
    standard: {
        width: 640,
        height: 480,
    },
    maxres: {
        width: 1280,
        height: 720
    },
};

function firstAvailableThumbnail(thumbnails: gapi.client.youtube.ThumbnailDetails): gapi.client.youtube.Thumbnail | null {
    // Key for preferred thumbnail in order of preference. This function gets the first thumbnail in order of keys
    const THUMBNAIL_KEYS: (keyof gapi.client.youtube.ThumbnailDetails)[] = ["default", "medium", "high", "standard", "maxres"];
    for (const key of THUMBNAIL_KEYS) {
        if (Object.hasOwn(thumbnails, key)) {
            return thumbnails[key] as gapi.client.youtube.Thumbnail;
        }
    }
    return null;
}

function getThumbnailURL(thumbnails: gapi.client.youtube.ThumbnailDetails | null | undefined): string {
    if (!thumbnails) {
        return UNAVAILABLE_THUMBNAIL_URL;
    }
    const firstThumbnail = firstAvailableThumbnail(thumbnails);
    if (!firstThumbnail || !firstThumbnail.url) {
        return UNAVAILABLE_THUMBNAIL_URL;
    }
    return firstThumbnail.url;
}

function makeVideoURL(videoId: string, playlistId?: string, playlistPosition?: number) {
    return `https://www.youtube.com/watch?v=${videoId}${playlistId ? `&list=${playlistId}` : ""}${playlistPosition ? `&position=${playlistPosition}` : null}`;
}

export { getThumbnailURL, firstAvailableThumbnail, makeVideoURL, UNAVAILABLE_THUMBNAIL_URL, VIDEO_THUMBNAIL_DIMENSIONS }