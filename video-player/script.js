document.addEventListener('DOMContentLoaded', async () => {
    // Initialize variables
    let sampleVideos = [];
    let fileBasedPlaylists = [];

    // Function to load playlists from text file
    async function loadPlaylistsFromFile() {
        try {
            const response = await fetch('playlists.txt');
            const text = await response.text();
            return parsePlaylistsFromText(text);
        } catch (error) {
            console.error('Error loading playlists file:', error);
            return {
                videos: getDefaultVideos(),
                playlists: []
            };
        }
    }

    // Function to parse playlists from text content
    function parsePlaylistsFromText(text) {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
        const videos = [];
        const playlists = [];
        let currentPlaylist = null;
        let videoId = 1;

        lines.forEach(line => {
            if (line.startsWith('[PLAYLIST:')) {
                // Extract playlist name
                const playlistName = line.substring(10, line.lastIndexOf(']')).trim();
                currentPlaylist = {
                    id: Date.now() + Math.random(),
                    name: playlistName,
                    videos: [],
                    created: new Date().toISOString(),
                    isFileBasedPlaylist: true
                };
                playlists.push(currentPlaylist);
            } else if (currentPlaylist && line.includes('|')) {
                // Parse video line: Title | URL | Poster (optional)
                const parts = line.split('|').map(part => part.trim());
                if (parts.length >= 2) {
                    const video = {
                        id: videoId++,
                        title: parts[0],
                        src: parts[1],
                        poster: parts[2] || null
                    };

                    // Add to all videos list if not already present
                    if (!videos.find(v => v.src === video.src)) {
                        videos.push(video);
                    }

                    // Add to current playlist
                    currentPlaylist.videos.push(video);
                }
            }
        });

        return { videos, playlists };
    }

    // Function to get default videos (fallback)
    function getDefaultVideos() {
        return [
            {
              id: 1,
              title: "Custom Video C1",
              src: "https://data4.fra1.cdn.digitaloceanspaces.com/c1.mov"
            },
            {
              id: 2,
              title: "Custom Video A1",
              src: "https://data4.fra1.cdn.digitaloceanspaces.com/a1.mp4"
            },
            {
              id: 3,
              title: "UE1 Video",
              src: "https://data4.fra1.cdn.digitaloceanspaces.com/ue/ue1.mp4"
            },
            {
              id: 4,
              title: "Sample Video 1",
              src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
            },
            {
              id: 5,
              title: "Sample Video 2",
              src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
              poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg"
            },
            {
              id: 6,
              title: "Sample Video 3",
              src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
              poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg"
            }
        ];
    }

    // Load playlists from file
    const { videos, playlists: loadedPlaylists } = await loadPlaylistsFromFile();
    sampleVideos = videos.length > 0 ? videos : getDefaultVideos();
    fileBasedPlaylists = loadedPlaylists;

    // State variables
    let currentIndex = 0;
    let isPlaying = false;
    let isDualMode = false;
    let playbackSpeed = 1;
    let timerSeconds = 30;
    let timerActive = false;
    let extractedThumbnails = {};
    let timerIntervalRef = null;
    let titleTimeoutRef = null;
    let currentPlaylist = null;
    let activeTab = 'videos'; // 'videos' or 'playlists'
    const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

    // Playlist management
    let playlists = JSON.parse(localStorage.getItem('videoPlaylists') || '[]');
    // Merge file-based playlists with user-created playlists
    playlists = [...fileBasedPlaylists, ...playlists.filter(p => !p.isFileBasedPlaylist)];
    let currentPlaylistVideos = sampleVideos;

    const root = document.getElementById('video-player-root');

    function renderPlayer() {
        if (!sampleVideos.length) {
            root.innerHTML = `<div class="noVideo">No video available</div>`;
            return;
        }

        root.innerHTML = `
            <div id="container" class="container">
                <div class="videoContainer">
                    <video id="video1" class="video" playsinline muted></video>
                    <video id="video2" class="video" playsinline muted style="display: none;"></video>
                </div>

                <div id="title-overlay" class="titleOverlay">
                  <div class="titleContainer">
                    <h1 id="large-title" class="largeTitle"></h1>
                    <p id="video-number" class="videoNumber"></p>
                  </div>
                </div>

                <div class="customControls">
                    <div class="progressContainer">
                        <div id="progress-bar" class="progressBar">
                            <div id="progress-filled" class="progressFilled"></div>
                        </div>
                        <div class="timeDisplay">
                            <span id="current-time">0:00</span>
                            <span id="duration-time">0:00</span>
                        </div>
                    </div>

                    <div class="controlButtons">
                        <button id="prev-btn" class="controlButton"><i class="fas fa-step-backward"></i></button>
                        <button id="play-pause-btn" class="controlButton"><i class="fas fa-play"></i></button>
                        <button id="next-btn" class="controlButton"><i class="fas fa-step-forward"></i></button>
                        <button id="dual-mode-btn" class="controlButton"><i class="fas fa-th-large"></i></button>
                        <button id="timer-btn" class="controlButton"><i class="fas fa-stopwatch"></i></button>
                        <button id="select-video-btn" class="controlButton"><i class="fas fa-film"></i></button>

                        <div class="speedControl">
                            <button id="speed-btn" class="controlButton">${playbackSpeed}x</button>
                            <div id="speed-menu" class="speedMenu" style="display: none;">
                                ${speedOptions.map(s => `<button class="speedOption" data-speed="${s}">${s}x</button>`).join('')}
                            </div>
                        </div>

                        <button id="fullscreen-btn" class="controlButton"><i class="fas fa-expand"></i></button>
                    </div>
                </div>

                <div id="timer-overlay" style="display: none;" class="timerOverlay">
                    <button id="close-timer-btn" class="closeButton"><i class="fas fa-times"></i></button>
                    <div class="timerContainer">
                        <div class="timerDisplay">
                            <button id="subtract-time-btn" class="timeAdjustButton"><i class="fas fa-minus"></i></button>
                            <span id="time-number" class="timeNumber">${timerSeconds}</span>
                            <button id="add-time-btn" class="timeAdjustButton"><i class="fas fa-plus"></i></button>
                        </div>
                        <div class="timerControls">
                            <button id="reset-timer-btn" class="timerButton">Reset</button>
                            <button id="start-stop-timer-btn" class="timerButton">Start</button>
                        </div>
                    </div>
                </div>

                <div id="video-selection-overlay" class="videoSelectionOverlay">
                    <button id="close-selection-btn" class="closeButton"><i class="fas fa-times"></i></button>
                    <div class="videoSelectionContainer">
                        <h2 class="selectionTitle">Video Library</h2>

                        <!-- Tab Navigation -->
                        <div class="tabNavigation">
                            <button id="videos-tab" class="tabButton active">All Videos</button>
                            <button id="playlists-tab" class="tabButton">Playlists</button>
                        </div>

                        <!-- Videos Tab Content -->
                        <div id="videos-tab-content" class="tabContent active">
                            <div id="video-grid" class="videoGrid"></div>
                        </div>

                        <!-- Playlists Tab Content -->
                        <div id="playlists-tab-content" class="tabContent">
                            <div class="playlistControls">
                                <button id="create-playlist-btn" class="createPlaylistBtn">
                                    <i class="fas fa-plus"></i> Create New Playlist
                                </button>
                            </div>
                            <div id="playlists-grid" class="playlistsGrid"></div>
                        </div>

                        <!-- Playlist Detail View -->
                        <div id="playlist-detail-view" class="playlistDetailView" style="display: none;">
                            <div class="playlistHeader">
                                <button id="back-to-playlists" class="backButton">
                                    <i class="fas fa-arrow-left"></i> Back
                                </button>
                                <h3 id="playlist-title" class="playlistTitle"></h3>
                                <div class="playlistActions">
                                    <button id="play-playlist-btn" class="playButton">
                                        <i class="fas fa-play"></i> Play All
                                    </button>
                                    <button id="delete-playlist-btn" class="deleteButton">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <div id="playlist-videos" class="playlistVideos"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderPlayer();

    // DOM Elements
    const container = document.getElementById('container');
    const video1 = document.getElementById('video1');
    const video2 = document.getElementById('video2');
    const progressBar = document.getElementById('progress-bar');
    const progressFilled = document.getElementById('progress-filled');
    const currentTimeEl = document.getElementById('current-time');
    const durationTimeEl = document.getElementById('duration-time');
    const prevBtn = document.getElementById('prev-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const dualModeBtn = document.getElementById('dual-mode-btn');
    const timerBtn = document.getElementById('timer-btn');
    const selectVideoBtn = document.getElementById('select-video-btn');
    const speedBtn = document.getElementById('speed-btn');
    const speedMenu = document.getElementById('speed-menu');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    // Timer Overlay Elements
    const timerOverlay = document.getElementById('timer-overlay');
    const closeTimerBtn = document.getElementById('close-timer-btn');
    const subtractTimeBtn = document.getElementById('subtract-time-btn');
    const timeNumber = document.getElementById('time-number');
    const addTimeBtn = document.getElementById('add-time-btn');
    const resetTimerBtn = document.getElementById('reset-timer-btn');
    const startStopTimerBtn = document.getElementById('start-stop-timer-btn');

    // Video Selection Overlay Elements
    const videoSelectionOverlay = document.getElementById('video-selection-overlay');
    const closeSelectionBtn = document.getElementById('close-selection-btn');
    const videoGrid = document.getElementById('video-grid');

    // Tab Elements
    const videosTab = document.getElementById('videos-tab');
    const playlistsTab = document.getElementById('playlists-tab');
    const videosTabContent = document.getElementById('videos-tab-content');
    const playlistsTabContent = document.getElementById('playlists-tab-content');
    const playlistsGrid = document.getElementById('playlists-grid');
    const createPlaylistBtn = document.getElementById('create-playlist-btn');

    // Playlist Detail Elements
    const playlistDetailView = document.getElementById('playlist-detail-view');
    const backToPlaylistsBtn = document.getElementById('back-to-playlists');
    const playlistTitle = document.getElementById('playlist-title');
    const playPlaylistBtn = document.getElementById('play-playlist-btn');
    const deletePlaylistBtn = document.getElementById('delete-playlist-btn');
    const playlistVideos = document.getElementById('playlist-videos');

    // Title Overlay Elements
    const titleOverlay = document.getElementById('title-overlay');
    const largeTitle = document.getElementById('large-title');
    const videoNumber = document.getElementById('video-number');

    // Helper Functions
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const createPlaceholderImage = (text, color = '#333333') => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1920;
        canvas.height = 1080;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 72px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        return canvas.toDataURL('image/jpeg', 0.8);
    };

    const getThumbnail = (video) => {
        if (video.poster) return video.poster;
        if (extractedThumbnails[video.src]) return extractedThumbnails[video.src];
        return createPlaceholderImage(video.title);
    };

    const extractThumbnail = (videoSrc) => {
      if (extractedThumbnails[videoSrc]) return;
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.onloadedmetadata = () => { video.currentTime = 0.167; };
      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
          extractedThumbnails[videoSrc] = canvas.toDataURL('image/jpeg', 0.8);
          updateVideoSource();
          updateVideoSelectionUI();
        } catch (e) { console.error('Could not extract thumbnail:', e); }
      };
      video.onerror = () => { console.error('Error loading video for thumbnail extraction'); };
      video.src = videoSrc;
    };


    // UI Update Functions
    function updatePlayPauseIcon() {
        playPauseBtn.innerHTML = `<i class="fas ${isPlaying ? 'fa-pause' : 'fa-play'}"></i>`;
    }

    function updateVideoSource() {
        const currentVideo = currentPlaylistVideos[currentIndex];
        const secondVideo = currentPlaylistVideos[(currentIndex + 1) % currentPlaylistVideos.length];

        video1.src = currentVideo.src;
        video1.poster = getThumbnail(currentVideo);
        video1.playbackRate = playbackSpeed;
        video1.muted = true;

        if (isDualMode) {
            video2.src = secondVideo.src;
            video2.poster = getThumbnail(secondVideo);
            video2.playbackRate = playbackSpeed;
            video2.muted = true;
            video2.style.display = 'block';
        } else {
            video2.style.display = 'none';
        }
    }

    function updateVideoSelectionUI() {
        videoGrid.innerHTML = sampleVideos.map((video, index) => `
            <div class="videoCard ${currentPlaylistVideos.find(v => v.id === video.id) && currentPlaylistVideos.findIndex(v => v.id === video.id) === currentIndex ? 'activeCard' : ''}" data-index="${index}">
                <div class="videoThumbnail">
                    <img src="${getThumbnail(video)}" alt="${video.title}" />
                </div>
                <div class="videoInfo">
                    <h3>${video.title}</h3>
                    <p>Video ${index + 1}</p>
                </div>
                <div class="videoActions">
                    <button class="addToPlaylistBtn" data-video-id="${video.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                ${currentPlaylistVideos.find(v => v.id === video.id) && currentPlaylistVideos.findIndex(v => v.id === video.id) === currentIndex ? '<div class="playingIndicator"><i class="fas fa-play"></i> Playing</div>' : ''}
            </div>
        `).join('');
    }

    function updatePlaylistsUI() {
        playlistsGrid.innerHTML = playlists.map(playlist => `
            <div class="playlistCard ${playlist.isFileBasedPlaylist ? 'file-based-playlist' : ''}" data-playlist-id="${playlist.id}">
                <div class="playlistThumbnail">
                    ${playlist.videos && playlist.videos.length > 0
                        ? `<img src="${getThumbnail(playlist.videos[0])}" alt="${playlist.name}" />`
                        : '<div class="emptyPlaylistIcon"><i class="fas fa-music"></i></div>'
                    }
                    <div class="playlistVideoCount">${playlist.videos ? playlist.videos.length : 0} videos</div>
                    ${playlist.isFileBasedPlaylist ? '<div class="fileBasedIndicator"><i class="fas fa-file-alt"></i></div>' : ''}
                </div>
                <div class="playlistInfo">
                    <h3>${playlist.name}</h3>
                    <p>${playlist.isFileBasedPlaylist ? 'From playlists.txt' : `Created ${new Date(playlist.created).toLocaleDateString()}`}</p>
                </div>
            </div>
        `).join('');
    }

    function updatePlaylistDetailUI(playlist) {
        playlistTitle.textContent = playlist.name;
        // Store playlist ID for buttons
        playPlaylistBtn.dataset.playlistId = playlist.id;
        deletePlaylistBtn.dataset.playlistId = playlist.id;

        // Hide delete button for file-based playlists
        if (playlist.isFileBasedPlaylist) {
            deletePlaylistBtn.style.display = 'none';
            playlistTitle.innerHTML = `${playlist.name} <span class="fileBasedBadge"><i class="fas fa-file-alt"></i> From File</span>`;
        } else {
            deletePlaylistBtn.style.display = 'block';
        }

        playlistVideos.innerHTML = playlist.videos.map((video, index) => `
            <div class="playlistVideoCard" data-video-index="${index}">
                <div class="videoThumbnail">
                    <img src="${getThumbnail(video)}" alt="${video.title}" />
                </div>
                <div class="videoInfo">
                    <h4>${video.title}</h4>
                    <p>Video ${index + 1} of ${playlist.videos.length}</p>
                </div>
                <div class="videoActions">
                    <button class="playVideoBtn" data-video-index="${index}">
                        <i class="fas fa-play"></i>
                    </button>
                    ${!playlist.isFileBasedPlaylist ? `
                        <button class="removeFromPlaylistBtn" data-video-index="${index}">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Playlist Management Functions
    function createPlaylist(name) {
        const newPlaylist = {
            id: Date.now(),
            name: name,
            videos: [],
            created: new Date().toISOString()
        };
        playlists.push(newPlaylist);
        savePlaylistsToStorage();
        updatePlaylistsUI();
        return newPlaylist;
    }

    function deletePlaylist(playlistId) {
        const playlist = playlists.find(p => p.id === playlistId);
        if (playlist && playlist.isFileBasedPlaylist) {
            alert('Cannot delete file-based playlists. Edit the playlists.txt file instead.');
            return;
        }
        playlists = playlists.filter(p => p.id !== playlistId);
        savePlaylistsToStorage();
        updatePlaylistsUI();
    }

    function addVideoToPlaylist(playlistId, video) {
        const playlist = playlists.find(p => p.id === playlistId);
        if (playlist) {
            if (playlist.isFileBasedPlaylist) {
                alert('Cannot modify file-based playlists. Edit the playlists.txt file instead.');
                return;
            }
            if (!playlist.videos.find(v => v.id === video.id)) {
                playlist.videos.push(video);
                savePlaylistsToStorage();
            }
        }
    }

    function removeVideoFromPlaylist(playlistId, videoIndex) {
        const playlist = playlists.find(p => p.id === playlistId);
        if (playlist) {
            if (playlist.isFileBasedPlaylist) {
                alert('Cannot modify file-based playlists. Edit the playlists.txt file instead.');
                return;
            }
            playlist.videos.splice(videoIndex, 1);
            savePlaylistsToStorage();
        }
    }

    function savePlaylistsToStorage() {
        // Only save user-created playlists, not file-based ones
        const userPlaylists = playlists.filter(p => !p.isFileBasedPlaylist);
        localStorage.setItem('videoPlaylists', JSON.stringify(userPlaylists));
    }

    function switchTab(tabName) {
        activeTab = tabName;
        // Update tab buttons
        videosTab.classList.toggle('active', tabName === 'videos');
        playlistsTab.classList.toggle('active', tabName === 'playlists');

        // Update tab content
        videosTabContent.classList.toggle('active', tabName === 'videos');
        playlistsTabContent.classList.toggle('active', tabName === 'playlists');

        if (tabName === 'videos') {
            updateVideoSelectionUI();
        } else if (tabName === 'playlists') {
            updatePlaylistsUI();
        }
    }

    function showTitleTemporarily() {
        if (titleTimeoutRef) clearTimeout(titleTimeoutRef);
        const currentVideo = currentPlaylistVideos[currentIndex];
        largeTitle.textContent = currentVideo.title;
        videoNumber.textContent = `${currentIndex + 1} / ${currentPlaylistVideos.length}`;
        if (currentPlaylist) {
            videoNumber.textContent += ` • ${currentPlaylist.name}`;
        }
        titleOverlay.classList.remove('visible');
        void titleOverlay.offsetWidth; // Trigger reflow
        titleOverlay.classList.add('visible');

        titleTimeoutRef = setTimeout(() => {
            titleOverlay.classList.remove('visible');
        }, 3000);
    }

    // Event Handlers
    function togglePlay() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            video1.play();
            if (isDualMode) video2.play();
            if (timerOverlay.style.display === 'flex' && !timerActive) startTimer();
        } else {
            video1.pause();
            if (isDualMode) video2.pause();
            stopTimer();
        }
        updatePlayPauseIcon();
    }

    function changeVideo(newIndex) {
        currentIndex = newIndex;
        isPlaying = false;
        video1.pause();
        video2.pause();
        updatePlayPauseIcon();
        updateVideoSource();
        showTitleTemporarily();
    }

    function nextVideo() { changeVideo((currentIndex + 1) % currentPlaylistVideos.length); }
    function prevVideo() { changeVideo((currentIndex - 1 + currentPlaylistVideos.length) % currentPlaylistVideos.length); }

    function handleVideoEnd() { if (!isDualMode) nextVideo(); }

    function toggleDualMode() {
        isDualMode = !isDualMode;
        container.classList.toggle('dualMode', isDualMode);
        dualModeBtn.innerHTML = `<i class="fas ${isDualMode ? 'fa-square' : 'fa-th-large'}"></i>`;
        isPlaying = false;
        video1.pause();
        video2.pause();
        updatePlayPauseIcon();
        updateVideoSource();
    }

    function handleSeek(e) {
        const rect = progressBar.getBoundingClientRect();
        const newTime = ((e.clientX - rect.left) / rect.width) * video1.duration;
        video1.currentTime = newTime;
        if (isDualMode) video2.currentTime = newTime;
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            container.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    function changeSpeed(speed) {
        playbackSpeed = speed;
        video1.playbackRate = speed;
        if(isDualMode) video2.playbackRate = speed;
        speedBtn.textContent = `${speed}x`;
        speedMenu.style.display = 'none';
        document.querySelectorAll('.speedOption').forEach(opt => {
            opt.classList.toggle('active', parseFloat(opt.dataset.speed) === speed);
        });
    }

    // Timer Logic
    function toggleTimer() {
        const isVisible = timerOverlay.style.display === 'flex';
        timerOverlay.style.display = isVisible ? 'none' : 'flex';
        if(isVisible) stopTimer();
    }
    function startTimer() {
        if (timerIntervalRef) return;
        timerActive = true;
        subtractTimeBtn.disabled = true;
        addTimeBtn.disabled = true;
        startStopTimerBtn.textContent = 'Stop';
        timerIntervalRef = setInterval(() => {
            timerSeconds--;
            timeNumber.textContent = timerSeconds;
            if (timerSeconds <= 0) {
                stopTimer();
                timerSeconds = 0;
                timeNumber.textContent = 0;
            }
        }, 1000);
    }
    function stopTimer() {
        clearInterval(timerIntervalRef);
        timerIntervalRef = null;
        timerActive = false;
        subtractTimeBtn.disabled = false;
        addTimeBtn.disabled = false;
        startStopTimerBtn.textContent = 'Start';
    }
    function resetTimer() { stopTimer(); timerSeconds = 30; timeNumber.textContent = 30; }
    function addTime() { if(!timerActive) { timerSeconds += 5; timeNumber.textContent = timerSeconds; } }
    function subtractTime() { if(!timerActive) { timerSeconds = Math.max(0, timerSeconds - 5); timeNumber.textContent = timerSeconds; } }

    // Video Selection Logic
    function toggleVideoSelection() {
        const isVisible = videoSelectionOverlay.style.display === 'flex';
        videoSelectionOverlay.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) {
            // Reset to videos tab and hide playlist detail view
            switchTab('videos');
            playlistDetailView.style.display = 'none';
        }
    }

    function selectVideo(index) {
        // If we're viewing a playlist, find the video in current playlist
        if (activeTab === 'videos') {
            const video = sampleVideos[index];
            currentPlaylistVideos = sampleVideos;
            currentPlaylist = null;
            currentIndex = index;
        }
        changeVideo(currentIndex);
        toggleVideoSelection();
    }

    function playPlaylist(playlist) {
        currentPlaylist = playlist;
        currentPlaylistVideos = playlist.videos;
        currentIndex = 0;
        changeVideo(0);
        toggleVideoSelection();
    }

    function showPlaylistDetail(playlist) {
        updatePlaylistDetailUI(playlist);
        // Hide both tab contents when showing playlist detail
        videosTabContent.classList.remove('active');
        playlistsTabContent.classList.remove('active');
        playlistDetailView.style.display = 'block';
    }

    function hidePlaylistDetail() {
        playlistDetailView.style.display = 'none';
        // Let the switchTab function handle the proper display logic
        switchTab('playlists');
    }

    function showAddToPlaylistModal(videoId) {
        const video = sampleVideos.find(v => v.id === videoId);
        if (!video) return;

        const modal = document.createElement('div');
        modal.className = 'playlistModal';
        modal.innerHTML = `
            <div class="playlistModalContent">
                <h3>Add "${video.title}" to Playlist</h3>
                <div class="playlistList">
                    ${playlists.filter(p => !p.isFileBasedPlaylist).map(playlist => `
                        <div class="playlistOption" data-playlist-id="${playlist.id}">
                            <span>${playlist.name}</span>
                            <span class="videoCount">${playlist.videos.length} videos</span>
                        </div>
                    `).join('')}
                    ${playlists.filter(p => !p.isFileBasedPlaylist).length === 0 ?
                        '<p class="noPlaylistsMessage">No custom playlists available. Create one first!</p>' : ''}
                </div>
                <div class="modalActions">
                    <button id="create-new-playlist" class="createNewBtn">Create New Playlist</button>
                    <button id="cancel-modal" class="cancelBtn">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle playlist selection
        modal.querySelectorAll('.playlistOption').forEach(option => {
            option.addEventListener('click', () => {
                const playlistId = parseInt(option.dataset.playlistId);
                addVideoToPlaylist(playlistId, video);
                document.body.removeChild(modal);
                if (activeTab === 'playlists') {
                    updatePlaylistsUI();
                }
            });
        });

        // Handle create new playlist
        modal.querySelector('#create-new-playlist').addEventListener('click', () => {
            const name = prompt('Enter playlist name:');
            if (name) {
                const newPlaylist = createPlaylist(name);
                addVideoToPlaylist(newPlaylist.id, video);
                document.body.removeChild(modal);
                if (activeTab === 'playlists') {
                    updatePlaylistsUI();
                }
            }
        });

        // Handle cancel
        modal.querySelector('#cancel-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    // Event Listeners
    playPauseBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextVideo);
    prevBtn.addEventListener('click', prevVideo);
    video1.addEventListener('ended', handleVideoEnd);
    dualModeBtn.addEventListener('click', toggleDualMode);
    progressBar.addEventListener('click', handleSeek);
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    video1.addEventListener('timeupdate', () => {
        if (!video1.duration) return;
        currentTimeEl.textContent = formatTime(video1.currentTime);
        progressFilled.style.width = `${(video1.currentTime / video1.duration) * 100}%`;
    });
    video1.addEventListener('loadedmetadata', () => {
        durationTimeEl.textContent = formatTime(video1.duration);
    });

    speedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        speedMenu.style.display = speedMenu.style.display === 'none' ? 'flex' : 'none';
    });
    document.addEventListener('click', () => { speedMenu.style.display = 'none'; });
    speedMenu.addEventListener('click', (e) => e.stopPropagation());
    document.querySelectorAll('.speedOption').forEach(opt => {
        opt.addEventListener('click', () => changeSpeed(parseFloat(opt.dataset.speed)));
    });

    timerBtn.addEventListener('click', toggleTimer);
    closeTimerBtn.addEventListener('click', toggleTimer);
    startStopTimerBtn.addEventListener('click', () => timerActive ? stopTimer() : startTimer());
    resetTimerBtn.addEventListener('click', resetTimer);
    addTimeBtn.addEventListener('click', addTime);
    subtractTimeBtn.addEventListener('click', subtractTime);

    selectVideoBtn.addEventListener('click', toggleVideoSelection);
    closeSelectionBtn.addEventListener('click', toggleVideoSelection);

    // Tab switching
    videosTab.addEventListener('click', () => switchTab('videos'));
    playlistsTab.addEventListener('click', () => switchTab('playlists'));

    // Video grid clicks
    videoGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.videoCard');
        const addBtn = e.target.closest('.addToPlaylistBtn');

        if (addBtn) {
            e.stopPropagation();
            const videoId = parseInt(addBtn.dataset.videoId);
            showAddToPlaylistModal(videoId);
        } else if (card) {
            selectVideo(parseInt(card.dataset.index, 10));
        }
    });

    // Playlist management
    createPlaylistBtn.addEventListener('click', () => {
        const name = prompt('Enter playlist name:');
        if (name) {
            createPlaylist(name);
        }
    });

    playlistsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.playlistCard');
        if (card) {
            const playlistId = parseInt(card.dataset.playlistId);
            const playlist = playlists.find(p => p.id === playlistId);
            if (playlist) {
                showPlaylistDetail(playlist);
            }
        }
    });

    // Playlist detail actions
    backToPlaylistsBtn.addEventListener('click', hidePlaylistDetail);

    playPlaylistBtn.addEventListener('click', () => {
        const playlistId = parseInt(playPlaylistBtn.dataset.playlistId);
        const playlist = playlists.find(p => p.id === playlistId);
        if (playlist && playlist.videos.length > 0) {
            playPlaylist(playlist);
        }
    });

    deletePlaylistBtn.addEventListener('click', () => {
        const playlistId = parseInt(deletePlaylistBtn.dataset.playlistId);
        if (confirm('Are you sure you want to delete this playlist?')) {
            deletePlaylist(playlistId);
            hidePlaylistDetail();
        }
    });

    playlistVideos.addEventListener('click', (e) => {
        const playBtn = e.target.closest('.playVideoBtn');
        const removeBtn = e.target.closest('.removeFromPlaylistBtn');

        if (playBtn) {
            const videoIndex = parseInt(playBtn.dataset.videoIndex);
            const playlistId = parseInt(playPlaylistBtn.dataset.playlistId);
            const playlist = playlists.find(p => p.id === playlistId);
            if (playlist) {
                currentPlaylist = playlist;
                currentPlaylistVideos = playlist.videos;
                currentIndex = videoIndex;
                changeVideo(videoIndex);
                toggleVideoSelection();
            }
        } else if (removeBtn) {
            const videoIndex = parseInt(removeBtn.dataset.videoIndex);
            const playlistId = parseInt(playPlaylistBtn.dataset.playlistId);
            removeVideoFromPlaylist(playlistId, videoIndex);
            const playlist = playlists.find(p => p.id === playlistId);
            if (playlist) {
                updatePlaylistDetailUI(playlist);
            }
        }
    });

    document.addEventListener('fullscreenchange', () => {
        const isFs = !!document.fullscreenElement;
        container.classList.toggle('fullscreen', isFs);
        fullscreenBtn.innerHTML = `<i class="fas ${isFs ? 'fa-compress' : 'fa-expand'}"></i>`;
    });

    // Initial Setup
    changeSpeed(playbackSpeed); // To set initial active class
    updateVideoSource();
    showTitleTemporarily();
    sampleVideos.forEach(video => {
        if (!video.poster) extractThumbnail(video.src);
    });
});