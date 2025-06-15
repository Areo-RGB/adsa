# Video Player with Playlist Support

This video player now supports both file-based playlists and user-created playlists.

## How to Add Videos and Playlists

### Method 1: Using the playlists.txt file (Recommended)
1. Open the `playlists.txt` file in the video-player folder
2. Follow the format shown in the file:
   ```
   [PLAYLIST: Your Playlist Name]
   Video Title | Video URL | Poster URL (optional)
   Another Video | Another URL | Another Poster
   ```
3. Save the file and refresh the video player
4. Your playlists will appear in the Playlists tab with a green file indicator

### Method 2: Creating playlists in the app
1. Click the video selection button (film icon)
2. Go to the "Playlists" tab
3. Click "Create New Playlist"
4. Add videos by going to "All Videos" tab and clicking the + button on any video

## Features

### File-based Playlists
- Defined in `playlists.txt`
- Cannot be edited from within the app (for consistency)
- Marked with a green file indicator
- Perfect for permanent collections

### User-created Playlists
- Created and managed within the app
- Stored in browser local storage
- Can be edited, videos added/removed
- Perfect for temporary or personal collections

## Video Format Support
The player supports standard web video formats:
- MP4 (recommended)
- WebM
- MOV
- Any format supported by HTML5 video

## Adding Your Own Videos

### Format for playlists.txt:
```
# Comments start with #
[PLAYLIST: My Collection]
My Video Title | https://example.com/video.mp4
Another Video | https://example.com/video2.mp4 | https://example.com/poster.jpg

[PLAYLIST: Another Collection]
Video 3 | https://example.com/video3.mp4
```

### Important Notes:
- Video URLs must be publicly accessible
- HTTPS URLs are recommended
- Poster images are optional but improve the user experience
- Each playlist section starts with `[PLAYLIST: Name]`
- Videos are separated by pipes `|` in the format: `Title | URL | Poster`

## Refresh Instructions
After editing `playlists.txt`, simply refresh the browser page to see your changes.

## Troubleshooting
- If videos don't load, check that URLs are accessible
- Make sure the format in `playlists.txt` is correct
- Check browser console for error messages
- For CORS issues, ensure video servers allow cross-origin requests
