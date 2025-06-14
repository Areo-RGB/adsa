document.addEventListener('DOMContentLoaded', () => {
    const sampleVideos = [
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
    const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

    const root = document.getElementById('video-player-root');

    function renderPlayer() {
        if (!sampleVideos.length) {
            root.innerHTML = `<div class="noVideo">No video available</div>`;
            return;
        }

        root.innerHTML = `
            <div id="container" class="container">
                <div class="videoContainer">
                    <video id="video1" class="video" playsinline></video>
                    <video id="video2" class="video" playsinline style="display: none;"></video>
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
                        <h2 class="selectionTitle">Select Video</h2>
                        <div id="video-grid" class="videoGrid"></div>
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
        const currentVideo = sampleVideos[currentIndex];
        const secondVideo = sampleVideos[(currentIndex + 1) % sampleVideos.length];

        video1.src = currentVideo.src;
        video1.poster = getThumbnail(currentVideo);
        video1.playbackRate = playbackSpeed;

        if (isDualMode) {
            video2.src = secondVideo.src;
            video2.poster = getThumbnail(secondVideo);
            video2.playbackRate = playbackSpeed;
            video2.style.display = 'block';
        } else {
            video2.style.display = 'none';
        }
    }

    function updateVideoSelectionUI() {
        videoGrid.innerHTML = sampleVideos.map((video, index) => `
            <div class="videoCard ${index === currentIndex ? 'activeCard' : ''}" data-index="${index}">
                <div class="videoThumbnail">
                    <img src="${getThumbnail(video)}" alt="${video.title}" />
                </div>
                <div class="videoInfo">
                    <h3>${video.title}</h3>
                    <p>Video ${index + 1}</p>
                </div>
                ${index === currentIndex ? '<div class="playingIndicator"><i class="fas fa-play"></i> Playing</div>' : ''}
            </div>
        `).join('');
    }

    function showTitleTemporarily() {
        if (titleTimeoutRef) clearTimeout(titleTimeoutRef);
        const currentVideo = sampleVideos[currentIndex];
        largeTitle.textContent = currentVideo.title;
        videoNumber.textContent = `${currentIndex + 1} / ${sampleVideos.length}`;
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
    
    function nextVideo() { changeVideo((currentIndex + 1) % sampleVideos.length); }
    function prevVideo() { changeVideo((currentIndex - 1 + sampleVideos.length) % sampleVideos.length); }
    
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
        if (!isVisible) updateVideoSelectionUI();
    }

    function selectVideo(index) {
        changeVideo(index);
        toggleVideoSelection();
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
    videoGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.videoCard');
        if (card) selectVideo(parseInt(card.dataset.index, 10));
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