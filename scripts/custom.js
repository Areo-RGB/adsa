//Removing Preloader
setTimeout(function(){
    var preloader = document.getElementById('preloader')
    if(preloader){preloader.classList.add('preloader-hide');}
},150);

document.addEventListener('DOMContentLoaded', () => {
    'use strict'

    //Global Variables
    let isPWA = true;  // Enables or disables the service worker and PWA
    let isAJAX = false; // AJAX transitions. Requires local server or server
    var pwaName = "qV"; //Local Storage Names for PWA
    var pwaRemind = 1; //Days to re-remind to add to home
    var pwaNoCache = false; //Requires server and HTTPS/SSL. Will clear cache with each visit

    //Setting Service Worker Locations scope = folder | location = service worker js location
    var pwaScope = "/";
    var pwaLocation = "/_service-worker.js";

    // --- Start of YoYo Test Page "Global" State ---
    const supabaseUrl = 'https://qfngdawbbzisdwqvogxs.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbmdkYXdiYnppc2R3cXZvZ3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDc2MzMsImV4cCI6MjA2NDE4MzYzM30.wrBZ8lfn2dNmOlX8v4mTJ1eaTcYzC7SUKb0tmhzqsIU';
    let supabaseClient;
    const yoyoScheduleData = [
        { 'leg': 0, 'level': null, 'speed_kmh': null, 'total_time_seconds': 0.0, 'total_time_formatted': '00:00.0', 'total_distance_m': 0, 'action': 'start', 'is_recovery': false },
        { 'leg': 1, 'level': 5, 'speed_kmh': 10.0, 'total_time_seconds': 7.2, 'total_time_formatted': '00:07.2', 'total_distance_m': 20, 'action': 'out', 'is_recovery': false },
        { 'leg': 2, 'level': 5, 'speed_kmh': 10.0, 'total_time_seconds': 14.4, 'total_time_formatted': '00:14.4', 'total_distance_m': 40, 'action': 'back', 'is_recovery': false },
        { 'leg': null, 'level': null, 'speed_kmh': null, 'total_time_seconds': 24.4, 'total_time_formatted': '00:24.4', 'total_distance_m': 40, 'action': 'recovery', 'is_recovery': true },
        { 'leg': 3, 'level': 9, 'speed_kmh': 12.0, 'total_time_seconds': 30.4, 'total_time_formatted': '00:30.4', 'total_distance_m': 60, 'action': 'out', 'is_recovery': false },
        { 'leg': 4, 'level': 9, 'speed_kmh': 12.0, 'total_time_seconds': 36.4, 'total_time_formatted': '00:36.4', 'total_distance_m': 80, 'action': 'back', 'is_recovery': false },
        { 'leg': null, 'level': null, 'speed_kmh': null, 'total_time_seconds': 46.4, 'total_time_formatted': '00:46.4', 'total_distance_m': 80, 'action': 'recovery', 'is_recovery': true },
        { 'leg': 5, 'level': 11, 'speed_kmh': 13.0, 'total_time_seconds': 52.0, 'total_time_formatted': '00:52.0', 'total_distance_m': 100, 'action': 'out', 'is_recovery': false },
        { 'leg': 6, 'level': 11, 'speed_kmh': 13.0, 'total_time_seconds': 57.5, 'total_time_formatted': '00:57.5', 'total_distance_m': 120, 'action': 'back', 'is_recovery': false },
        { 'leg': null, 'level': null, 'speed_kmh': null, 'total_time_seconds': 67.5, 'total_time_formatted': '01:07.5', 'total_distance_m': 120, 'action': 'recovery', 'is_recovery': true },
        { 'leg': 7, 'level': 11, 'speed_kmh': 13.0, 'total_time_seconds': 73.1, 'total_time_formatted': '01:13.1', 'total_distance_m': 140, 'action': 'out', 'is_recovery': false },
        { 'leg': 8, 'level': 11, 'speed_kmh': 13.0, 'total_time_seconds': 78.6, 'total_time_formatted': '01:18.6', 'total_distance_m': 160, 'action': 'back', 'is_recovery': false },
        { 'leg': null, 'level': null, 'speed_kmh': null, 'total_time_seconds': 88.6, 'total_time_formatted': '01:28.6', 'total_distance_m': 160, 'action': 'recovery', 'is_recovery': true },
        { 'leg': 9, 'level': 12, 'speed_kmh': 13.5, 'total_time_seconds': 93.9, 'total_time_formatted': '01:33.9', 'total_distance_m': 180, 'action': 'out', 'is_recovery': false },
        { 'leg': 10, 'level': 12, 'speed_kmh': 13.5, 'total_time_seconds': 99.3, 'total_time_formatted': '01:39.3', 'total_distance_m': 200, 'action': 'back', 'is_recovery': false },
        { 'leg': null, 'level': null, 'speed_kmh': null, 'total_time_seconds': 109.3, 'total_time_formatted': '01:49.3', 'total_distance_m': 200, 'action': 'recovery', 'is_recovery': true },
        { 'leg': 11, 'level': 12, 'speed_kmh': 13.5, 'total_time_seconds': 114.6, 'total_time_formatted': '01:54.6', 'total_distance_m': 220, 'action': 'out', 'is_recovery': false },
        { 'leg': 12, 'level': 12, 'speed_kmh': 13.5, 'total_time_seconds': 120.0, 'total_time_formatted': '02:00.0', 'total_distance_m': 240, 'action': 'back', 'is_recovery': false },
        { 'leg': null, 'level': null, 'speed_kmh': null, 'total_time_seconds': 130.0, 'total_time_formatted': '02:10.0', 'total_distance_m': 240, 'action': 'recovery', 'is_recovery': true },
        { 'leg': 13, 'level': 12, 'speed_kmh': 13.5, 'total_time_seconds': 135.3, 'total_time_formatted': '02:15.3', 'total_distance_m': 260, 'action': 'out', 'is_recovery': false },
        { 'leg': 14, 'level': 12, 'speed_kmh': 13.5, 'total_time_seconds': 140.7, 'total_time_formatted': '02:20.7', 'total_distance_m': 280, 'action': 'back', 'is_recovery': false },
        { 'leg': null, 'level': null, 'speed_kmh': null, 'total_time_seconds': 150.7, 'total_time_formatted': '02:30.7', 'total_distance_m': 280, 'action': 'recovery', 'is_recovery': true },
        { 'leg': 15, 'level': 13, 'speed_kmh': 14.0, 'total_time_seconds': 155.8, 'total_time_formatted': '02:35.8', 'total_distance_m': 300, 'action': 'out', 'is_recovery': false },
        { 'leg': 16, 'level': 13, 'speed_kmh': 14.0, 'total_time_seconds': 160.9, 'total_time_formatted': '02:40.9', 'total_distance_m': 320, 'action': 'back', 'is_recovery': false },
        { 'leg': null, 'level': null, 'speed_kmh': null, 'total_time_seconds': 170.9, 'total_time_formatted': '02:50.9', 'total_distance_m': 320, 'action': 'recovery', 'is_recovery': true },
        { 'leg': 17, 'level': 13, 'speed_kmh': 14.0, 'total_time_seconds': 176.1, 'total_time_formatted': '02:56.1', 'total_distance_m': 340, 'action': 'out', 'is_recovery': false },
        { 'leg': 18, 'level': 13, 'speed_kmh': 14.0, 'total_time_seconds': 181.2, 'total_time_formatted': '03:01.2', 'total_distance_m': 360, 'action': 'back', 'is_recovery': false },
        { 'leg': null, 'level': null, 'speed_kmh': null, 'total_time_seconds': 191.2, 'total_time_formatted': '03:11.2', 'total_distance_m': 360, 'action': 'recovery', 'is_recovery': true },
        { 'leg': 19, 'level': 13, 'speed_kmh': 14.0, 'total_time_seconds': 196.4, 'total_time_formatted': '03:16.4', 'total_distance_m': 380, 'action': 'out', 'is_recovery': false },
        { 'leg': 20, 'level': 13, 'speed_kmh': 14.0, 'total_time_seconds': 201.5, 'total_time_formatted': '03:21.5', 'total_distance_m': 400, 'action': 'back', 'is_recovery': false },
        { 'leg': null, 'level': null, 'speed_kmh': null, 'total_time_seconds': 211.5, 'total_time_formatted': '03:31.5', 'total_distance_m': 400, 'action': 'recovery', 'is_recovery': true },
        { 'leg': 21, 'level': 13, 'speed_kmh': 14.0, 'total_time_seconds': 216.7, 'total_time_formatted': '03:36.7', 'total_distance_m': 420, 'action': 'out', 'is_recovery': false },
        { 'leg': 22, 'level': 13, 'speed_kmh': 14.0, 'total_time_seconds': 221.8, 'total_time_formatted': '03:41.8', 'total_distance_m': 440, 'action': 'back', 'is_recovery': false },
        { 'leg': null, 'level': null, 'speed_kmh': null, 'total_time_seconds': 231.8, 'total_time_formatted': '03:51.8', 'total_distance_m': 440, 'action': 'recovery', 'is_recovery': true },
        { 'leg': 23, 'level': 14, 'speed_kmh': 14.5, 'total_time_seconds': 236.8, 'total_time_formatted': '03:56.8', 'total_distance_m': 460, 'action': 'out', 'is_recovery': false },
        { 'leg': 24, 'level': 14, 'speed_kmh': 14.5, 'total_time_seconds': 241.7, 'total_time_formatted': '04:01.7', 'total_distance_m': 480, 'action': 'back', 'is_recovery': false },
        { 'leg': null, 'level': null, 'speed_kmh': null, 'total_time_seconds': 251.7, 'total_time_formatted': '04:11.7', 'total_distance_m': 480, 'action': 'recovery', 'is_recovery': true },
        { 'leg': 25, 'level': 14, 'speed_kmh': 14.5, 'total_time_seconds': 256.7, 'total_time_formatted': '04:16.7', 'total_distance_m': 500, 'action': 'out', 'is_recovery': false },
        { 'leg': 26, 'level': 14, 'speed_kmh': 14.5, 'total_time_seconds': 261.6, 'total_time_formatted': '04:21.6', 'total_distance_m': 520, 'action': 'back', 'is_recovery': false },
        { 'leg': null, 'level': null, 'speed_kmh': null, 'total_time_seconds': 271.6, 'total_time_formatted': '04:31.6', 'total_distance_m': 520, 'action': 'recovery', 'is_recovery': true },
        { 'leg': 27, 'level': 14, 'speed_kmh': 14.5, 'total_time_seconds': 276.6, 'total_time_formatted': '04:36.6', 'total_distance_m': 540, 'action': 'out', 'is_recovery': false },
        { 'leg': 28, 'level': 14, 'speed_kmh': 14.5, 'total_time_seconds': 281.5, 'total_time_formatted': '04:41.5', 'total_distance_m': 560, 'action': 'back', 'is_recovery': false },
        { 'leg': null, 'level': null, 'speed_kmh': null, 'total_time_seconds': 291.5, 'total_time_formatted': '04:51.5', 'total_distance_m': 560, 'action': 'recovery', 'is_recovery': true },
        { 'leg': 29, 'level': 14, 'speed_kmh': 14.5, 'total_time_seconds': 296.5, 'total_time_formatted': '04:56.5', 'total_distance_m': 580, 'action': 'out', 'is_recovery': false },
        { 'leg': 30, 'level': 14, 'speed_kmh': 14.5, 'total_time_seconds': 301.4, 'total_time_formatted': '05:01.4', 'total_distance_m': 600, 'action': 'back', 'is_recovery': false },
        { 'leg': null, 'level': null, 'speed_kmh': null, 'total_time_seconds': 311.4, 'total_time_formatted': '05:11.4', 'total_distance_m': 600, 'action': 'recovery', 'is_recovery': true },
        { 'leg': 31, 'level': 14, 'speed_kmh': 14.5, 'total_time_seconds': 316.4, 'total_time_formatted': '05:16.4', 'total_distance_m': 620, 'action': 'out', 'is_recovery': false },
        { 'leg': 32, 'level': 14, 'speed_kmh': 14.5, 'total_time_seconds': 321.3, 'total_time_formatted': '05:21.3', 'total_distance_m': 640, 'action': 'back', 'is_recovery': false },
        { 'leg': null, 'level': null, 'speed_kmh': null, 'total_time_seconds': 331.3, 'total_time_formatted': '05:31.3', 'total_distance_m': 640, 'action': 'recovery', 'is_recovery': true },
        { 'leg': 33, 'level': 14, 'speed_kmh': 14.5, 'total_time_seconds': 336.3, 'total_time_formatted': '05:36.3', 'total_distance_m': 660, 'action': 'out', 'is_recovery': false },
        { 'leg': 34, 'level': 14, 'speed_kmh': 14.5, 'total_time_seconds': 341.2, 'total_time_formatted': '05:41.2', 'total_distance_m': 680, 'action': 'back', 'is_recovery': false },
        { 'leg': null, 'level': null, 'speed_kmh': null, 'total_time_seconds': 351.2, 'total_time_formatted': '05:51.2', 'total_distance_m': 680, 'action': 'recovery', 'is_recovery': true },
        { 'leg': 35, 'level': 14, 'speed_kmh': 14.5, 'total_time_seconds': 356.2, 'total_time_formatted': '05:56.2', 'total_distance_m': 700, 'action': 'out', 'is_recovery': false },
        { 'leg': 36, 'level': 14, 'speed_kmh': 14.5, 'total_time_seconds': 361.1, 'total_time_formatted': '06:01.1', 'total_distance_m': 720, 'action': 'back', 'is_recovery': false }
    ];
    const currentSession = {
        name: '',
        athletes: {},
        rankings: [],
        sessionId: null,
        testDate: null
    };
    let sessionStarted = false;
    let yoyoTestStarted = false;
    let testStartTime = null;
    let timerInterval = null;
    let nextEventIndex = 0;
    let isPaused = false;
    let timeWhenPaused = 0;
    let startSound, backSound, recoverySound;
    let activeSessionData = null;
    // --- End of YoYo Test Page "Global" State ---

    //Place all your custom Javascript functions and plugin calls below this line
    function init_template(){

        // --- Start of General Purpose Utility Functions ---
        function showToast(title, message, type = 'info') {
            let toastContainer = document.getElementById('toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.id = 'toast-container';
                Object.assign(toastContainer.style, {
                    position: 'fixed', top: '20px', right: '20px', zIndex: '9999', maxWidth: '350px'
                });
                document.body.appendChild(toastContainer);
            }
            const toast = document.createElement('div');
            const toastId = 'toast-' + Date.now();
            toast.id = toastId;

            let bgColor, iconClass, iconColor;
            switch(type) {
                case 'success': bgColor = 'bg-green-dark'; iconClass = 'fa-check-circle'; iconColor = 'color-green-light'; break;
                case 'error': bgColor = 'bg-red-dark'; iconClass = 'fa-exclamation-circle'; iconColor = 'color-red-light'; break;
                case 'warning': bgColor = 'bg-yellow-dark'; iconClass = 'fa-exclamation-triangle'; iconColor = 'color-yellow-light'; break;
                default: bgColor = 'bg-highlight'; iconClass = 'fa-info-circle'; iconColor = 'color-blue-light';
            }

            toast.className = `card card-style ${bgColor} shadow-xl mb-3`;
            toast.style.animation = 'slideInRight 0.3s ease-out';
            toast.style.marginBottom = '10px';

            toast.innerHTML = `
                <div class="content">
                    <div class="d-flex align-items-center">
                        <div class="me-3"> <i class="fa ${iconClass} ${iconColor} fa-lg"></i> </div>
                        <div class="flex-grow-1">
                            <h6 class="mb-1 font-600 color-white">${title}</h6>
                            <p class="mb-0 font-11 color-white opacity-80">${message}</p>
                        </div>
                        <div class="ms-2"> <a href="#" id="toast-closer-${toastId}" class="color-white opacity-50"> <i class="fa fa-times"></i> </a> </div>
                    </div>
                </div>`;
            toastContainer.appendChild(toast);
            document.getElementById(`toast-closer-${toastId}`).addEventListener('click', (e) => {
                e.preventDefault();
                removeToast(toastId);
            });
            setTimeout(() => { removeToast(toastId); }, 5000);
        }

        function removeToast(toastId) {
            const toast = document.getElementById(toastId);
            if (toast) {
                toast.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (toast.parentNode) { toast.parentNode.removeChild(toast); }
                }, 300);
            }
        }

        function playBeep(frequency = 880, duration = 200) {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return;
                const ctx = new AudioCtx();
                const oscillator = ctx.createOscillator();
                oscillator.type = 'sine';
                oscillator.frequency.value = frequency;
                oscillator.connect(ctx.destination);
                oscillator.start();
                setTimeout(() => {
                    oscillator.stop();
                    ctx.close();
                }, duration);
            } catch (err) {
                console.warn('Web Audio API beep failed:', err);
            }
        }

        function playSound(audioElement, fallbackFrequency = 880, duration = 200) {
            if (audioElement && audioElement.src) {
                const playPromise = audioElement.play?.();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(() => playBeep(fallbackFrequency, duration));
                }
            } else {
                playBeep(fallbackFrequency, duration);
            }
        }
        // --- End of General Purpose Utility Functions ---

        // --- Start of YoYo Test Page Specific Logic ---
        if (document.body.id === 'page-yoyo-body') {

            function setAthleteRowState(row, state) {
                const nameEl = row.querySelector('.athlete-name');
                if(!nameEl) return;

                // Define classes for each state [Normal, Warning, Eliminated] for both themes
                const lightStateClasses = [
                    ['color-gray-dark', 'border-gray-dark', 'bg-fade-gray-light'],
                    ['color-orange-dark', 'border-orange-dark', 'bg-fade-orange-light'],
                    ['color-red-dark', 'border-red-dark', 'bg-fade-red-light']
                ];
                const darkStateClasses = [
                    ['color-gray-light', 'border-gray-dark', 'bg-fade-gray-dark'],
                    ['color-yellow-dark', 'border-yellow-dark', 'bg-fade-yellow-light'],
                    ['color-red-light', 'border-red-dark', 'bg-fade-red-light']
                ];
                const allPossibleClasses = [...new Set([...lightStateClasses.flat(), ...darkStateClasses.flat()])];

                nameEl.classList.remove(...allPossibleClasses);

                const isDarkMode = document.body.classList.contains('theme-dark');
                const classesToAdd = (isDarkMode ? darkStateClasses : lightStateClasses)[state];

                if(classesToAdd) {
                    nameEl.classList.add(...classesToAdd, 'font-600');
                }

                if (state === 2) {
                    nameEl.textContent = 'Raus!';
                } else {
                    nameEl.textContent = row.dataset.athleteName.charAt(0).toUpperCase() + row.dataset.athleteName.slice(1);
                }
                row.dataset.state = state;
            }

            function initializeSupabase() {
                try {
                    if (typeof supabase !== 'undefined' && supabase.createClient) {
                        const { createClient } = supabase;
                        supabaseClient = createClient(supabaseUrl, supabaseKey);
                        testDatabaseConnection();
                        console.log('Supabase client initialized successfully');
                        return supabaseClient;
                    } else {
                        throw new Error('Supabase SDK not loaded');
                    }
                } catch (error) {
                    console.error('Error initializing Supabase:', error);
                    showToast('Database Error', 'Failed to initialize database connection. Please refresh the page.', 'error');
                    return null;
                }
            }

            async function testDatabaseConnection() {
                try {
                    const { data, error } = await supabaseClient.from('yoyo_sessions').select('id').limit(1);
                    if (error && error.code !== '42P01') { throw error; }
                    showToast('Database Connected', 'YoYo database initialized and ready!', 'success');
                } catch (error) {
                    console.error('Database connection test failed:', error);
                    showToast('Database Warning', 'Database connected but may have issues. Check console for details.', 'warning');
                }
            }

            function checkYoYoEvents(elapsedMilliseconds) {
                if (nextEventIndex >= yoyoScheduleData.length) return;
                const elapsedSeconds = elapsedMilliseconds / 1000;
                const nextEvent = yoyoScheduleData[nextEventIndex];

                if (elapsedSeconds >= nextEvent.total_time_seconds) {
                    const event = nextEvent;
                    if (event.action === 'start') playSound(startSound, 880);
                    else if (event.action === 'out' || event.action === 'back') playSound(backSound, 1040);
                    else if (event.action === 'recovery') playSound(recoverySound, 660);

                    document.getElementById('yoyoLevel').textContent = event.level !== null ? event.level : '--';
                    document.getElementById('yoyoLeg').textContent = event.leg !== null ? event.leg : '--';
                    document.getElementById('yoyoDistance').textContent = `${event.total_distance_m}m`;

                    if (!event.is_recovery && event.total_distance_m > 0) {
                        synchronizeAllPlayerDistances(event.total_distance_m);
                    }
                    nextEventIndex++;
                }
            }

            function updateNextActionTimer(elapsedMilliseconds) {
                if (nextEventIndex >= yoyoScheduleData.length) {
                    document.getElementById('nextAction').textContent = 'Test End';
                    document.getElementById('timeToNextAction').textContent = '0.0s';
                    return;
                }
                const elapsedSeconds = elapsedMilliseconds / 1000;
                const nextEvent = yoyoScheduleData[nextEventIndex];
                let actionText = nextEvent.action.charAt(0).toUpperCase() + nextEvent.action.slice(1);
                if (actionText === 'Out' || actionText === 'Back') actionText = `Shuttle (${nextEvent.total_distance_m}m)`;
                document.getElementById('nextAction').textContent = actionText;
                const timeRemaining = nextEvent.total_time_seconds - elapsedSeconds;
                document.getElementById('timeToNextAction').textContent = timeRemaining > 0 ? `${timeRemaining.toFixed(1)}s` : '0.0s';
            }

            function synchronizeAllPlayerDistances(newDistance) {
                document.querySelectorAll('.athlete-row').forEach(row => {
                    const athleteId = row.dataset.athleteName;
                    const checkbox = document.getElementById('checkbox-' + athleteId);
                    const distanceSelect = document.getElementById('distance-' + athleteId);
                    const warningState = parseInt(row.getAttribute('data-state'));

                    if (checkbox && checkbox.checked && distanceSelect && warningState !== 2) {
                        if ([...distanceSelect.options].some(option => option.value == newDistance)) distanceSelect.value = newDistance.toString();
                        if (activeSessionData) {
                            const athleteName = athleteId.charAt(0).toUpperCase() + athleteId.slice(1);
                            updatePlayerState(athleteName, newDistance, warningState, false);
                        }
                    }
                });
                updateCurrentSessionProgress();
                updateDropdownOptions();
            }

            function getMinimumLockedDistance() {
                const lockedAthletes = document.querySelectorAll('.athlete-row[data-state="2"]');
                let minDistance = null;
                lockedAthletes.forEach(row => {
                    const athleteId = row.dataset.athleteName;
                    const distanceSelect = document.getElementById('distance-' + athleteId);
                    if (distanceSelect) {
                        const currentDistance = parseInt(distanceSelect.value);
                        if (minDistance === null || currentDistance < minDistance) minDistance = currentDistance;
                    }
                });
                return minDistance;
            }

            function updateDropdownOptions() {
                const minLockedDistance = getMinimumLockedDistance();
                document.querySelectorAll('.athlete-row').forEach(row => {
                    const athleteId = row.dataset.athleteName;
                    const distanceSelect = document.getElementById('distance-' + athleteId);
                    const isLocked = row.getAttribute('data-state') === '2';
                    if (distanceSelect && !isLocked) {
                        const options = distanceSelect.querySelectorAll('option');
                        options.forEach(option => {
                            const optionValue = parseInt(option.value);
                            option.style.display = (minLockedDistance !== null && optionValue < minLockedDistance) ? 'none' : '';
                        });
                        const currentValue = parseInt(distanceSelect.value);
                        if (minLockedDistance !== null && currentValue < minLockedDistance) {
                            const availableOption = Array.from(options).find(opt => parseInt(opt.value) >= minLockedDistance && opt.style.display !== 'none');
                            if (availableOption) distanceSelect.value = availableOption.value;
                        }
                    }
                });
            }

            function toggleAthleteWarning(athleteName) {
                if (!sessionStarted) {
                    const checkbox = document.getElementById('checkbox-' + athleteName);
                    if (checkbox) {
                        checkbox.checked = !checkbox.checked;
                        togglePlayerSelection(athleteName);
                        checkbox.dispatchEvent(new Event('change'));
                    }
                    return;
                }

                if (sessionStarted && !yoyoTestStarted) {
                    alert('Please start the test first before changing athlete warning states.');
                    return;
                }

                const checkbox = document.getElementById('checkbox-' + athleteName);
                if (!checkbox || !checkbox.checked) {
                    alert('This player is not selected for the current test.');
                    return;
                }

                const athleteRow = document.getElementById('athlete-' + athleteName);
                const distanceSelect = document.getElementById('distance-' + athleteName);
                const currentState = (parseInt(athleteRow.getAttribute('data-state')) + 1) % 3;

                setAthleteRowState(athleteRow, currentState);
                distanceSelect.disabled = (currentState === 2);

                updateDropdownOptions();
                if (activeSessionData) updatePlayerState(athleteName, distanceSelect.value, currentState, currentState === 2);
                updateCurrentSession();
                updateCurrentSessionProgress();

                if (currentState === 2) {
                    addToRankings(athleteName, distanceSelect.value);
                    updateOtherPlayersDistance(athleteName, distanceSelect.value);
                    saveAthleteData(athleteName, distanceSelect.value, currentState, currentSession.name, currentSession.testDate)
                        .then(success => {
                            if (success) {
                                const capitalizedAthleteName = athleteName.charAt(0).toUpperCase() + athleteName.slice(1);
                                showToast('Player Eliminated', `${capitalizedAthleteName} eliminated at ${distanceSelect.value}m - Data saved!`, 'warning');
                                loadAllTimeBestRankings();
                            }
                        });
                }
            }

            function updateOtherPlayersDistance(eliminatedPlayerName, eliminatedDistance) {
                document.querySelectorAll('.athlete-row').forEach(row => {
                    const athleteId = row.dataset.athleteName;
                    const checkbox = document.getElementById('checkbox-' + athleteId);
                    const distanceSelect = document.getElementById('distance-' + athleteId);
                    const warningState = parseInt(row.getAttribute('data-state'));

                    if (checkbox && checkbox.checked && athleteId !== eliminatedPlayerName && warningState !== 2 && distanceSelect && !distanceSelect.disabled) {
                        if ([...distanceSelect.options].some(option => option.value == eliminatedDistance)) {
                            distanceSelect.value = eliminatedDistance;
                        }
                        distanceSelect.style.backgroundColor = '#fff3cd';
                        distanceSelect.style.border = '2px solid #ffc107';
                        setTimeout(() => {
                            distanceSelect.style.backgroundColor = '';
                            distanceSelect.style.border = '';
                        }, 2000);
                    }
                });
                updateCurrentSessionProgress();
            }

            async function saveAthleteData(athleteName, distance, warningState, sessionName = '', testDate = null) {
                try {
                    const sessionDateInput = document.getElementById('sessionDate');
                    const selectedDate = testDate || sessionDateInput?.value || new Date().toISOString().split('T')[0];
                    const { data, error } = await supabaseClient.from('yoyo_sessions').insert({
                        athlete_name: athleteName.charAt(0).toUpperCase() + athleteName.slice(1),
                        distance_meters: parseInt(distance),
                        warning_state: warningState,
                        session_name: sessionName || currentSession.name || 'Default Session',
                        test_date: selectedDate
                    });
                    if (error) { console.error('Error saving athlete data:', error); return false; }
                    console.log('Athlete data saved successfully:', data);
                    return true;
                } catch (error) { console.error('Error saving athlete data:', error); return false; }
            }

            async function checkForActiveSession() {
                try {
                    const { data, error } = await supabaseClient.from('active_sessions').select('*, session_player_states (*)').in('session_status', ['started', 'test_running']).order('created_at', { ascending: false }).limit(1);
                    if (error) { console.error('Error checking for active session:', error); return null; }
                    if (data && data.length > 0) { activeSessionData = data[0]; return activeSessionData; }
                    return null;
                } catch (error) { console.error('Error checking for active session:', error); return null; }
            }

            async function restoreActiveSession(sessionData) {
                try {
                    activeSessionData = sessionData;
                    currentSession.sessionId = sessionData.session_id;
                    currentSession.name = sessionData.session_name;
                    currentSession.testDate = sessionData.test_date;
                    sessionStarted = true;
                    yoyoTestStarted = sessionData.session_status === 'test_running';

                    if (yoyoTestStarted && sessionData.test_start_time) {
                        testStartTime = new Date(sessionData.test_start_time);
                        const elapsedSeconds = (new Date() - testStartTime) / 1000;
                        nextEventIndex = 0;
                        for (let i = 0; i < yoyoScheduleData.length; i++) {
                            if (yoyoScheduleData[i].total_time_seconds > elapsedSeconds) {
                                nextEventIndex = i;
                                break;
                            }
                            if (i === yoyoScheduleData.length - 1) nextEventIndex = yoyoScheduleData.length;
                        }
                        if (nextEventIndex > 0) {
                            const lastEvent = yoyoScheduleData[nextEventIndex - 1];
                            document.getElementById('yoyoLevel').textContent = lastEvent.level !== null ? lastEvent.level : '--';
                            document.getElementById('yoyoLeg').textContent = lastEvent.leg !== null ? lastEvent.leg : '--';
                            document.getElementById('yoyoDistance').textContent = `${lastEvent.total_distance_m}m`;
                        }
                    }

                    const selectedPlayers = sessionData.selected_players || [];
                    document.querySelectorAll('.athlete-checkbox').forEach(cb => { cb.checked = false; });
                    selectedPlayers.forEach(playerName => {
                        const checkbox = document.getElementById('checkbox-' + playerName.toLowerCase());
                        if (checkbox) checkbox.checked = true;
                    });

                    if (sessionData.session_player_states) {
                        sessionData.session_player_states.forEach(playerState => {
                            const athleteId = playerState.athlete_name.toLowerCase();
                            const athleteRow = document.getElementById('athlete-' + athleteId);
                            const distanceSelect = document.getElementById('distance-' + athleteId);
                            if (athleteRow && distanceSelect) {
                                setAthleteRowState(athleteRow, playerState.warning_state);
                                distanceSelect.value = playerState.current_distance.toString();
                                distanceSelect.disabled = playerState.warning_state === 2;
                            }
                        });
                    }

                    document.querySelectorAll('.athlete-row').forEach(row => {
                        const athleteId = row.dataset.athleteName;
                        const checkbox = document.getElementById('checkbox-' + athleteId);
                        const isUnselected = !(checkbox && checkbox.checked);
                        row.classList.toggle('opacity-50', isUnselected);
                        row.classList.toggle('pe-none', isUnselected);
                    });

                    const baseName = sessionData.session_name.split(' - ')[0];
                    document.getElementById('sessionName').value = baseName;
                    document.getElementById('sessionDate').value = sessionData.test_date;

                    updateDropdownOptions();
                    updateWorkflowUI();
                    updateCurrentSessionProgress();
                    setWarningSystemState(yoyoTestStarted);
                    disablePlayerSelection();

                    if (yoyoTestStarted && testStartTime) {
                        document.getElementById('timerCard').style.display = 'block';
                        document.getElementById('testStartTimeDisplay').textContent = testStartTime.toLocaleTimeString();
                        timerInterval = setInterval(updateTimer, 100);
                        updateTimer();
                    }

                    showToast('Session Restored', `Active session "${sessionData.session_name}" restored`, 'success');
                    return true;
                } catch (error) {
                    console.error('Error restoring active session:', error);
                    showToast('Restore Error', 'Failed to restore active session', 'error');
                    resetWorkflow();
                    return false;
                }
            }

            async function createDatabaseSession(sessionName, testDate, selectedPlayers) {
                try {
                    const { data: sessionData, error: sessionError } = await supabaseClient.from('active_sessions').insert({ session_name: sessionName, test_date: testDate, session_status: 'started', selected_players: selectedPlayers }).select().single();
                    if (sessionError) throw sessionError;
                    const playerStates = selectedPlayers.map(playerName => ({ session_id: sessionData.session_id, athlete_name: playerName.charAt(0).toUpperCase() + playerName.slice(1), current_distance: 0, warning_state: 0, is_eliminated: false }));
                    const { error: statesError } = await supabaseClient.from('session_player_states').insert(playerStates);
                    if (statesError) throw statesError;
                    activeSessionData = sessionData;
                    currentSession.sessionId = sessionData.session_id;
                    currentSession.name = sessionName;
                    currentSession.testDate = testDate;
                    return sessionData;
                } catch (error) { console.error('Error creating database session:', error); throw error; }
            }

            async function updateSessionStatus(status, startTime = null) {
                if (!activeSessionData) return;
                try {
                    const updateData = { session_status: status, updated_at: new Date().toISOString() };
                    if (startTime) updateData.test_start_time = startTime.toISOString();
                    const { error } = await supabaseClient.from('active_sessions').update(updateData).eq('session_id', activeSessionData.session_id);
                    if (error) throw error;
                    activeSessionData.session_status = status;
                    if (startTime) activeSessionData.test_start_time = startTime.toISOString();
                } catch (error) { console.error('Error updating session status:', error); throw error; }
            }

            async function updatePlayerState(athleteName, distance, warningState, isEliminated = false) {
                if (!activeSessionData) return;
                const capitalizedAthleteName = athleteName.charAt(0).toUpperCase() + athleteName.slice(1);
                try {
                    const updateData = { current_distance: parseInt(distance), warning_state: warningState, is_eliminated: isEliminated, updated_at: new Date().toISOString() };
                    if (isEliminated) updateData.elimination_time = new Date().toISOString();
                    const { error } = await supabaseClient.from('session_player_states').update(updateData).eq('session_id', activeSessionData.session_id).eq('athlete_name', capitalizedAthleteName);
                    if (error) throw error;
                } catch (error) { console.error('Error updating player state:', error); throw error; }
            }

            async function completeSession() {
                if (!activeSessionData) return;
                try {
                    await updateSessionStatus('completed');
                    activeSessionData = null;
                    currentSession.sessionId = null;
                } catch (error) { console.error('Error completing session:', error); throw error; }
            }

            async function deleteActiveSession() {
                if (!activeSessionData) return;
                try {
                    const { error } = await supabaseClient.from('active_sessions').delete().eq('session_id', activeSessionData.session_id);
                    if (error) throw error;
                    activeSessionData = null;
                    currentSession.sessionId = null;
                } catch (error) { console.error('Error deleting active session:', error); throw error; }
            }

            function updateCurrentSession() {
                currentSession.athletes = {};
                document.querySelectorAll('.athlete-row').forEach(row => {
                    const athleteId = row.dataset.athleteName;
                    const athleteName = athleteId.charAt(0).toUpperCase() + athleteId.slice(1);
                    const distanceSelect = document.getElementById('distance-' + athleteId);
                    const warningState = parseInt(row.getAttribute('data-state'));
                    currentSession.athletes[athleteName] = {
                        distance: distanceSelect ? parseInt(distanceSelect.value) : 0,
                        warningState: warningState
                    };
                });
            }

            function addToRankings(athleteName, distance) {
                currentSession.rankings.push({ athlete: athleteName, distance: parseInt(distance), timestamp: new Date().toLocaleTimeString(), position: currentSession.rankings.length + 1 });
                updateRankingsDisplay();
            }

            function updateRankingsDisplay() {
                updateCurrentSessionProgress();
            }

            async function loadAllTimeBestRankings() {
                const allTimeBestList = document.getElementById('allTimeBestList');
                const totalDistancesList = document.getElementById('totalDistancesList');
                try {
                    const { data, error } = await supabaseClient.from('yoyo_sessions').select('athlete_name, distance_meters, session_name, test_date').order('distance_meters', { ascending: false });
                    if (error) throw error;
                    if (!data || data.length === 0) {
                        allTimeBestList.innerHTML = '<p class="text-center opacity-50 font-11">No YoYo test data found.</p>';
                        totalDistancesList.innerHTML = '<p class="text-center opacity-50 font-11">No distance data available.</p>';
                        return;
                    }

                    const athleteBests = {};
                    data.forEach(record => {
                        if (!athleteBests[record.athlete_name] || record.distance_meters > athleteBests[record.athlete_name].distance_meters) {
                            athleteBests[record.athlete_name] = record;
                        }
                    });
                    const sortedBests = Object.values(athleteBests).sort((a, b) => b.distance_meters - a.distance_meters).slice(0, 15);
                    allTimeBestList.innerHTML = sortedBests.length === 0 ? '<p class="text-center opacity-50 font-11">No personal best data available.</p>' : sortedBests.map((record, index) => {
                        const pos = index + 1;
                        const medal = pos === 1 ? ['fa-trophy', 'color-yellow-dark'] : pos === 2 ? ['fa-medal', 'color-grey'] : pos === 3 ? ['fa-award', 'color-brown-dark'] : ['fa-circle', 'color-highlight'];
                        const date = new Date(record.test_date).toLocaleDateString();
                        return `<div class="d-flex align-items-center mb-2 pb-2 border-bottom border-light"><div class="me-3 text-center" style="min-width: 30px;"><span class="badge bg-highlight color-white font-10">${pos}</span></div><div class="me-3"><i class="fa ${medal[0]} ${medal[1]} fa-lg"></i></div><div class="flex-grow-1"><h6 class="mb-0 font-600">${record.athlete_name}</h6><p class="font-10 opacity-70 mb-0">${record.session_name} - ${date}</p></div><div class="text-end"><h5 class="mb-0 font-700 color-highlight">${record.distance_meters}m</h5></div></div>`;
                    }).join('');

                    const totalDistances = {};
                    data.forEach(record => { totalDistances[record.athlete_name] = (totalDistances[record.athlete_name] || 0) + record.distance_meters; });
                    const sortedTotals = Object.entries(totalDistances).map(([name, total]) => ({ athlete_name: name, total_distance: total })).sort((a, b) => b.total_distance - a.total_distance);
                    totalDistancesList.innerHTML = sortedTotals.length === 0 ? '<p class="text-center opacity-50 font-11">No total distance data available.</p>' : sortedTotals.map((record, index) => `<div class="d-flex align-items-center mb-2"><div class="me-3" style="min-width: 25px;"><span class="badge bg-green-dark color-white font-9">${index + 1}</span></div><div class="flex-grow-1"><h6 class="font-13 font-600 mb-0">${record.athlete_name}</h6></div><div class="text-end"><span class="font-12 font-700 color-green-dark">${record.total_distance.toLocaleString()}m</span></div></div>`).join('');
                } catch (error) {
                    console.error('Error loading historical rankings:', error);
                    allTimeBestList.innerHTML = '<p class="text-center opacity-50 font-11">Error loading rankings data.</p>';
                    totalDistancesList.innerHTML = '<p class="text-center opacity-50 font-11">Error loading total distances.</p>';
                }
            }

            async function updateCurrentSessionProgress() {
                const list = document.getElementById('currentSessionList');
                if (!sessionStarted) { list.innerHTML = '<p class="text-center opacity-50 font-11">No active session. Start a session to see live progress.</p>'; return; }
                const selectedPlayers = getSelectedPlayers();
                if (selectedPlayers.length === 0) { list.innerHTML = '<p class="text-center opacity-50 font-11">No players selected for current session.</p>'; return; }
                let html = '';
                document.querySelectorAll('.athlete-row').forEach(row => {
                    const athleteId = row.dataset.athleteName;
                    if (document.getElementById('checkbox-' + athleteId)?.checked) {
                        const name = athleteId.charAt(0).toUpperCase() + athleteId.slice(1);
                        const state = parseInt(row.getAttribute('data-state'));
                        const dist = document.getElementById('distance-' + athleteId)?.value || '0';
                        const status = state === 0 ? ['fa-circle', 'color-grey', 'Active', 'grey'] : state === 1 ? ['fa-exclamation-triangle', 'color-orange-dark', 'Warning', 'orange'] : ['fa-times-circle', 'color-red-dark', 'Eliminated', 'red'];
                        html += `<div class="d-flex align-items-center mb-2 pb-1"><div class="me-3"><i class="fa ${status[0]} ${status[1]}"></i></div><div class="flex-grow-1"><span class="font-11 font-600">${name}</span></div><div class="text-center me-3"><span class="font-10 opacity-70">${dist}m</span></div><div class="text-end"><span class="badge bg-${status[3]}-dark color-white font-9">${status[2]}</span></div></div>`;
                    }
                });
                list.innerHTML = html || '<p class="text-center opacity-50 font-11">No active players in current session.</p>';
            }

            async function startSession() {
                if (sessionStarted || activeSessionData) { alert('A session is already active. Please finish the current session before starting a new one.'); return; }
                const selectedPlayers = getSelectedPlayers();
                const sessionName = document.getElementById('sessionName').value.trim();
                const sessionDate = document.getElementById('sessionDate').value;
                if (selectedPlayers.length === 0) { alert('Please select at least one player before starting the session.'); return; }
                if (!sessionName) { alert('Please enter a session name before starting.'); return; }
                if (!sessionDate) { alert('Please select a test date before starting.'); return; }

                try {
                    const formattedDate = new Date(sessionDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    const fullSessionName = `${sessionName} - ${formattedDate}`;
                    await createDatabaseSession(fullSessionName, sessionDate, selectedPlayers);
                    sessionStarted = true;
                    currentSession.name = fullSessionName;
                    currentSession.testDate = sessionDate;

                    document.querySelectorAll('.athlete-row').forEach(row => {
                        const athleteId = row.dataset.athleteName;
                        const checkbox = document.getElementById('checkbox-' + athleteId);
                        if (checkbox?.checked) {
                            setAthleteRowState(row, 0);
                            const distSelect = document.getElementById('distance-' + athleteId);
                            if (distSelect) { distSelect.disabled = false; distSelect.value = '0'; }
                            row.classList.remove('opacity-50', 'pe-none');
                        } else {
                            row.classList.add('opacity-50', 'pe-none');
                        }
                    });
                    currentSession.rankings = [];
                    updateRankingsDisplay();
                    updateDropdownOptions();
                    updateWorkflowUI();
                    disablePlayerSelection();
                    showToast('Session Started', `Session "${currentSession.name}" initialized with ${selectedPlayers.length} players`, 'success');
                } catch (error) {
                    console.error('Error starting session:', error);
                    showToast('Session Error', 'Failed to start session. Please try again.', 'error');
                }
            }

            async function startYoYoTest() {
                if (!sessionStarted) { alert('Please start a session first.'); return; }
                try {
                    testStartTime = new Date();
                    await updateSessionStatus('test_running', testStartTime);
                    yoyoTestStarted = true;
                    setWarningSystemState(true);
                    startTimer();
                    updateWorkflowUI();
                    showToast('Test Started', 'YoYo test is now running. Click player names to change warning states.', 'success');
                } catch (error) {
                    console.error('Error starting test:', error);
                    showToast('Test Error', 'Failed to start test. Please try again.', 'error');
                }
            }

            async function finishYoYoTest() {
                if (!sessionStarted) { alert('No session is currently active.'); return; }
                if (!confirm('Are you sure you want to finish the test?\n\nThis will stop the timer, save all current player data, and end the session.')) return;

                try {
                    stopTimer(true);
                    const savePromises = getSelectedPlayers().map(playerName => {
                        const row = document.getElementById('athlete-' + playerName);
                        const distSelect = document.getElementById('distance-' + playerName);
                        const state = parseInt(row.getAttribute('data-state'));
                        if (distSelect && state !== 2) {
                            const capName = playerName.charAt(0).toUpperCase() + playerName.slice(1);
                            return saveAthleteData(capName, distSelect.value, state, currentSession.name, currentSession.testDate);
                        }
                        return Promise.resolve();
                    });
                    await Promise.all(savePromises);
                    await completeSession();
                    showToast('Test Completed', `Session "${currentSession.name}" finished and saved successfully!`, 'success');

                    resetTimer();
                    yoyoTestStarted = false;
                    sessionStarted = false;
                    setWarningSystemState(false);
                    activeSessionData = null;
                    currentSession.sessionId = null;
                    currentSession.name = '';
                    currentSession.testDate = null;
                    updateWorkflowUI();
                    enablePlayerSelection();
                    loadAllTimeBestRankings();
                } catch (error) {
                    console.error('Error finishing test:', error);
                    showToast('Save Error', 'Error finishing test. Please try again.', 'error');
                }
            }

            async function resetWorkflow() {
                if (confirm('Are you sure you want to reset the workflow?\n\nThis will ABORT any running test and discard unsaved progress for the current session.')) {
                    try {
                        if (activeSessionData) await deleteActiveSession();
                        sessionStarted = false;
                        yoyoTestStarted = false;
                        setWarningSystemState(false);
                        activeSessionData = null;
                        currentSession.sessionId = null;
                        currentSession.name = '';
                        resetTimer();

                        document.querySelectorAll('.athlete-row').forEach(row => {
                           setAthleteRowState(row, 0);
                            const distSelect = document.getElementById('distance-' + row.dataset.athleteName);
                            if (distSelect) { distSelect.disabled = false; distSelect.value = '0'; }
                        });
                        deselectAllPlayers();
                        updateCurrentSessionProgress();
                        updateDropdownOptions();
                        updateWorkflowUI();
                        enablePlayerSelection();
                        showToast('Workflow Reset', 'Active session aborted. Ready to start a new session.', 'warning');
                    } catch (error) {
                        console.error('Error resetting workflow:', error);
                        showToast('Reset Error', 'Error resetting workflow. Please try again.', 'error');
                    }
                }
            }

            function togglePlayerSelection(athleteName) {
                const row = document.getElementById('athlete-' + athleteName);
                const cb = document.getElementById('checkbox-' + athleteName);
                row.classList.toggle('opacity-50', !cb.checked);
                row.classList.toggle('pe-none', !cb.checked);
            }

            function startTimer() {
                testStartTime = new Date();
                nextEventIndex = 0;
                isPaused = false;
                timeWhenPaused = 0;
                document.getElementById('testStartTimeDisplay').textContent = testStartTime.toLocaleTimeString();
                document.getElementById('timerCard').style.display = 'block';

                const btn = document.getElementById('pauseResumeBtn');
                if (btn) {
                    btn.classList.remove('bg-green-dark');
                    btn.classList.add('bg-yellow-dark');
                    btn.querySelector('i').className = 'fa fa-pause me-2';
                    const text = btn.querySelector('.btn-text');
                    if (text) text.textContent = 'Pause';
                }
                checkYoYoEvents(0);
                updateNextActionTimer(0);
                timerInterval = setInterval(updateTimer, 100);
            }

            function updateTimer() {
                if (!testStartTime) return;
                const elapsed = new Date() - testStartTime;
                document.getElementById('timerMinutes').textContent = Math.floor(elapsed / 60000).toString().padStart(2, '0');
                document.getElementById('timerSeconds').textContent = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
                document.getElementById('timerMilliseconds').textContent = Math.floor((elapsed % 1000) / 100).toString();
                checkYoYoEvents(elapsed);
                updateNextActionTimer(elapsed);
            }

            function stopTimer(hardStop = false) {
                if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
                [startSound, backSound, recoverySound].forEach(sound => {
                    if (sound) { sound.pause(); if (hardStop) sound.currentTime = 0; }
                });
            }

            function updateWorkflowUI() {
                const step1 = document.getElementById('step1');
                const step2 = document.getElementById('step2');
                const step3 = document.getElementById('step3');
                const startBtn = document.getElementById('startSessionBtn');
                const nameInput = document.getElementById('sessionName');
                const dateInput = document.getElementById('sessionDate');
                const disable = sessionStarted || yoyoTestStarted;
                startBtn.classList.toggle('disabled', disable);
                startBtn.style.opacity = disable ? '0.5' : '1';
                startBtn.style.pointerEvents = disable ? 'none' : 'auto';
                nameInput.disabled = disable;
                dateInput.disabled = disable;
                step1.style.display = !sessionStarted ? 'block' : 'none';
                step2.style.display = sessionStarted && !yoyoTestStarted ? 'block' : 'none';
                step3.style.display = sessionStarted && yoyoTestStarted ? 'block' : 'none';
            }

            function disablePlayerSelection() {
                document.querySelectorAll('.athlete-checkbox').forEach(cb => { cb.disabled = true; });
                const controls = document.querySelector('.selection-controls');
                if (controls) { controls.style.opacity = '0.5'; controls.style.pointerEvents = 'none'; }
            }

            function enablePlayerSelection() {
                document.querySelectorAll('.athlete-checkbox').forEach(cb => { cb.disabled = false; });
                const controls = document.querySelector('.selection-controls');
                if (controls) { controls.style.opacity = '1'; controls.style.pointerEvents = 'auto'; }
            }

            function resetTimer() {
                stopTimer(true);
                testStartTime = null;
                nextEventIndex = 0;
                isPaused = false;
                timeWhenPaused = 0;
                document.getElementById('timerMinutes').textContent = '00';
                document.getElementById('timerSeconds').textContent = '00';
                document.getElementById('timerMilliseconds').textContent = '0';
                document.getElementById('testStartTimeDisplay').textContent = '--:--';
                document.getElementById('yoyoLevel').textContent = '--';
                document.getElementById('yoyoLeg').textContent = '--';
                document.getElementById('yoyoDistance').textContent = '0m';
                document.getElementById('nextAction').textContent = '--';
                document.getElementById('timeToNextAction').textContent = '--';
                document.getElementById('timerCard').style.display = 'none';
            }

            function togglePauseYoYoTest() {
                const btn = document.getElementById('pauseResumeBtn');
                if (!btn) return;
                const icon = btn.querySelector('i');
                const text = btn.querySelector('.btn-text');
                if (!isPaused) {
                    if (!timerInterval) return;
                    isPaused = true;
                    timeWhenPaused = new Date() - testStartTime;
                    stopTimer();
                    btn.classList.remove('bg-yellow-dark');
                    btn.classList.add('bg-green-dark');
                    icon.className = 'fa fa-play me-2';
                    if (text) text.textContent = 'Resume';
                    showToast('Test Paused', 'Timer has been paused.', 'info');
                } else {
                    isPaused = false;
                    testStartTime = new Date() - timeWhenPaused;
                    timeWhenPaused = 0;
                    timerInterval = setInterval(updateTimer, 100);
                    btn.classList.remove('bg-green-dark');
                    btn.classList.add('bg-yellow-dark');
                    icon.className = 'fa fa-pause me-2';
                    if (text) text.textContent = 'Pause';
                    showToast('Test Resumed', 'Timer is running again.', 'success');
                }
            }

            function resetYoYoTest() {
                if (confirm('Are you sure you want to reset the YoYo test? This will reset the timer and all athlete states but keep the session active.')) {
                    resetTimer();
                    yoyoTestStarted = false;
                    setWarningSystemState(false);
                    updateWorkflowUI();
                    document.querySelectorAll('.athlete-row').forEach(row => {
                        if (row.querySelector('.athlete-checkbox')?.checked) {
                            setAthleteRowState(row, 0);
                            const distSelect = document.getElementById('distance-' + row.dataset.athleteName);
                            if (distSelect) { distSelect.disabled = false; distSelect.value = '0'; }
                        }
                    });
                    currentSession.rankings = [];
                    updateRankingsDisplay();
                    updateDropdownOptions();
                    showToast('Test Reset', 'Timer and player states have been reset.', 'info');
                }
            }

            function selectAllPlayers() {
                document.querySelectorAll('.athlete-checkbox').forEach(cb => { cb.checked = true; });
                document.querySelectorAll('.athlete-row').forEach(row => {
                    row.classList.remove('opacity-50', 'pe-none');
                });
            }

            function deselectAllPlayers() {
                document.querySelectorAll('.athlete-checkbox').forEach(cb => { cb.checked = false; });
                document.querySelectorAll('.athlete-row').forEach(row => {
                    row.classList.add('opacity-50', 'pe-none');
                });
            }

            function getSelectedPlayers() {
                return Array.from(document.querySelectorAll('.athlete-checkbox:checked')).map(cb => cb.id.replace('checkbox-', ''));
            }

            function setWarningSystemState(enabled) {
                const contentDiv = document.querySelector('.card-style .content');
                if (contentDiv) {
                    contentDiv.classList.toggle('warning-system-disabled', !enabled);
                }
            }

            async function resetDatabase() {
                if (prompt('This will DELETE ALL data. Type "DELETE" to confirm.') !== 'DELETE') {
                    alert('Database reset cancelled.');
                    return;
                }
                try {
                    showToast('Resetting DB...', 'Please wait, deleting all data.', 'info');
                    await supabaseClient.from('active_sessions').delete().neq('session_id', '00000000-0000-0000-0000-000000000000');
                    await supabaseClient.from('yoyo_sessions').delete().neq('id', 0);
                    resetWorkflow();
                    loadAllTimeBestRankings();
                    showToast('Database Reset', 'All YoYo test data has been deleted.', 'success');
                } catch (error) {
                    console.error('Error resetting database:', error);
                    showToast('DB Reset Error', 'Could not delete data. Check console.', 'error');
                }
            }

            function populateDistanceDropdown(selectElement, schedule) {
                selectElement.innerHTML = '';
                [...new Set(schedule.map(item => item.total_distance_m))].sort((a, b) => a - b).forEach(distance => {
                    const option = document.createElement('option');
                    option.value = distance;
                    option.textContent = `${distance}m`;
                    selectElement.appendChild(option);
                });
            }

            // --- INITIALIZATION AND EVENT LISTENERS FOR YOYO PAGE ---
            async function initializeYoYoPage() {
                startSound = document.getElementById('startSound');
                backSound = document.getElementById('backSound');
                recoverySound = document.getElementById('recoverySound');

                document.querySelectorAll('.distance-dropdown').forEach(dropdown => {
                    populateDistanceDropdown(dropdown, yoyoScheduleData);
                    dropdown.addEventListener('change', () => updateCurrentSessionProgress());
                });

                document.querySelectorAll('.athlete-row').forEach(row => {
                    const athleteId = row.dataset.athleteName;
                    setAthleteRowState(row, 0);

                    row.querySelector('.athlete-name').addEventListener('click', () => toggleAthleteWarning(athleteId));
                    document.getElementById('checkbox-' + athleteId).addEventListener('change', () => togglePlayerSelection(athleteId));
                    const distanceSelect = document.getElementById('distance-' + athleteId);
                    if(distanceSelect){
                        distanceSelect.addEventListener('change', function() {
                            if (row.getAttribute('data-state') === '2') updateDropdownOptions();
                            if (activeSessionData) {
                                const state = parseInt(row.getAttribute('data-state'));
                                const name = athleteId.charAt(0).toUpperCase() + athleteId.slice(1);
                                updatePlayerState(name, this.value, state, state === 2);
                            }
                        });
                    }
                });
                updateDropdownOptions();

                document.getElementById('selectAllPlayersBtn').addEventListener('click', selectAllPlayers);
                document.getElementById('deselectAllPlayersBtn').addEventListener('click', deselectAllPlayers);
                document.getElementById('startSessionBtn').addEventListener('click', startSession);
                document.getElementById('startTestBtn').addEventListener('click', startYoYoTest);
                document.getElementById('finishTestBtn').addEventListener('click', finishYoYoTest);
                document.getElementById('resetWorkflowBtn').addEventListener('click', resetWorkflow);
                document.getElementById('resetDatabaseBtn').addEventListener('click', resetDatabase);
                document.getElementById('pauseResumeBtn').addEventListener('click', togglePauseYoYoTest);
                document.getElementById('resetYoYoTestBtn').addEventListener('click', resetYoYoTest);

                initializeSupabase();
                loadAllTimeBestRankings();
                document.getElementById('sessionDate').value = new Date().toISOString().split('T')[0];

                try {
                    const activeSession = await checkForActiveSession();
                    if (activeSession) await restoreActiveSession(activeSession);
                    else {
                        setWarningSystemState(false);
                        updateWorkflowUI();
                        updateCurrentSessionProgress();
                    }
                } catch (error) {
                    console.error('Error during session check:', error);
                    setWarningSystemState(false);
                    updateWorkflowUI();
                    updateCurrentSessionProgress();
                }
            }
            initializeYoYoPage();
        }
        // --- End of YoYo Test Page Specific Logic ---


        //Caching Global Variables
        var i, e, el; //https://www.w3schools.com/js/js_performance.asp

        //Attaching Menu Hider
        var menuHider = document.getElementsByClassName('menu-hider');
        if(!menuHider.length){var hider = document.createElement('div'); hider.setAttribute("class", "menu-hider");document.body.insertAdjacentElement('beforebegin', hider);}
		setTimeout(function() {if(hider.classList.contains('menu-active')){hider.classList.remove('menu-active');}}, 50);

        //Demo function for programtic creation of Menu
        //menu('menu-settings', 'show', 250);

        //Activating Menus
        document.querySelectorAll('.menu').forEach(el=>{el.style.display='block'})

        //Validator
        var inputField = document.querySelectorAll('input');
        if(inputField.length){
            var mailValidator = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
            var phoneValidator = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
            var nameValidator = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
            var passwordValidator = /[A-Za-z]{2}[A-Za-z]*[ ]?[A-Za-z]*/;
            var numberValidator = /^(0|[1-9]\d*)$/;
            var linkValidator = /^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;
            var textValidator = /[A-Za-z]{2}[A-Za-z]*[ ]?[A-Za-z]*/;

            function valid(el){
                el.parentElement.querySelectorAll('.valid')[0].classList.remove('disabled');
                el.parentElement.querySelectorAll('.invalid')[0].classList.add('disabled');
            }
            function invalid(el){
                el.parentElement.querySelectorAll('.valid')[0].classList.add('disabled');
                el.parentElement.querySelectorAll('.invalid')[0].classList.remove('disabled');
            }
            function unfilled(el){
                el.parentElement.querySelectorAll('em')[0].classList.remove('disabled');
                el.parentElement.querySelectorAll('.valid')[0].classList.add('disabled');
                el.parentElement.querySelectorAll('.invalid')[0].classList.add('disabled');
            }

            var regularField = document.querySelectorAll('.input-style input:not([type="date"])')
            regularField.forEach(el => el.addEventListener('keyup', e => {
                if(!el.value == ""){
                    el.parentElement.classList.add('input-style-active');
                    el.parentElement.querySelector('em').classList.add('disabled');
                } else {
                    el.parentElement.querySelectorAll('.valid')[0].classList.add('disabled');
                    el.parentElement.querySelectorAll('.invalid')[0].classList.add('disabled');
                    el.parentElement.classList.remove('input-style-active');
                    el.parentElement.querySelector('em').classList.remove('disabled');
                }
            }));

            var regularTextarea = document.querySelectorAll('.input-style textarea')
            regularTextarea.forEach(el => el.addEventListener('keyup', e => {
                if(!el.value == ""){
                    el.parentElement.classList.add('input-style-active');
                    el.parentElement.querySelector('em').classList.add('disabled');
                } else {
                    el.parentElement.classList.remove('input-style-active');
                    el.parentElement.querySelector('em').classList.remove('disabled');
                }
            }));

            var selectField = document.querySelectorAll('.input-style select')
            selectField.forEach(el => el.addEventListener('change', e => {
                if(el.value !== "default"){
                    el.parentElement.classList.add('input-style-active');
                    el.parentElement.querySelectorAll('.valid')[0].classList.remove('disabled');
                    el.parentElement.querySelectorAll('.invalid, em, span')[0].classList.add('disabled');
                }
                if(el.value == "default"){
                    el.parentElement.querySelectorAll('span, .valid, em')[0].classList.add('disabled');
                    el.parentElement.querySelectorAll('.invalid')[0].classList.remove('disabled');
                    el.parentElement.classList.add('input-style-active');
                }
            }));

            var dateField = document.querySelectorAll('.input-style input[type="date"]')
            dateField.forEach(el => el.addEventListener('change', e => {
                el.parentElement.classList.add('input-style-active');
                el.parentElement.querySelectorAll('.valid')[0].classList.remove('disabled');
                el.parentElement.querySelectorAll('.invalid')[0].classList.add('disabled');
            }));

            var validateField = document.querySelectorAll('.validate-field input, .validator-field textarea');
            if(validateField.length){
                validateField.forEach(el => el.addEventListener('keyup', e => {
                    var getAttribute = el.getAttribute('type');
                    switch(getAttribute){
                        case 'name': nameValidator.test(el.value) ? valid(el) : invalid(el); break;
                        case 'number': numberValidator.test(el.value) ? valid(el) : invalid(el); break;
                        case 'email': mailValidator.test(el.value) ? valid(el) : invalid(el); break;
                        case 'text': textValidator.test(el.value) ? valid(el) : invalid(el); break;
                        case 'url': linkValidator.test(el.value) ? valid(el) : invalid(el); break;
                        case 'tel': phoneValidator.test(el.value) ? valid(el) : invalid(el); break;
                        case 'password': passwordValidator.test(el.value) ? valid(el) : invalid(el); break;
                    }
                    if(el.value === ""){unfilled(el);}
                }));
            }
        }

		//OTP Boxes - Appkit 3.0
		var otp = document.querySelectorAll('.otp');
		if(otp[0]){
			otp.forEach(el => {
				el.addEventListener('focus', (e) => {el.value = "";})
				el.addEventListener('input', (e) => {el.nextElementSibling ? el.nextElementSibling.focus() : el.blur();});
			});
		}

        //Image Sliders
        var splide = document.getElementsByClassName('splide');
        if(splide.length){
            var singleSlider = document.querySelectorAll('.single-slider');
            if(singleSlider.length){
                singleSlider.forEach(function(e){
                    var single = new Splide( '#'+e.id, {
                        type:'loop',
                        autoplay:true,
                        interval:4000,
                        perPage: 1,
                    }).mount();
                    var sliderNext = document.querySelectorAll('.slider-next');
                    var sliderPrev = document.querySelectorAll('.slider-prev');
                    sliderNext.forEach(el => el.addEventListener('click', el => {single.go('>');}));
                    sliderPrev.forEach(el => el.addEventListener('click', el => {single.go('<');}));
                });
            }

            var doubleSlider = document.querySelectorAll('.double-slider');
            if(doubleSlider.length){
                doubleSlider.forEach(function(e){
                     var double = new Splide( '#'+e.id, {
                        type:'loop',
                        autoplay:true,
                        interval:4000,
                        arrows:false,
                        perPage: 2,
                    }).mount();
                });
            }

            var trippleSlider = document.querySelectorAll('.tripple-slider');
            if(trippleSlider.length){
                trippleSlider.forEach(function(e){
                     var tripple = new Splide( '#'+e.id, {
                        type:'loop',
                        autoplay:true,
                        padding: {
                            left   :'0px',
                            right: '80px',
                        },
                        interval:4000,
                        arrows:false,
                        perPage: 2,
                        perMove: 1,
                    }).mount();
                });
            }
        }

        var topicSlider = document.querySelectorAll('.topic-slider');
        if(topicSlider.length){
             var topic = new Splide( '.topic-slider', {
                type:'loop',
                autoplay:false,
                padding: {
                    left   :'15px',
                    right: '40px',
                },
                arrows:false,
                perPage: 3,
                perMove: 1,
            }).mount();
        }
        var storySlider = document.querySelectorAll('.story-slider');
        if(storySlider.length){
             var topic = new Splide( '.story-slider', {
                type:'loop',
                autoplay:false,
                padding: {
                    left   :'0px',
                    right: '40px',
                },
                arrows:false,
                perPage: 4,
                perMove: 1,
            }).mount();
        }


        //Don't jump on Empty Links
        const emptyHref = document.querySelectorAll('a[href="#"]')
        emptyHref.forEach(el => el.addEventListener('click', e => {
            e.preventDefault();
            return false;
        }));

        //Map Page
        var fullMap = document.querySelectorAll('.hide-map');
        if(fullMap.length){
            var mapActivator = document.querySelectorAll('.show-map');
            var mapDisabler = document.querySelectorAll('.hide-map');
            mapActivator[0].addEventListener('click',function(e){
               document.getElementsByClassName('card-overlay')[0].classList.add('disabled');
               document.getElementsByClassName('card-center')[0].classList.add('disabled');
               document.getElementsByClassName('hide-map')[0].classList.remove('disabled');
            })
            mapDisabler[0].addEventListener('click',function(e){
               document.getElementsByClassName('card-overlay')[0].classList.remove('disabled');
               document.getElementsByClassName('card-center')[0].classList.remove('disabled');
               document.getElementsByClassName('hide-map')[0].classList.add('disabled');
            })
        }

        var checkedCard = document.querySelectorAll('.check-card');
        checkedCard.forEach(el => el.addEventListener('click', e => {
            if(el.querySelector('input').getAttribute('checked') =="checked"){
                el.querySelector('input').removeAttribute('checked');
            } else {
                el.querySelector('input').setAttribute('checked', 'checked');
            }
        }));



        //To Do List
        var toDoList = document.querySelectorAll('.todo-list a');
        toDoList.forEach(el => el.addEventListener('click', e => {
            el.classList.toggle('opacity-80');
            if(el.querySelector('input').getAttribute('checked') == "checked"){
                el.querySelector('input').removeAttribute('checked');
            } else {
                el.querySelector('input').setAttribute('checked', 'checked');
            }
        }));

        //Setting Sidebar Widths
        var menus = document.querySelectorAll('.menu');
        function menuFunction(){
            if(menus.length){
                var menuSidebar = document.querySelectorAll('.menu-box-left, .menu-box-right');
                menuSidebar.forEach(function(e){
                    if(e.getAttribute('data-menu-width') === "cover"){
                        e.style.width = '100%'
                    } else {
                        e.style.width = (e.getAttribute('data-menu-width')) +'px'
                    }
                })
                var menuSheets = document.querySelectorAll('.menu-box-bottom, .menu-box-top, .menu-box-modal');
                menuSheets.forEach(function(e){
                    if(e.getAttribute('data-menu-width') === "cover"){
                        e.style.width = '100%'
                        e.style.height = '100%'
                    } else {
                        e.style.width = (e.getAttribute('data-menu-width')) +'px'
                        e.style.height = (e.getAttribute('data-menu-height')) +'px'
                    }
                })

                //Opening Menus
                var menuOpen = document.querySelectorAll('[data-menu]');
                var wrappers = document.querySelectorAll('.header, #footer-bar, .page-content');

                menuOpen.forEach(el => el.addEventListener('click',e =>{
                    //Close Existing Opened Menus
                    const activeMenu = document.querySelectorAll('.menu-active');
                    for(let i=0; i < activeMenu.length; i++){activeMenu[i].classList.remove('menu-active');}
                    //Open Clicked Menu
                    var menuData = el.getAttribute('data-menu');
                    document.getElementById(menuData).classList.add('menu-active');
                    document.getElementsByClassName('menu-hider')[0].classList.add('menu-active');
                    //Check and Apply Effects
                    var menu = document.getElementById(menuData);
                    var menuEffect = menu.getAttribute('data-menu-effect');
                    var menuLeft = menu.classList.contains('menu-box-left');
                    var menuRight = menu.classList.contains('menu-box-right');
                    var menuTop = menu.classList.contains('menu-box-top');
                    var menuBottom = menu.classList.contains('menu-box-bottom');
                    var menuWidth = menu.offsetWidth;
                    var menuHeight = menu.offsetHeight;
                    var menuTimeout = menu.getAttribute('data-menu-hide');

                    if(menuTimeout){
                        setTimeout(function(){
                            document.getElementById(menuData).classList.remove('menu-active');
                            document.getElementsByClassName('menu-hider')[0].classList.remove('menu-active');
                        },menuTimeout)
                    }

                    if(menuEffect === "menu-push"){
                        var menuWidth = document.getElementById(menuData).getAttribute('data-menu-width');
                        if(menuLeft){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateX("+menuWidth+"px)"}}
                        if(menuRight){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateX(-"+menuWidth+"px)"}}
                        if(menuBottom){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateY(-"+menuHeight+"px)"}}
                        if(menuTop){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateY("+menuHeight+"px)"}}
                    }
                    if(menuEffect === "menu-parallax"){
                        var menuWidth = document.getElementById(menuData).getAttribute('data-menu-width');
                        if(menuLeft){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateX("+menuWidth/10+"px)"}}
                        if(menuRight){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateX(-"+menuWidth/10+"px)"}}
                        if(menuBottom){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateY(-"+menuHeight/5+"px)"}}
                        if(menuTop){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateY("+menuHeight/5+"px)"}}
                    }
                }));

                //Closing Menus
                const menuClose = document.querySelectorAll('.close-menu, .menu-hider');
                menuClose.forEach(el => el.addEventListener('click',e =>{
                    const activeMenu = document.querySelectorAll('.menu-active');
                    for(let i=0; i < activeMenu.length; i++){activeMenu[i].classList.remove('menu-active');}
                    for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateX(-"+0+"px)"}
                }));
            }
        }
        menuFunction();

        function activateMenus(){
            const menuActive = document.querySelectorAll('[data-menu-active]')[0];
            if(menuActive){
                var selectedMenu = menuActive.getAttribute('data-menu-active');
                document.querySelectorAll('#'+selectedMenu)[0].classList.add('active-nav');
            }
        }

        //Back Button
        const backButton = document.querySelectorAll('[data-back-button]');
        if(backButton.length){
            backButton.forEach(el => el.addEventListener('click',e =>{
                e.stopPropagation;
                e.preventDefault;
                window.history.go(-1);
            }));
        }


        //Back to Top
        function backUp(){
            const backToTop = document.querySelectorAll('.back-to-top-icon, .back-to-top-badge, .back-to-top');
            if(backToTop){
                backToTop.forEach(el => el.addEventListener('click',e =>{
                    window.scrollTo({ top: 0, behavior: `smooth` })
                }));
            }
        }

        //Check iOS Version and add min-ios15 class if higher or equal to iOS15
        function iOSversion() {
          let d, v;
          if (/iP(hone|od|ad)/.test(navigator.platform)) {
            v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            d = {status: true, version: parseInt(v[1], 10), info: parseInt(v[1], 10)+'.'+parseInt(v[2], 10)+'.'+parseInt(v[3] || 0, 10)};
          }else{d = {status:false, version: false, info:''}}
          return d;
        }
        let iosVer = iOSversion();
        if (iosVer.version > 14) {document.querySelectorAll('#page')[0].classList.add('min-ios15');}

        //Card Extender
        const cards = document.getElementsByClassName('card');
        function card_extender(){
            var headerHeight, footerHeight, headerOnPage;
            var headerOnPage = document.querySelectorAll('.header:not(.header-transparent)')[0];
            var footerOnPage = document.querySelectorAll('#footer-bar')[0];

            headerOnPage ? headerHeight = document.querySelectorAll('.header')[0].offsetHeight : headerHeight = 0
            footerOnPage ? footerHeight = document.querySelectorAll('#footer-bar')[0].offsetHeight : footerHeight = 0

            for (let i = 0; i < cards.length; i++) {
                if(cards[i].getAttribute('data-card-height') === "cover"){
                    if (window.matchMedia('(display-mode: fullscreen)').matches) {var windowHeight = window.outerHeight;}
                    if (!window.matchMedia('(display-mode: fullscreen)').matches) {var windowHeight = window.innerHeight;}
                    //Fix for iOS 15 pages with data-height="cover"
                    var coverHeight = windowHeight + 'px';
                    // - Remove this for iOS 14 issues - var coverHeight = windowHeight - headerHeight - footerHeight + 'px';

                }
                if(cards[i].getAttribute('data-card-height') === "cover-card"){
                    var windowHeight = window.innerHeight;
                    var coverHeight = windowHeight - 200 + 'px';
                    cards[i].style.height =  coverHeight
                }
                if(cards[i].getAttribute('data-card-height') === "cover-full"){
                    if (window.matchMedia('(display-mode: fullscreen)').matches) {var windowHeight = window.outerHeight;}
                    if (!window.matchMedia('(display-mode: fullscreen)').matches) {var windowHeight = window.innerHeight;}
                    var coverHeight = windowHeight + 'px';
                    cards[i].style.height =  coverHeight
                }
                if(cards[i].hasAttribute('data-card-height')){
                    var getHeight = cards[i].getAttribute('data-card-height');
                    cards[i].style.height= getHeight +'px';
                    if(getHeight === "cover"){
                        var totalHeight = getHeight
                        cards[i].style.height =  coverHeight
                    }
                }
            }
        }

        if(cards.length){
            card_extender();
            window.addEventListener("resize", card_extender);
        }

        //Activate Remembered Highlight
        function selectHighlight(){
            var rememberHighlight = localStorage.getItem(pwaName+'-Highlight');
            if(rememberHighlight){
                document.querySelectorAll('[data-change-highlight="'+rememberHighlight+'"]')[0].classList.add('highlight-active');
                document.body.setAttribute('data-highlight', rememberHighlight);
            }
        }

        //Page Highlights
        function highlightColors(){
            var highlightData = document.querySelectorAll('[data-change-highlight]');
            highlightData.forEach(el => el.addEventListener('click', e =>{
                const activeHighlight = document.querySelectorAll('.highlight-active');
                for(let i=0; i < activeHighlight.length; i++){activeHighlight[i].classList.remove('highlight-active');}
                el.classList.add('highlight-active');
                var highlight = el.getAttribute('data-change-highlight');
                var pageHighlight = document.querySelectorAll('.page-highlight');
                if(pageHighlight.length){pageHighlight.forEach(function(e){e.remove();});}
                var loadHighlight = document.createElement("link");
                loadHighlight.rel = "stylesheet";
                loadHighlight.className = "page-highlight";
                loadHighlight.type = "text/css";
                loadHighlight.href = 'styles/highlights/highlight_' + highlight +'.css';
                document.getElementsByTagName("head")[0].appendChild(loadHighlight);
                document.body.setAttribute('data-highlight', 'highlight-'+highlight)
                localStorage.setItem(pwaName+'-Highlight', highlight)
            }))
            var rememberHighlight = localStorage.getItem(pwaName+'-Highlight');
            if(rememberHighlight){
                var loadHighlight = document.createElement("link");
                loadHighlight.rel = "stylesheet";
                loadHighlight.className = "page-highlight";
                loadHighlight.type = "text/css";
                loadHighlight.href = 'styles/highlights/highlight_' + rememberHighlight +'.css';
                if(!document.querySelectorAll('.page-highlight').length){
                    document.getElementsByTagName("head")[0].appendChild(loadHighlight);
                    document.body.setAttribute('data-highlight', 'highlight-'+rememberHighlight)
                }
            }
        }
        highlightColors();


        //Background Gradient Color
        var gradientData = document.querySelectorAll('[data-change-background]');
        gradientData.forEach(el => el.addEventListener('click',e =>{
            var gradient = el.getAttribute('data-change-background');
            document.body.setAttribute('data-gradient', 'body-'+gradient+'');
            localStorage.setItem(pwaName+'-Gradient', gradient)
        }));

        //Set Background and Highlight
        var pageBackground = localStorage.getItem(pwaName+'-Gradient');
        if(pageBackground){document.body.setAttribute('data-gradient', 'body-'+pageBackground+'');}


        //Dark Mode
        function checkDarkMode(){
            const toggleDark = document.querySelectorAll('[data-toggle-theme]');
            function activateDarkMode(){
                document.body.classList.add('theme-dark');
                document.body.classList.remove('theme-light', 'detect-theme');
                for(let i = 0; i < toggleDark.length; i++){toggleDark[i].checked="checked"};
                localStorage.setItem(pwaName+'-Theme', 'dark-mode');
            }
            function activateLightMode(){
                document.body.classList.add('theme-light');
                document.body.classList.remove('theme-dark','detect-theme');
                for(let i = 0; i < toggleDark.length; i++){toggleDark[i].checked=false};
                localStorage.setItem(pwaName+'-Theme', 'light-mode');
            }
            function removeTransitions(){var falseTransitions = document.querySelectorAll('.btn, .header, #footer-bar, .menu-box, .menu-active'); for(let i = 0; i < falseTransitions.length; i++) {falseTransitions[i].style.transition = "all 0s ease";}}
            function addTransitions(){var trueTransitions = document.querySelectorAll('.btn, .header, #footer-bar, .menu-box, .menu-active'); for(let i = 0; i < trueTransitions.length; i++) {trueTransitions[i].style.transition = "";}}

            function setColorScheme() {
                const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
                const isLightMode = window.matchMedia("(prefers-color-scheme: light)").matches
                const isNoPreference = window.matchMedia("(prefers-color-scheme: no-preference)").matches
                window.matchMedia("(prefers-color-scheme: dark)").addListener(e => e.matches && activateDarkMode())
                window.matchMedia("(prefers-color-scheme: light)").addListener(e => e.matches && activateLightMode())
                if(isDarkMode) activateDarkMode();
                if(isLightMode) activateLightMode();
            }

            //Activating Dark Mode
            var darkModeSwitch = document.querySelectorAll('[data-toggle-theme]')
            darkModeSwitch.forEach(el => el.addEventListener('click',e =>{
                if(document.body.className == "theme-light"){ removeTransitions(); activateDarkMode();}
                else if(document.body.className == "theme-dark"){ removeTransitions(); activateLightMode();}
                setTimeout(function(){addTransitions();},350);
            }));

            //Set Color Based on Remembered Preference.
            if(localStorage.getItem(pwaName+'-Theme') == "dark-mode"){for(let i = 0; i < toggleDark.length; i++){toggleDark[i].checked="checked"};document.body.className = 'theme-dark';}
            if(localStorage.getItem(pwaName+'-Theme') == "light-mode"){document.body.className = 'theme-light';} if(document.body.className == "detect-theme"){setColorScheme();}

            //Detect Dark/Light Mode
            const darkModeDetect = document.querySelectorAll('.detect-dark-mode');
            darkModeDetect.forEach(el => el.addEventListener('click',e =>{
                document.body.classList.remove('theme-light', 'theme-dark');
                document.body.classList.add('detect-theme')
                setTimeout(function(){setColorScheme();},50)
            }))
        }
        if(localStorage.getItem(pwaName+'-Theme') == "dark-mode"){document.body.className = 'theme-dark';}
        if(localStorage.getItem(pwaName+'-Theme') == "light-mode"){document.body.className = 'theme-light';}


        //Accordion Rotate
        const accordionBtn = document.querySelectorAll('.accordion-btn');
        if(accordionBtn.length){
            accordionBtn.forEach(el => el.addEventListener('click', event => {
                el.querySelector('i:last-child').classList.toggle('fa-rotate-180');
            }));
        }

        //File Upload
        const inputArray = document.getElementsByClassName('upload-file');
        if(inputArray.length){
            inputArray[0].addEventListener('change',prepareUpload,false);
                function prepareUpload(event){
                  if (this.files && this.files[0]) {
                  var img = document.getElementById('image-data');
                  img.src = URL.createObjectURL(this.files[0]);
              }
                const files = event.target.files;
                const fileName = files[0].name;
                document.getElementsByClassName('file-data')[0].classList.add('disabled');
                document.getElementsByClassName('upload-file-data')[0].classList.remove('disabled');
                document.getElementsByClassName('upload-file-name')[0].innerHTML = files[0].name;
                document.getElementsByClassName('upload-file-modified')[0].innerHTML = files[0].lastModifiedDate;
                document.getElementsByClassName('upload-file-size')[0].innerHTML = files[0].size/1000+'kb';
                document.getElementsByClassName('upload-file-type')[0].innerHTML = files[0].type;
            }

        }
        var locationBut = document.querySelectorAll('.get-location');
        if(locationBut.length){
            var locationSupport = document.getElementsByClassName('location-support')[0]
            if (typeof(locationSupport) != 'undefined' && locationSupport != null){
                //Geo Location
                if ("geolocation" in navigator){
                    locationSupport.innerHTML = 'Your browser and device <strong class="color-green2-dark">support</strong> Geolocation.';
                }else{
                    locationSupport.innerHTML = 'Your browser and device <strong class="color-red2-dark">support</strong> Geolocation.';
                }
            }
            function geoLocate() {
                const locationCoordinates = document.querySelector('.location-coordinates');
                function success(position) {
                    const latitude  = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    locationCoordinates.innerHTML = '<strong>Longitude:</strong> ' + longitude + '<br><strong>Latitude:</strong> '+ latitude;
                    var mapL1 = 'https://www.google.com/maps/embed/v1/view?key=AIzaSyAM3nxDVrkjyKwdIZp8QOplmBKLRVI5S_Y&center=';
                    var mapL2 = latitude+',';
                    var mapL3 = longitude;
                    var mapL4 = '&zoom=16&maptype=satellite'
                    var mapL5 = ''
                    var mapLinkEmbed = mapL1 + mapL2 + mapL3 + mapL4;
                    var mapLinkAddress = mapL1 + mapL2 + mapL3 + mapL5;
                    document.getElementsByClassName('location-map')[0].setAttribute('src',mapLinkEmbed);
                    document.getElementsByClassName('location-button')[0].setAttribute('href',mapLinkAddress);
                    document.getElementsByClassName('location-button')[0].classList.remove('disabled');
                }
                function error() {locationCoordinates.textContent = 'Unable to retrieve your location';}
                if (!navigator.geolocation) {locationCoordinates.textContent = 'Geolocation is not supported by your browser';}
                else {locationCoordinates.textContent = 'Locating';navigator.geolocation.getCurrentPosition(success, error);}
            }
            var getLocation = document.getElementsByClassName('get-location')[0]
            if (typeof(getLocation) != 'undefined' && getLocation != null){
                getLocation.addEventListener('click',function(){this.classList.add('disabled'); geoLocate();})
            }
        }

        //Card Effects
        const cardScale = document.querySelectorAll('.card-scale');
        if(cardScale.length){
            cardScale.forEach(el => el.addEventListener('mouseenter', event => {el.querySelectorAll('img')[0].classList.add('card-scale-image');}));
            cardScale.forEach(el => el.addEventListener('mouseleave', event => {el.querySelectorAll('img')[0].classList.remove('card-scale-image');}));
        }

        const cardHide = document.querySelectorAll('.card-hide');
        if(cardHide.length){
            cardHide.forEach(el => el.addEventListener('mouseenter', event => {el.querySelectorAll('.card-center, .card-bottom, .card-top, .card-overlay')[0].classList.add('card-hide-image');}));
            cardHide.forEach(el => el.addEventListener('mouseleave', event => {el.querySelectorAll('.card-center, .card-bottom, .card-top, .card-overlay')[0].classList.remove('card-hide-image');}));
        }

        const cardRotate = document.querySelectorAll('.card-rotate');
        if(cardRotate.length){
            cardRotate.forEach(el => el.addEventListener('mouseenter', event => {el.querySelectorAll('img')[0].classList.add('card-rotate-image');}));
            cardRotate.forEach(el => el.addEventListener('mouseleave', event => {el.querySelectorAll('img')[0].classList.remove('card-rotate-image');}));
        }

        const cardGray = document.querySelectorAll('.card-grayscale');
        if (cardGray.length){
            cardGray.forEach(el => el.addEventListener('mouseenter', event => {el.querySelectorAll('img')[0].classList.add('card-grayscale-image');}));
            cardGray.forEach(el => el.addEventListener('mouseleave', event => {el.querySelectorAll('img')[0].classList.remove('card-grayscale-image');}));
        }

        const cardBlur = document.querySelectorAll('.card-blur');
        if(cardBlur.length){
            cardBlur.forEach(el => el.addEventListener('mouseenter', event => {el.querySelectorAll('img')[0].classList.add('card-blur-image');}));
            cardBlur.forEach(el => el.addEventListener('mouseleave', event => {el.querySelectorAll('img')[0].classList.remove('card-blur-image');}));
        }

        //Adding Local Storage for Visited Links
        var checkVisited = document.querySelectorAll('.check-visited');
            if(checkVisited.length){
            function check_visited_links(){
                var visited_links = JSON.parse(localStorage.getItem(pwaName+'_Visited_Links')) || [];
                var links = document.querySelectorAll('.check-visited a');
                for (let i = 0; i < links.length; i++) {
                    var that = links[i];
                    that.addEventListener('click',function(e){
                        var clicked_url = this.href;
                        if (visited_links.indexOf(clicked_url)==-1) {
                            visited_links.push(clicked_url);
                            localStorage.setItem(pwaName+'_Visited_Links', JSON.stringify(visited_links));
                        }
                    })
                    if (visited_links.indexOf(that.href)!== -1) {
                        that.className += ' visited-link';
                    }
                }
            }
            check_visited_links();
        }

        //Footer Bar Activation

        var footerBar6 = document.querySelectorAll('.footer-bar-6')[0];
        if(footerBar6){
            var footerBar6_select = document.querySelectorAll('.footer-bar-6 .active-nav')[0];
            var footerBar6_circle = document.querySelectorAll('.footer-bar-6 .circle-nav')[0];
            footerBar6_select.insertAdjacentHTML('beforeend', '<em></em>');
            footerBar6_circle.insertAdjacentHTML('beforeend', '<strong><u></u></strong>');
        }

        //Detect Ad Block

        var adblockMessage = document.getElementById('adblock-message')
        if(adblockMessage){
            var adblockEnabled = false;
            document.body.innerHTML += '<div class="adsbygoogle" id="ad-detector"></div>';
            var adElement = document.getElementById('ad-detector');
            var adElementStyle = getComputedStyle(adElement, null);
            if(adElementStyle.display === 'none') {document.getElementById('adblock-message').classList.remove('disabled');}
        }

        //Ads
        let fixedAds = document.querySelectorAll('.fixed-ad')[0];
        let scrollAds = document.querySelectorAll('.scroll-ad')[0];

        if(fixedAds || scrollAds){
            //Activate scroll Ad
            var activateScrollAd = document.getElementById('activate-scroll-ad');
            activateScrollAd.addEventListener('click',function(){
                scrollAds.classList.add('scroll-ad-visible');
                scrollAds.classList.remove('disabled');
                fixedAds.classList.add('disabled');
            })

            //Activate Fixed Ad
            var activateFixedAd = document.getElementById('activate-fixed-ad');
            activateFixedAd.addEventListener('click',function(){
                scrollAds.classList.add('disabled');
                fixedAds.classList.remove('disabled');
            })
        }

        //Scroll Ads
        var scrollItems = document.querySelectorAll('.scroll-ad, .header-auto-show')
        if(scrollItems.length){
            var scrollAd = document.querySelectorAll('.scroll-ad');
            var scrollHeader = document.querySelectorAll('.header-auto-show');
            var pageTitle = document.querySelectorAll('.page-title');
            window.addEventListener('scroll', function() {
                if (document.querySelectorAll('.scroll-ad, .header-auto-show').length) {
                    function showScrollAd(){scrollAd[0].classList.add('scroll-ad-visible');}
                    function hideScrollAd(){scrollAd[0].classList.remove('scroll-ad-visible');}
                    function showHeader(){scrollHeader[0].classList.add('header-active');}
                    function hideHeader(){scrollHeader[0].classList.remove('header-active');}
                    function hideTitle(){pageTitle[0].style.opacity ="0"}
                    function showTitle(){pageTitle[0].style.opacity ="1"}
                    var window_height = window.outerWidth;
                    var total_scroll_height = document.documentElement.scrollTop
                    let inside_header = total_scroll_height <= 80;
                    var passed_header = total_scroll_height >= 80;
                    let inside_title = total_scroll_height <= 40;
                    var passed_title = total_scroll_height >= 40;
                    let inside_footer = (window_height - total_scroll_height + 1000) <= 150
                    if(scrollAd.length){
                        inside_header ? hideScrollAd() : null
                        passed_header ? showScrollAd() : null
                        inside_footer ? hideScrollAd() : null
                    }
                    if(scrollHeader.length){
                        inside_header ? hideHeader() : null
                        passed_header ? showHeader() : null
                    }
                    if(pageTitle.length){
                        inside_title ? showTitle() : null
                        passed_title ? hideTitle() : null
                    }
                }
            });
        }

        //Stepper
        var stepperAdd = document.querySelectorAll('.stepper-add');
        var stepperSub = document.querySelectorAll('.stepper-sub');
        if(stepperAdd.length){
            stepperAdd.forEach(el => el.addEventListener('click', event => {
                var currentValue = el.parentElement.querySelector('input').value
                el.parentElement.querySelector('input').value = +currentValue + 1
            }))

            stepperSub.forEach(el => el.addEventListener('click', event => {
                var currentValue = el.parentElement.querySelector('input').value
                el.parentElement.querySelector('input').value = +currentValue - 1
            }))
        }

        //Link List Toggle
        var linkListToggle = document.querySelectorAll('[data-trigger-switch]:not([data-toggle-theme])');
        if(linkListToggle.length){
            linkListToggle.forEach(el => el.addEventListener('click', event => {
                var switchData = el.getAttribute('data-trigger-switch');
                var getCheck = document.getElementById(switchData);
                getCheck.checked ? getCheck.checked = false : getCheck.checked = true;
            }))
        }

        //Classic Toggle
        var classicToggle = document.querySelectorAll('.classic-toggle');
        if(classicToggle.length){
            classicToggle.forEach(el => el.addEventListener('click', event=>{
                el.querySelector('i:last-child').classList.toggle('fa-rotate-180');
                el.querySelector('i:last-child').style.transition = "all 250ms ease"
            }))
        }

        //Toasts
        var toastTrigger = document.querySelectorAll('[data-toast]');
        if(toastTrigger.length){
            toastTrigger.forEach(el => el.addEventListener('click', event => {
                var toastData = el.getAttribute('data-toast')
                var notificationToast = document.getElementById(toastData);
                var notificationToast = new bootstrap.Toast(notificationToast);
                notificationToast.show();
            }));
        }


        //Tooltips
        /*Deprecated feature for Mobiles. Requires popper.min.js v2 to work
        var tooltips = document.querySelectorAll('[data-bs-tooltip]');
        if(tooltips.length){
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
              return new bootstrap.Tooltip(tooltipTriggerEl)
            })
        }
        */


        //Dropdown
        var dropdownElementList = [].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]'))
        if(dropdownElementList.length){
            var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
            return new bootstrap.Dropdown(dropdownToggleEl);
            })
        }


        var workingHours = document.querySelectorAll('.show-business-opened, .show-business-closed, .working-hours');
        if(workingHours.length){
            //Working Hours
            var d = new Date();
            var n = d.getDay();
            var now = d.getHours() + "." + d.getMinutes();
            var weekdays = [
                ["Sunday"],
                ["Monday", 9.00, 17.00],
                ["Tuesday", 9.00, 17.00],
                ["Wednesday", 9.00, 17.00],
                ["Thursday", 9.00, 17.00],
                ["Friday", 9.00, 17.00],
                ["Saturday", 9.00, 13.00] // we are closed, sorry!
            ];
            var day = weekdays[n];
            var openClass = document.querySelectorAll('.show-business-opened');
            var closeClass = document.querySelectorAll('.show-business-closed');

            if (now > day[1] && now < day[2] || now > day[3] && now < day[4]) {
                openClass.forEach(function(e){e.classList.remove('disabled');})
                closeClass.forEach(function(e){e.classList.add('disabled');})
            }
             else {
                openClass.forEach(function(e){e.classList.add('disabled');})
                closeClass.forEach(function(e){e.classList.remove('disabled');})
            }

            var workingHours = document.querySelectorAll('.working-hours[data-day]');
            workingHours.forEach(function(entry) {
                var matchDay = entry.getAttribute('data-day');
                if (matchDay === day[0]){
                    var matchData = '[data-day="'+day[0]+'"]'
                    if (now > day[1] && now < day[2] || now > day[3] && now < day[4]) {
                        document.querySelectorAll(matchData)[0].classList.add('bg-green-dark');
                        document.querySelectorAll(matchData +' p').forEach(function(whiteText){whiteText.classList.add('color-white')});
                    }
                     else {
                        document.querySelectorAll(matchData)[0].classList.add('bg-red-dark');
                        document.querySelectorAll(matchData +' p').forEach(function(whiteText){whiteText.classList.add('color-white')});
                    }
                }
            });
        }



        //Vibrate API
        var vibrateButton = document.querySelectorAll('[data-vibrate]');
        if(vibrateButton.length){
            var startVibrating = document.getElementsByClassName('start-vibrating')[0];
            var stopVibrating = document.getElementsByClassName('stop-vibrating')[0];

            startVibrating.addEventListener('click',function(){
                var vibrateTime = document.getElementsByClassName('vibrate-demo')[0].value;
                window.navigator.vibrate(vibrateTime);
            })
            stopVibrating.addEventListener('click',function(){
                window.navigator.vibrate(0);
            })
            vibrateButton.forEach(el => el.addEventListener('click',e =>{
                var vibrateTime = el.getAttribute('data-vibrate');
                window.navigator.vibrate(vibrateTime);
            }));
        }

        //Time Ads
        var timedAd = document.querySelectorAll('[data-timed-ad]');
        if(timedAd.length){
            timedAd.forEach(el => el.addEventListener('click',e =>{
                var timedAdTime = el.getAttribute('data-timed-ad');
                var timedAdData = el.getAttribute('data-menu');
                var timedAdTimer = timedAdTime;
                var timerAdFunction = setInterval(function(){
                  if(timedAdTimer <= 1){
                        clearInterval(timerAdFunction);
                        document.getElementById(timedAdData).querySelectorAll('.fa-times')[0].classList.remove('disabled');
                        document.getElementById(timedAdData).querySelectorAll('.close-menu')[0].classList.remove('no-click');
                        document.getElementById(timedAdData).querySelectorAll('span')[0].style.display ="none";
                  } else {
                      //console.log(timedAdTimer);
                  }
                  document.getElementById(timedAdData).querySelectorAll('span')[0].innerHTML = timedAdTimer -= 1;
                }, 1000);
            }));
        }

        //Auto Show Ads
        var autoAd = document.querySelectorAll('[data-auto-show-ad]');
        if(autoAd.length){
            var autoAdTime = autoAd[0].getAttribute('data-auto-show-ad');
            var timerAdFunction = setInterval(function(){
                if(autoAdTime <= 1)
                {
                    clearInterval(timerAdFunction);
                    var autoAdId = autoAd[0].getAttribute('data-menu');
                    document.getElementById(autoAdId).classList.add('menu-active');
                    var autoAdCloseTime = autoAd[0].getAttribute('data-timed-ad');
                    var downloadTimer = setInterval(function () {
                        if (autoAdCloseTime <= 0) {
                            clearInterval(downloadTimer);
                            document.getElementById(autoAdId).querySelectorAll('.fa-times')[0].classList.remove('disabled');
                            document.getElementById(autoAdId).querySelectorAll('.close-menu')[0].classList.remove('no-click');
                            document.getElementById(autoAdId).querySelectorAll('span')[0].style.display ="none";
                        }
                        document.getElementById(autoAdId).querySelectorAll('span')[0].innerHTML = autoAdCloseTime -= 1;
                    }, 1000);
                }
                autoAdTime -= 1;
            }, 1000);
        }

        //Visit Detection
        var visitDetection = document.querySelectorAll('.visit-detection')[0];
        if(visitDetection){
            var neverVisited = document.querySelectorAll('.never-visited')[0];
            var beforeVisited = document.querySelectorAll('.before-visited')[0];
            var visitBeforeTime = document.querySelectorAll('.visit-before-time')[0];
            var lastVisitValue = localStorage.getItem(pwaName+'-Last-Visited');
            var d = new Date();
            var strDate = d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate();
            var strTime = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            if(!lastVisitValue){
                neverVisited.style.display="block";
                beforeVisited.style.display="none";
                localStorage.setItem(pwaName+'-Last-Visited', 'Your last visit was ' + strDate +' at '+ strTime)
            } else {
                neverVisited.style.display="none"
                beforeVisited.style.display="block"
                visitBeforeTime.append(lastVisitValue)
                localStorage.setItem(pwaName+'-Last-Visited', 'Your last visit was ' + strDate +' at '+ strTime)
            }
        }


        //Reading Time
        var readingTextDiv = document.querySelectorAll('.reading-progress-text');
        if(readingTextDiv.length){
            var readingWords = readingTextDiv[0].innerHTML.split(' ').length;
            var readingMinutes = Math.floor(readingWords / 250);
            var readingSeconds = readingWords % 60
            document.getElementsByClassName('reading-progress-words')[0].innerHTML = readingWords
            document.getElementsByClassName('reading-progress-time')[0].innerHTML = readingMinutes + ':' + readingSeconds
        }

        //Text Resizer
        var textSizeChanger = document.querySelectorAll('.text-size-changer');
        if(textSizeChanger.length){
            var textSizeIncrease = document.querySelectorAll('.text-size-increase');
            var textSizeDecrease = document.querySelectorAll('.text-size-decrease');
            var textSizeDefault = document.querySelectorAll('.text-size-default');
            textSizeIncrease[0].addEventListener('click',function(){
                textSizeChanger[0].querySelectorAll('*').forEach(function(element) {
                    const getFontSize = window.getComputedStyle(element).fontSize.split("px",2)[0]
                    element.style.fontSize = (+getFontSize +1) +'px';
                });
            })
            textSizeDecrease[0].addEventListener('click',function(){
                textSizeChanger[0].querySelectorAll('*').forEach(function(element) {
                    const getFontSize = window.getComputedStyle(element).fontSize.split("px",2)[0]
                    element.style.fontSize = (+getFontSize -1) +'px';
                });
            })
            textSizeDefault[0].addEventListener('click',function(){
                textSizeChanger[0].querySelectorAll('*').forEach(function(element) {
                    const getFontSize = window.getComputedStyle(element).fontSize.split("px",2)[0]
                    element.style.fontSize = "";
                });
            })
        }

        //QR Generator
        var qr_image = document.querySelectorAll('.qr-image');
        if(qr_image.length){
            var qr_this = window.location.href;
            var qr_auto = document.getElementsByClassName('generate-qr-auto')[0];
            var qr_api_address = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=';
            if(qr_auto){qr_auto.setAttribute('src', qr_api_address+qr_this)        }
            var qr_btn = document.getElementsByClassName('generate-qr-button')[0];
            if(qr_btn){
                qr_btn.addEventListener('click',function(){
                    var get_qr_url = document.getElementsByClassName('qr-url')[0].value;
                    var qr_api_address = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=';
                    var qr_img = '<img class="mx-auto polaroid-effect shadow-l mt-4 delete-qr" width="200" src="'+qr_api_address+get_qr_url+'" alt="img"><p class="font-11 text-center mb-0">'+get_qr_url+'</p>'
                    document.getElementsByClassName('generate-qr-result')[0].innerHTML = qr_img
                    qr_btn.innerHTML = "Generate New Button"
                })
            }
        }

        if (window.location.protocol === "file:"){
            var linksLocal = document.querySelectorAll('a');
            linksLocal.forEach(el => el.addEventListener('mouseover', event => {
               // console.log("You are seeing these errors because your file is on your local computer. For real life simulations please use a Live Server or a Local Server such as AMPPS or WAMPP or simulate a  Live Preview using a Code Editor like http://brackets.io (it's 100% free) - PWA functions and AJAX Page Transitions will only work in these scenarios.");
            }));
        }

        //Search Page
        var searchField = document.querySelectorAll('[data-search]');
        if(searchField.length){
            var searchResults = document.querySelectorAll('.search-results')
            var searchNoResults = document.querySelectorAll('.search-no-results');
            var searchTotal = document.querySelectorAll(".search-results div")[0].childElementCount;
            var searchTrending = document.querySelectorAll('.search-trending');
            function searchFunction(){
                var searchStr = searchField[0].value;
                var searchVal = searchStr.toLowerCase();
                if (searchVal != '') {
                    searchResults[0].classList.remove('disabled-search-list');
                    var searchFilterItem = document.querySelectorAll('[data-filter-item]');
                    for (let i = 0; i < searchFilterItem.length; i++) {
                        var searchData = searchFilterItem[i].getAttribute('data-filter-name');
                        if(searchData.includes(searchVal)){
                            searchFilterItem[i].classList.remove('disabled');
                            if(searchTrending.length){searchTrending[0].classList.add('disabled');}
                        } else {
                            searchFilterItem[i].classList.add('disabled');
                            if(searchTrending.length){searchTrending[0].classList.remove('disabled');}
                        }
                        var disabledResults = document.querySelectorAll(".search-results div")[0].getElementsByClassName("disabled").length;
                        if(disabledResults === searchTotal){
                            searchNoResults[0].classList.remove('disabled');
                            if(searchTrending.length){searchTrending[0].classList.add('disabled');}
                        } else {
                            searchNoResults[0].classList.add('disabled');
                            if(searchTrending.length){searchTrending[0].classList.add('disabled');}
                        }
                    }
                }
                if (searchVal === '') {
                    searchResults[0].classList.add('disabled-search-list');
                    searchNoResults[0].classList.add('disabled');
                    if(searchTrending.length){searchTrending[0].classList.remove('disabled');}
                }
            };

            searchField[0].addEventListener('keyup', function() {searchFunction();})
            searchField[0].addEventListener('click', function() {searchFunction();})

            var searchClick = document.querySelectorAll('.search-trending a');
            searchClick.forEach(el => el.addEventListener('click', event => {
                var trendingResult = el.querySelectorAll('span')[0].textContent.toLowerCase();
                searchField[0].value  = trendingResult;
                searchField[0].click();
            }));

        }

        //Sharing
		function shareLinks(){
			var shareTitle = document.title;
			var shareText = document.title;
			var shareLink = window.location.href;
			if(document.querySelectorAll('.shareToFacebook, .shareToTwitter, .shareToLinkedIn')[0]){
				document.querySelectorAll('.shareToFacebook, .shareToTwitter, .shareToLinkedIn, .shareToWhatsApp, .shareToMail').forEach(x => {x.setAttribute('target','_blank');});
				document.querySelectorAll('.shareToFacebook').forEach( x=> x.setAttribute("href", "https://www.facebook.com/sharer/sharer.php?u="+shareLink));
				document.querySelectorAll('.shareToTwitter').forEach( x=> x.setAttribute("href", "http://twitter.com/share?text="+shareTitle+"%20"+shareLink));
				document.querySelectorAll('.shareToPinterest').forEach( x=> x.setAttribute("href", "https://pinterest.com/pin/create/button/?url=" + shareLink));
				document.querySelectorAll('.shareToWhatsApp').forEach( x=> x.setAttribute("href", "whatsapp://send?text=" + shareLink));
				document.querySelectorAll('.shareToMail').forEach( x=> x.setAttribute("href", "mailto:?body=" + shareLink));
				document.querySelectorAll('.shareToLinkedIn').forEach( x=> x.setAttribute("href", "https://www.linkedin.com/shareArticle?mini=true&url="+shareLink+"&title="+shareTitle+"&summary=&source="));
			}
			//Menu Share Web API
			if (navigator.canShare){
				const shareData = {title: shareTitle, text: shareText, url: shareLink}
				var shareMenu = document.querySelectorAll('[data-menu="menu-share"], [data-show-share]');
				if(shareMenu){shareMenu.forEach(el => {el.addEventListener('click', async () => {menu('menu-share', 'hide',0); try {await navigator.share(shareData)} catch(err){}});});}
			}
		}

        //Contact Form
        var contactForm = document.querySelectorAll('.contact-form');
        if(contactForm.length){
            var form = document.getElementById('contactForm');
            form.onsubmit = function (e) {
                // Stop the regular form submission
                e.preventDefault();

                //Validate Fields
                var nameField = document.getElementById('contactNameField');
                var mailField = document.getElementById('contactEmailField');
                var textField = document.getElementById('contactMessageTextarea');
                var validateMail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                if(nameField.value === ''){
                    form.setAttribute('data-form','invalid');
                    nameField.classList.add('border-red-dark');
                    document.getElementById('validator-name').classList.remove('disabled');
                } else {
                    form.setAttribute('data-form','valid');
                    document.getElementById('validator-name').classList.add('disabled');
                    nameField.classList.remove('border-red-dark');
                }
                if(mailField.value === ''){
                    form.setAttribute('data-form','invalid');
                    mailField.classList.add('border-red-dark');
                    document.getElementById('validator-mail1').classList.remove('disabled');
                } else {
                    document.getElementById('validator-mail1').classList.add('disabled');
                    if(!validateMail.test(mailField.value)){
                        form.setAttribute('data-form','invalid');
                        mailField.classList.add('border-red-dark');
                        document.getElementById('validator-mail2').classList.remove('disabled');
                    } else{
                        form.setAttribute('data-form','valid');
                        document.getElementById('validator-mail2').classList.add('disabled');
                        mailField.classList.remove('border-red-dark');
                    }
                }
                if(textField.value === ''){
                    form.setAttribute('data-form','invalid');
                    textField.classList.add('border-red-dark');
                    document.getElementById('validator-text').classList.remove('disabled');
                } else{
                    form.setAttribute('data-form','valid');
                    document.getElementById('validator-text').classList.add('disabled');
                    textField.classList.remove('border-red-dark')
                }

                if(form.getAttribute('data-form') === 'valid'){
                    document.querySelectorAll('.form-sent')[0].classList.remove('disabled');
                    document.querySelectorAll('.contact-form')[0].classList.add('disabled');
                    // Collect the form data while iterating over the inputs
                    var data = {};
                    for (let i = 0, ii = form.length; i < ii; ++i) {
                        let input = form[i];
                        if (input.name) {
                            data[input.name] = input.value;
                        }
                    }
                    // Construct an HTTP request
                    var xhr = new XMLHttpRequest();
                    xhr.open(form.method, form.action, true);
                    xhr.setRequestHeader('Accept', 'application/json; charset=utf-8');
                    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                    // Send the collected data as JSON
                    xhr.send(JSON.stringify(data));
                    // Callback function
                    xhr.onloadend = function (response) {if (response.target.status === 200) {console.log('Form Submitted')}};
                }
            };
        }

        //Collapse Flip Icon
        var collapseBtn = document.querySelectorAll('[data-bs-toggle="collapse"]:not(.no-effect)');
        if(collapseBtn.length){
            collapseBtn.forEach(el => el.addEventListener('click',e =>{
                if(el.querySelectorAll('i').length){
                    el.querySelector('i').classList.toggle('fa-rotate-180')
                };
            }));
        }

        //Tabs
        var tabTrigger = document.querySelectorAll('.tab-controls a');
            if(tabTrigger.length){
            tabTrigger.forEach(function(e){
                if(e.hasAttribute('data-active')){
                    var highlightColor = e.parentNode.getAttribute('data-highlight');
                    e.classList.add(highlightColor);
                    e.classList.add('no-click');
                }
            });
            tabTrigger.forEach(el => el.addEventListener('click',e =>{
                var highlightColor = el.parentNode.getAttribute('data-highlight');
                var tabParentGroup = el.parentNode.querySelectorAll('a');
                tabParentGroup.forEach(function(e){
                    e.classList.remove(highlightColor);
                    e.classList.remove('no-click');
                });
                el.classList.add(highlightColor);
                el.classList.add('no-click');
            }));
        }


        //Extending Menu Functions
        function menu(menuName, menuFunction, menuTimeout){
            setTimeout(function(){
                if(menuFunction === "show"){
                    return document.getElementById(menuName).classList.add('menu-active'),
                    document.querySelectorAll('.menu-hider')[0].classList.add('menu-active')
                } else {
                    return document.getElementById(menuName).classList.remove('menu-active'),
                    document.querySelectorAll('.menu-hider')[0].classList.remove('menu-active')
                }
            },menuTimeout)
        }

        var autoActivate = document.querySelectorAll('[data-auto-activate]');
        if(autoActivate.length){
            var autoActivateData = autoActivate[0].getAttribute('data-auto-activate');
            var autoActivateTime = autoActivateData*1000
            setTimeout(function(){
                autoActivate[0].classList.add('menu-active');
                menuHider[0].classList.add('menu-active');
            },autoActivateTime);
        }

        //Copyright Year
        var copyrightYear = document.getElementById('copyright-year');
        if(copyrightYear){
            var dteNow = new Date();
            const intYear = dteNow.getFullYear();
            copyrightYear.textContent = intYear;
        }

        //Check Age
        var checkAge = document.querySelectorAll('.check-age');
        if(checkAge.length){
            checkAge[0].addEventListener('click',function(){
                var dateBirthday = document.querySelectorAll("#date-birth-day")[0].value;
                var dateBirthMonth = document.querySelectorAll("#date-birth-month")[0].value;
                var dateBirthYear = document.querySelectorAll("#date-birth-year")[0].value;
                var age = 18;
                var mydate = new Date();
                mydate.setFullYear(dateBirthYear, dateBirthMonth-1, dateBirthday);

                var currdate = new Date();
                var setDate = new Date();
                setDate.setFullYear(mydate.getFullYear() + age, dateBirthMonth-1, dateBirthday);

                var menuAge = document.querySelectorAll('#menu-age');
                var menuAgeFail = document.querySelectorAll('#menu-age-fail');
                var menuAgeOkay = document.querySelectorAll('#menu-age-okay');

                console.log(currdate);
                console.log(setDate);
                console.log(dateBirthMonth);
                if ((currdate - setDate) > 0){
                    console.log("above 18");
                    menuAge[0].classList.remove('menu-active')
                    menuAgeOkay[0].classList.add('menu-active');
                }else{
                    menuAge[0].classList.remove('menu-active')
                    menuAgeFail[0].classList.add('menu-active');
                }
                return true;
            });
        }

        //Calling Functions Required After External Menus are Loaded
        var dataMenuLoad = document.querySelectorAll('[data-menu-load]')
        dataMenuLoad.forEach(function(e){
            var menuLoad = e.getAttribute('data-menu-load')
            fetch(menuLoad)
            .then(data => data.text())
            .then(html => e.innerHTML = html)
            .then(data => {
                setTimeout(function(){
                    if(dataMenuLoad[dataMenuLoad.length-1] === e){
                        menuFunction();
                        checkDarkMode();
                        activateMenus();
                        shareLinks();
                        highlightColors();
                        selectHighlight();
                        card_extender();
                        backUp();
                    }
                },500);
            })
        })

        //Detecting Mobile OS
        let isMobile = {
            Android: function() {return navigator.userAgent.match(/Android/i);},
            iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
            any: function() {return (isMobile.Android() || isMobile.iOS());}
        };

        const androidDev = document.getElementsByClassName('show-android');
        const iOSDev = document.getElementsByClassName('show-ios');
        const noDev = document.getElementsByClassName('show-no-device');
        if(!isMobile.any()){   for (let i = 0; i < iOSDev.length; i++) {iOSDev[i].classList.add('disabled');} for (let i = 0; i < androidDev.length; i++) {androidDev[i].classList.add('disabled');}}
        if(isMobile.iOS()){    document.querySelectorAll('#page')[0].classList.add('device-is-ios'); for (let i = 0; i < noDev.length; i++) {noDev[i].classList.add('disabled');}for (let i = 0; i < androidDev.length; i++) {androidDev[i].classList.add('disabled');}}
        if(isMobile.Android()){document.querySelectorAll('#page')[0].classList.add('device-is-android'); for (let i = 0; i < iOSDev.length; i++) {iOSDev[i].classList.add('disabled');}for (let i = 0; i < noDev.length; i++) {noDev[i].classList.add('disabled');}}

        //Creating Offline Alert Messages
        var addOfflineClasses = document.querySelectorAll('.offline-message');
        if(!addOfflineClasses.length){
            const offlineAlert = document.createElement('p');
            const onlineAlert = document.createElement('p');
            offlineAlert.className = 'offline-message bg-red-dark color-white';
            offlineAlert.textContent = 'No internet connection detected';
            onlineAlert.className = 'online-message bg-green-dark color-white';
            onlineAlert.textContent = 'You are back online';
            document.getElementsByTagName('body')[0].appendChild(offlineAlert);
            document.getElementsByTagName('body')[0].appendChild(onlineAlert);
        }

        //Online / Offline Settings
        //Activating and Deactivating Links Based on Online / Offline State
        function offlinePage(){
			//Enable the code below to disable offline mode.
            //var anchorsDisabled = document.querySelectorAll('a');
            //anchorsDisabled.forEach(function(e){
            //    var hrefs = e.getAttribute('href');
            //    if(hrefs.match(/.html/)){e.classList.add('show-offline'); e.setAttribute('data-link',hrefs); e.setAttribute('href','#');}
            //});
            var showOffline = document.querySelectorAll('.show-offline');
            showOffline.forEach(el => el.addEventListener('click', event => {
                document.getElementsByClassName('offline-message')[0].classList.add('offline-message-active');
                setTimeout(function(){document.getElementsByClassName('offline-message')[0].classList.remove('offline-message-active');},1500)
            }));
        }
        function onlinePage(){
            var anchorsEnabled = document.querySelectorAll('[data-link]');
            anchorsEnabled.forEach(function (e) {
                var hrefs = e.getAttribute('data-link');
                if (hrefs.match(/.html/)) {e.setAttribute('href', hrefs); e.removeAttribute('data-link', '');}
            });
        }

        //Defining Offline/Online Variables
        var offlineMessage = document.getElementsByClassName('offline-message')[0];
        var onlineMessage = document.getElementsByClassName('online-message')[0];


        //Online / Offine Status
        function isOnline(){
            onlinePage(); onlineMessage.classList.add('online-message-active');
            setTimeout(function(){onlineMessage.classList.remove('online-message-active'); },2000)
            console.info( 'Connection: Online');
        }

        function isOffline(){
            offlinePage(); offlineMessage.classList.add('offline-message-active');
            setTimeout(function(){offlineMessage.classList.remove('offline-message-active'); },2000)
            console.info( 'Connection: Offline');
        }

        var simulateOffline = document.querySelectorAll('.simulate-offline');
        var simulateOnline = document.querySelectorAll('.simulate-online');
        if(simulateOffline.length){
            simulateOffline[0].addEventListener('click',function(){isOffline()});
            simulateOnline[0].addEventListener('click',function(){isOnline()});
        }

        //Check if Online / Offline
        function updateOnlineStatus(event) {var condition = navigator.onLine ? "online" : "offline"; isOnline(); }
        function updateOfflineStatus(event) {isOffline();}
        window.addEventListener('online',  updateOnlineStatus);
        window.addEventListener('offline', updateOfflineStatus);

        //iOS Badge
        const iOSBadge = document.querySelectorAll('.simulate-iphone-badge');
        iOSBadge.forEach(el => el.addEventListener('click',e =>{
            document.getElementsByClassName('add-to-home')[0].classList.add('add-to-home-visible', 'add-to-home-ios');
            document.getElementsByClassName('add-to-home')[0].classList.remove('add-to-home-android');
        }));

        //Android Badge
        const AndroidBadge = document.querySelectorAll('.simulate-android-badge');
        AndroidBadge.forEach(el => el.addEventListener('click',e =>{
            document.getElementsByClassName('add-to-home')[0].classList.add('add-to-home-visible', 'add-to-home-android');
            document.getElementsByClassName('add-to-home')[0].classList.remove('add-to-home-ios');
        }));

        //Remove Add to Home Badge
        const addToHomeBadgeClose = document.querySelectorAll('.add-to-home');
        addToHomeBadgeClose.forEach(el => el.addEventListener('click',e =>{
            document.getElementsByClassName('add-to-home')[0].classList.remove('add-to-home-visible');
        }));


        //PWA Settings
        if(isPWA === true){
            var checkPWA = document.getElementsByTagName('html')[0];
            if(!checkPWA.classList.contains('isPWA')){
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register(pwaLocation, {scope: pwaScope}).then(function(registration){registration.update();})
                  });
                }

                //Setting Timeout Before Prompt Shows Again if Dismissed
                var hours = pwaRemind * 24; // Reset when storage is more than 24hours
                var now = Date.now();
                var setupTime = localStorage.getItem(pwaName+'-PWA-Timeout-Value');
                if (setupTime == null) {
                    localStorage.setItem(pwaName+'-PWA-Timeout-Value', now);
                } else if (now - setupTime > hours*60*60*1000) {
                    localStorage.removeItem(pwaName+'-PWA-Prompt')
                    localStorage.setItem(pwaName+'-PWA-Timeout-Value', now);
                }


                const pwaClose = document.querySelectorAll('.pwa-dismiss');
                pwaClose.forEach(el => el.addEventListener('click',e =>{
                    const pwaWindows = document.querySelectorAll('#menu-install-pwa-android, #menu-install-pwa-ios');
                    for(let i=0; i < pwaWindows.length; i++){pwaWindows[i].classList.remove('menu-active');}
                    localStorage.setItem(pwaName+'-PWA-Timeout-Value', now);
                    localStorage.setItem(pwaName+'-PWA-Prompt', 'install-rejected');
                    console.log('PWA Install Rejected. Will Show Again in '+ (pwaRemind)+' Days')
                }));

                //Trigger Install Prompt for Android
                const pwaWindows = document.querySelectorAll('#menu-install-pwa-android, #menu-install-pwa-ios');
                if(pwaWindows.length){
                    if (isMobile.Android()) {
                        if (localStorage.getItem(pwaName+'-PWA-Prompt') != "install-rejected") {
                            function showInstallPrompt() {
                                setTimeout(function(){
                                    if (!window.matchMedia('(display-mode: fullscreen)').matches) {
                                        console.log('Triggering PWA Window for Android')
                                        document.getElementById('menu-install-pwa-android').classList.add('menu-active');
                                        document.querySelectorAll('.menu-hider')[0].classList.add('menu-active');
                                    }
                                },3500);
                            }
                            var deferredPrompt;
                            window.addEventListener('beforeinstallprompt', (e) => {
                                e.preventDefault();
                                deferredPrompt = e;
                                showInstallPrompt();
                            });
                        }
                        const pwaInstall = document.querySelectorAll('.pwa-install');
                        pwaInstall.forEach(el => el.addEventListener('click', e => {
                            deferredPrompt.prompt();
                            deferredPrompt.userChoice
                                .then((choiceResult) => {
                                    if (choiceResult.outcome === 'accepted') {
                                        console.log('Added');
                                    } else {
                                        localStorage.setItem(pwaName+'-PWA-Timeout-Value', now);
                                        localStorage.setItem(pwaName+'-PWA-Prompt', 'install-rejected');
                                        setTimeout(function(){
                                            if (!window.matchMedia('(display-mode: fullscreen)').matches) {
                                                document.getElementById('menu-install-pwa-android').classList.remove('menu-active');
                                                document.querySelectorAll('.menu-hider')[0].classList.remove('menu-active');
                                            }
                                        },50);
                                    }
                                    deferredPrompt = null;
                                });
                        }));
                        window.addEventListener('appinstalled', (evt) => {
                            document.getElementById('menu-install-pwa-android').classList.remove('menu-active');
                            document.querySelectorAll('.menu-hider')[0].classList.remove('menu-active');
                        });
                    }
                    //Trigger Install Guide iOS
                    if (isMobile.iOS()) {
                        if (localStorage.getItem(pwaName+'-PWA-Prompt') != "install-rejected") {
                            setTimeout(function(){
                                if (!window.matchMedia('(display-mode: fullscreen)').matches) {
                                    console.log('Triggering PWA Window for iOS');
                                    document.getElementById('menu-install-pwa-ios').classList.add('menu-active');
                                    document.querySelectorAll('.menu-hider')[0].classList.add('menu-active');
                                }
                            },3500);
                        }
                    }
                }
            }
            checkPWA.setAttribute('class','isPWA');
        }

        //End of isPWA
        if(pwaNoCache === true){
            caches.delete('workbox-runtime').then(function() {});
            sessionStorage.clear()
            caches.keys().then(cacheNames => {
              cacheNames.forEach(cacheName => {
                caches.delete(cacheName);
              });
            });
        }

        //Lazy Loading
        var lazyLoad = new LazyLoad();

        // Check Documentation folder for detailed explanations on
        // Externally loading Javascript files for better performance.

        var plugIdent, plugClass, plugMain, plugCall;
        var plugLoc = "plugins/"

        let plugins = [
          {
            id: 'uniqueID', // to detect if loaded and unload if needed
            plug: 'pluginName/plugin.js', // the main plugin javascript file
            call: 'pluginName/pluginName-call.js', // the plugin call functions
            style: 'pluginName/pluginName-style.css', // the plugin stylesheet
            trigger: '.pluginTriggerClass' // the trigger that will activate the loading and initializing of the plugin
          },
          {
            id: 'chart',
            plug: 'charts/charts.js',
            call: 'charts/charts-call-charts.js',
            trigger: '.chart'
          },
          {
            id: 'chart',
            plug: 'charts/charts.js',
            call: 'charts/charts-call-wallet.js',
            trigger: '.wallet-chart'
          },
          {
            id: 'chart',
            plug: 'charts/charts.js',
            call: 'charts/charts-call-dashboard.js',
            trigger: '.dashboard-chart'
          },
          {
            id: 'graph',
            plug: 'charts/charts.js',
            call: 'charts/charts-call-graphs.js',
            trigger: '.graph'
          },
          {
            id: 'count',
            plug: 'countdown/countdown.js',
            trigger: '.countdown'
          },
          {
            id: 'gallery',
            plug: 'glightbox/glightbox.js',
            call: 'glightbox/glightbox-call.js',
            style: 'glightbox/glightbox.css',
            trigger: '[data-gallery]'
          },
          {
            id: 'gallery-views',
            plug: 'galleryViews/gallery-views.js',
            trigger: '.gallery-view-controls'
          },
          {
            id: 'filter',
            plug: 'filterizr/filterizr.js',
            call: 'filterizr/filterizr-call.js',
            style: 'filterizr/filterizr.css',
            trigger: '.gallery-filter'
          },
          {
            id: 'embedly',
            plug: 'embedly/embedly.js',
            trigger: '.embedly-card'
          }
        ];


        for (let i = 0; i < plugins.length; i++) {
            //Remove Previous Calls
            if(document.querySelectorAll('.'+plugins[i].id+'-c').length){document.querySelectorAll('.'+plugins[i].id+'-c')[0].remove();                }

            //Load Plugins
            var plugTrigger = document.querySelectorAll(plugins[i].trigger)
            if(plugTrigger.length){
                var loadScript = document.getElementsByTagName('script')[1],
                    loadScriptJS = document.createElement('script');
                loadScriptJS.type = 'text/javascript'
                loadScriptJS.className = plugins[i].id+'-p'
                loadScriptJS.src = plugLoc + plugins[i].plug
                loadScriptJS.addEventListener('load',function(){
                    //Once plugin is loaded, load the call.
                    if(plugins[i].call !== undefined){
                        var callFn = document.getElementsByTagName('script')[2],
                            callJS = document.createElement('script');
                        callJS.type = 'text/javascript'
                        callJS.className = plugins[i].id+'-c'
                        callJS.src =  plugLoc + plugins[i].call
                        callFn.parentNode.insertBefore(callJS, callFn);
                    }
                });
                //If plugin doesn't exist, load it
                if(!document.querySelectorAll('.'+plugins[i].id+'-p').length){
                    loadScript.parentNode.insertBefore(loadScriptJS, loadScript);
                } else {
                    //If plugin doesn't exist, only load the call function
                    setTimeout(function(){
                    var loadScript = document.getElementsByTagName('script')[1],
                        loadScriptJS = document.createElement('script');
                    loadScriptJS.type = 'text/javascript'
                    loadScriptJS.className = plugins[i].id+'-c'
                    loadScriptJS.src = plugLoc + plugins[i].call;
                    loadScript.parentNode.insertBefore(loadScriptJS, loadScript);
                    },50);
                }
                //If Style doesn't exist in array, don't do anything
                if(plugins[i].style !== undefined){
                    //if style already exists, don't re-add to page.
                    if(!document.querySelectorAll('.'+plugins[i].id+'-s').length){
                        var loadCSS = document.createElement("link");
                        loadCSS.className = plugins[i].id+'-s';
                        loadCSS.rel = "stylesheet";
                        loadCSS.type = "text/css";
                        loadCSS.href = plugLoc + plugins[i].style;
                        document.getElementsByTagName("head")[0].appendChild(loadCSS);
                    }
                }
            }
        }
    }


    //Fix Scroll for AJAX pages.
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

    //End of Init Template
    if(isAJAX === true){
        if(window.location.protocol !== "file:"){
            const options = {
                containers: ["#page"],
                cache:false,
                animateHistoryBrowsing: false,
                plugins: [
                    new SwupPreloadPlugin()
                ],
                linkSelector:'a:not(.external-link):not(.default-link):not([href^="https"]):not([href^="http"]):not([data-gallery])'
            };
            const swup = new Swup(options);
            document.addEventListener('swup:pageView',(e) => { init_template(); })
        }
    }

    init_template();
});
