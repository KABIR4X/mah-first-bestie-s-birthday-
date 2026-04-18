/* ================================================================
   BIRTHDAY WEBSITE — script.js
   Pure vanilla JS — no frameworks
   ================================================================ */
(function () {
  "use strict";

  /* ---------- STATE ---------- */
  var cur = 0,
    total = 5,
    busy = false,
    twDone = false,
    fwOn = false,
    musicOn = false;

  /* ---------- REFS ---------- */
  var secs = document.querySelectorAll(".sec");
  var dots = document.querySelectorAll(".nd");
  var pre = document.getElementById("preloader");
  var preFill = document.getElementById("preFill");
  var prePct = document.getElementById("prePct");
  var audio = document.getElementById("bgMusic");
  var mBtn = document.getElementById("musicToggle");
  var pCvs = document.getElementById("particlesBg");
  var cCvs = document.getElementById("confettiCvs");
  var fwCvs = document.getElementById("fwCvs");

  /* ================================================================
     PRELOADER
     ================================================================ */
  var preVal = 0;
  var preTimer = setInterval(function () {
    preVal += Math.random() * 4 + 1;
    if (preVal >= 100) {
      preVal = 100;
      clearInterval(preTimer);

      setTimeout(function () {
        pre.classList.add("done");

        // 🔥 AUTO MUSIC START AFTER PRELOADER
        tryPlay();

      }, 400);
    }
    preFill.style.width = preVal + "%";
    prePct.textContent = Math.floor(preVal) + "%";
  }, 60);

  /* ================================================================
     MUSIC
     ================================================================ */
  audio.volume = 0.4;

  function tryPlay() {
    audio.play().then(function () {
      musicOn = true;
      mBtn.querySelector(".mt-off").style.display = "none";
      mBtn.querySelector(".mt-on").style.display = "flex";
    }).catch(function () {});
  }

  mBtn.addEventListener("click", function () {
    if (musicOn) {
      audio.pause();
      musicOn = false;
      mBtn.querySelector(".mt-off").style.display = "flex";
      mBtn.querySelector(".mt-on").style.display = "none";
    } else {
      audio.play().then(function () {
        musicOn = true;
        mBtn.querySelector(".mt-off").style.display = "none";
        mBtn.querySelector(".mt-on").style.display = "flex";
      }).catch(function () {});
    }
  });

  /* ================================================================
     PARTICLES
     ================================================================ */
  var pc = pCvs.getContext("2d");
  var pts = [];

  function szP() {
    pCvs.width = window.innerWidth;
    pCvs.height = window.innerHeight;
  }
  szP();
  window.addEventListener("resize", szP);

  var pCount = window.innerWidth < 768 ? 45 : 100;
  for (var i = 0; i < pCount; i++) {
    pts.push({
      x: Math.random() * pCvs.width,
      y: Math.random() * pCvs.height,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      o: Math.random() * 0.4 + 0.08,
      h: Math.random() * 60 + 270,
    });
  }

  function drawP() {
    pc.clearRect(0, 0, pCvs.width, pCvs.height);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0) p.x = pCvs.width;
      if (p.x > pCvs.width) p.x = 0;
      if (p.y < 0) p.y = pCvs.height;
      if (p.y > pCvs.height) p.y = 0;

      pc.beginPath();
      pc.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pc.fillStyle = "hsla(" + p.h + ",80%,70%," + p.o + ")";
      pc.fill();
    }
    requestAnimationFrame(drawP);
  }
  drawP();

  /* ================================================================
     PAGE NAVIGATION
     ================================================================ */
  function go(idx) {
    if (busy || idx === cur || idx < 0 || idx >= total) return;
    busy = true;

    secs[cur].classList.remove("active");
    dots[cur].classList.remove("active");

    cur = idx;

    secs[cur].classList.add("active");
    dots[cur].classList.add("active");

    if (cur === 1 && !musicOn) tryPlay();
    if (cur === 2 && !twDone) {
      setTimeout(startTW, 600);
      twDone = true;
    }
    if (cur === 3) setTimeout(launchConfetti, 400);
    if (cur === 4 && !fwOn) {
      setTimeout(startFW, 400);
      fwOn = true;
    }

    setTimeout(function () {
      busy = false;
    }, 800);
  }

  /* ---------- EVENTS ---------- */
  dots.forEach(function (d) {
    d.addEventListener("click", function () {
      go(parseInt(this.getAttribute("data-index")));
    });
  });

  document.getElementById("btnStart").addEventListener("click", function () {
    go(1);
    tryPlay(); // 🔥 EXTRA SAFETY MUSIC START
  });

  document.querySelectorAll("[data-goto]").forEach(function (b) {
    b.addEventListener("click", function () {
      go(parseInt(this.getAttribute("data-goto")));
    });
  });

  document.getElementById("btnReplay").addEventListener("click", function () {
    twDone = false;
    fwOn = false;
    document.getElementById("twText").innerHTML = "";
    document.getElementById("msgSign").classList.remove("show");
    go(0);
  });

  /* scroll + touch + keyboard (unchanged) */
  var sThrot = false;
  document.addEventListener("wheel", function (e) {
    if (sThrot) return;
    sThrot = true;
    setTimeout(function () {
      sThrot = false;
    }, 1100);
    go(cur + (e.deltaY > 0 ? 1 : -1));
  });

  var tsy = 0;
  document.addEventListener("touchstart", function (e) {
    tsy = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener("touchend", function (e) {
    var d = tsy - e.changedTouches[0].screenY;
    if (Math.abs(d) > 55) go(cur + (d > 0 ? 1 : -1));
  }, { passive: true });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") go(cur + 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") go(cur - 1);
    else if (e.key === "m" || e.key === "M") mBtn.click();
  });

  /* ================================================================
     TYPEWRITER (UNCHANGED)
     ================================================================ */
  var twMsg =
    "My Dearest Fahim,\n\n" +
    "There are friends we meet by chance, and then there are souls we recognize from another lifetime. " +
    "You are my harbor in storms, my loudest cheerleader, and the one who knows my silence. " +
    "Today, on your birthday, I don’t just celebrate another year — I celebrate the miracle of your existence.";

  function startTW() {
    var el = document.getElementById("twText");
    var ci = 0;
    function t() {
      if (ci >= twMsg.length) {
        document.getElementById("msgSign").classList.add("show");
        return;
      }
      var ch = twMsg[ci];
      el.innerHTML += (ch === "\n") ? "<br>" : ch;
      ci++;
      setTimeout(t, 20);
    }
    t();
  }

  /* (Confetti + Fireworks unchanged below — same as your original) */

})();
