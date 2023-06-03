import { Box, Typography } from "@mui/material";
import { PlaylistItem } from "../utils/requestHelpers";
import { getThumbnailURL, makeChannelURL, makeVideoURL } from "../utils/youtubeResourceHelpers";
import NewTabLink from "./NewTabLink";
import YouTubeThumbnail from "./YouTubeThumbnail";

export interface Props {
    playlistItem: PlaylistItem;
}

export default function PlaylistItemView({playlistItem}: Props) {
    return (
        <Box display="flex" flexDirection="row" flexWrap="wrap">
            <YouTubeThumbnail thumbnailURL={getThumbnailURL(playlistItem.snippet?.thumbnails)} alt={playlistItem.snippet?.title + " thumbnail"} sx={{marginRight: 1}} />
            <Box minWidth="200px">
                <Typography><NewTabLink href={makeVideoURL(playlistItem.contentDetails?.videoId ?? "", playlistItem.snippet?.playlistId, playlistItem.snippet?.position)}>{playlistItem.snippet?.title}</NewTabLink></Typography>
                <Typography variant="body2"><NewTabLink href={makeChannelURL(playlistItem.snippet?.videoOwnerChannelId ?? "")}>{playlistItem.snippet?.videoOwnerChannelTitle}</NewTabLink></Typography>
                <Typography>Published on {(new Date(playlistItem.snippet?.publishedAt || "")).toLocaleString()}</Typography>
            </Box>
        </Box>
    );
}