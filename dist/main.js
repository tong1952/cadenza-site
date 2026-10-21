/* Cadenza landing page — demo player
   Two pre-rendered mp3s (original / karaoke) with an instant A/B toggle.
   No dependencies; works from file://. */
(function () {
  "use strict";

  var SRC = {
    original: "assets/demo-original.mp3",
    karaoke: "assets/demo-karaoke.mp3"
  };

  var audio = document.getElementById("audio");
  var playBtn = document.getElementById("playBtn");
  var icPlay = playBtn.querySelector(".ic-play");
  var icPause = playBtn.querySelector(".ic-pause");
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll(".mode-btn"));
  var progress = document.getElementById("progress");
  var pbar = document.getElementById("pbar");
  var ptime = document.getElementById("ptime");

  var mode = "original";

  function fmt(t) {
    if (!isFinite(t)) return "0:00";
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function setIcon(playing) {
    icPlay.style.display = playing ? "none" : "";
    icPause.style.display = playing ? "" : "none";
  }

  function updateTime() {
    pbar.style.width = (audio.duration ? (audio.currentTime / audio.duration) * 100 : 0) + "%";
    ptime.textContent = fmt(audio.currentTime) + " / " + fmt(audio.duration || 28);
  }

  function setMode(next, autoplay) {
    if (!SRC[next]) return;
    mode = next;
    modeBtns.forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-mode") === next);
    });
    var wasPlaying = !audio.paused;
    if (audio.getAttribute("src") !== SRC[next]) {
      var pos = audio.currentTime || 0;
      audio.src = SRC[next];
      audio.currentTime = pos; // keep position so A/B compare is instant
      if (wasPlaying || autoplay) {
        audio.play().catch(function () {});
      }
    }
  }

  playBtn.addEventListener("click", function () {
    if (!audio.getAttribute("src")) audio.src = SRC[mode];
    if (audio.paused) {
      audio.play().catch(function () {});
    } else {
      audio.pause();
    }
  });

  modeBtns.forEach(function (b) {
    b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
  });

  progress.addEventListener("click", function (e) {
    if (!audio.duration) return;
    var rect = progress.getBoundingClientRect();
    var frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audio.currentTime = frac * audio.duration;
    updateTime();
  });

  audio.addEventListener("timeupdate", updateTime);
  audio.addEventListener("play", function () { setIcon(true); });
  audio.addEventListener("pause", function () { setIcon(false); });
  audio.addEventListener("loadedmetadata", updateTime);
  audio.addEventListener("ended", function () {
    setIcon(false);
    pbar.style.width = "100%";
  });
})();
