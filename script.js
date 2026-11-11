const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const audio = $("#audioElement");
const modal = $("#modal");
const modalBody = $("#modalBody");
const toast = $("#toast");

const chapters = ["story", "letters", "music", "memories", "gifts"];
const chapterNames = {
  story: "Nuestra historia", letters: "Cartas", music: "Nuestra banda sonora",
  memories: "Recuerdos y salidas", gifts: "Regalos y detalles"
};
const savedProgress = JSON.parse(sessionStorage.getItem("completedChapters") || "[]");
const completed = new Set(savedProgress.filter(chapter => chapters.includes(chapter)));
let currentSection = null;
let currentSong = null;
let chestOpened = false;

const storyMoments = [
  { title: "Cómo nos conocimos", text: "Ya son 8 años desde la primera vez que te vi, y empezamos a hablar si saber todo lo que el futuro nos tenia por delante, y no me arrepiento de nada, porque desde que te conoci supe que tu eras diferente al resto. Gracias por aparecer en mi vida.", image: "img/pareja-01.jpg" },
  { title: "Cuando comenzamos a hablar", text: "Creo que ya desde 1ro hablabamos un poco, pero te volviste mi mejor amiga en 4to, y creo que yo de ti tmb. Teniamos una conexion tan linda, y nos pareciamos tanto que hablar contigo era lo q más me gustaba de ir al colegio. Y en 6to sabia que en algun momento tendria la oportunidad de estar contigo, solo que el miedo me lo impedia. Habia quedado en solo un sueño...", image: "img/pareja-02.jpg" },
  { title: "El inicio de nuestra relación", text: "Realmente no creia q algun dia llegaria a estar contigo, porq ya habia dejado de creer en el amor o q de verdad alguien podria demostrarme q si es distinta y no solo diciendolo, sino demostrandome amor cada dia, y es algo que tu hacias muy bien.", image: "img/pareja-03.jpg" },
  { title: "Nuestro aniversario — 13/04/2026", text: "Finalmente llego el dia, supe que de verdad queria estar contigo y lo hice, porque en el fondo yo tmb sentia algo y quize confiar el ti, y no me arrepiento, pq cada momento que he pasado contigo me haces reir, vivir la vida con ganas, y poder ser yo.", image: "img/pareja-04.jpg" },
  { title: "Nuestros primeros 7 meses", text: "A pesar de cada momento malo y bueno no me arrepiento de nada, si pudiera vivir más vidas desearia vivir cada una de ellas contigo porque tu eres la porque con la que yo quiero todo. Quiero seguir viviendo cada dia contigo, amandote, tener el privilegio de tener a una mujer como tu en mi vida. Y si hablamos de casualidades, la de conocerte fue la más bonita de todas.", image: "img/pareja-05.jpg" },
  { title: "Y todavía nos quedan muchas historias por vivir", text: "Se que este es solo el comienzo de una historia, se que estos 7 meses que cumplimos no significan nada, porque yo quiero vivir contigo toda mi vida, se que todavia somos jovenes y el destino es dueño de lo de nosotros.", image: "img/pareja-06.jpg" }
];

const letters = [
  { title: "Que si te quiero?", text: "No tienes una idea de como me haces sentir, no importa cuantas lineas sean, las palabras no me alcanzaran nunca para explicar lo que siento por ti. Con cada mensaje tuyo me alegras el dia, y los espero siempre, lo unico que hago en todo el dia. Cuando empeze a hablar contigo no imagine que terminariamos juntos. El dia que salimos, estaba tan nervioso, cuando te abraze por primera vez, y me di cuenta de el frio que habia sentido toda mi vida. Cuando me tomaste de la mano, senti esa tranquilidad que tanto buscaba. Cuando te bese por primera vez, fue una combinacion de sentimientos tan linda, recuerdo que en ese momento te abraze, tal vez no fue algo planeado, pero creeme que para mi fue algo unico. No tengo idea de como lo hiciste, pero en poco tiempo me enamoraste tantoo, como podria enamorarme de alguien más?, si ya te tengo a ti..." },
  { title: "Cuando tengas un mal dia", text: "Cuando tengas un mal dia quiero que recuerdes esto, y todo lo que te he dado, porque para mi tu siempre seras la mejor novia del mundo y sin importa lo que me digan los demas siempre estare a tu lado, hasta en los dias malos, yo siempre te seguire escogiendo. Amor, no somos la pareja perfecta, peleamos, nos decimos cosas y nos enojamos pero la verdad es que no hay otra persona en el mundo con la que preferiria estar más que contigo. Porque aunque tengamos problemas, discutamos o estemos enojados y nuestra relación se este cayendo, siempre te amare, porque yo te lo prometi, porque realmente contigo quiero que las cosas salgan bien, y yo dejaria todo mi ego a un lado solo por ti." },
  { title: "Algo que queria decirte", text: "No se exactamente en que momento te volviste tan importante para mi, pero desde que llegaste a mi vida todo empezo a sentirte más bonito. Tu sonrisa si convirtio en una de mis cosas favoritas y hablar contigo es algo que siempre espero con emoción.\n\nQuiero estar contigo en tus dias buenos y tambien en los dificiles, hacerte reir, cuidarte, aporyarte y desmotraste cada dia todo lo que significas para mi. Nunca olvides que te amo, porque yo siempre hago hasta el minimo esfuerzo por hacerte sentir amada y feliz todos los dias amor, aunque yo me sentia mal, mi motivo siempre sera verte bien." },
  { title: "TEAMO", text: "Te quiero llenar de abrazos y besos todas las mañanas y seguir agarrando fuerte tu mano en cualquier lugar mientras sonries. Te quiero para crecer y soñar juntos en todo momento. Te amo aqui, y donde haga falta porque amar es una desición, y yo decido amarte todos los dias. Te quiero apoyarte cuando lo necesites, ayudarte cuando ya no puedas más, y sacarte una sonrisa siempre que te haga falta. Ojala que nunca nos falten las ganas de seguir construyendo esto tan unico que tenemos. Yo quiero verte cumplir tus sueños, ser tu mejor amigo, tu compañero, y la persona que busques cuando el mundo se te cae encima. Te amo con esa forma tan espeshial que tienes, esa personalidad tan unica. Teamo, asi de la mejor manera que puedo." },
  { title: "¡Si me enamore de ti?", text: "Esa es la pregunta que más te podrias hacer y te lo escribo para decirte lo que en verda siento por ti, no es tan solo un simple te amo, es una alegria que siento al hablarte, esos nervios que me dan al ver tus ojitos, esa emocion de saber que te tengo aqui conmigo amandome más que a nada y esa me da una paz que no te imaginas.\n\nTu me haces creer que todo esta bien, mis problemas se esfuman cuando estas cerca, todo se siente tan perfecto, tan irreal, que me ahce apreciar más cada momento y pensar en que hice para merecer a una persona tan buena, hermosa y divina como tu.\n\nCada cosa nueva de ti que descubro me hace enamorarme cada vez más de ti, cada cosa me hace mirarte con los ojos más iluminados, y pienso como puedo hablarte tanto sin cansarme, aunque pensandolo nunca me cansaria de hablar contigo... Aunque pienses que me lo merezco yo no te doy nada de lo realmente te mereces, y se que soy capaz de hacer más por sacarte una sonrisa." }
];

const songs = [
  { group: "Canciones que me recuerdan a ti", title: "Sexto Sentido", artist: "008RACCA", file: "audio/sexto-sentido.mp3", cover: "img/cancion-sexto-sentido.jpg", dedication: "Sexto Sentido me recuerda mucho a ti porque me hiciste darme cuenta que es sentir que es estar enamorado, porque me haces contar cada segundo que paso sin ti, porque en tus ojos se haya la luz de mi oscuridad" },
  { group: "Canciones que me recuerdan a ti", title: "Noche de los Dos", artist: "Murder", file: "audio/noche-de-los-dos.mp3", cover: "img/cancion-noche-de-los-dos.png", dedication: "Noche de los Dos bueno ni que decir, tu misma me la recomendaste y siempre que la escucho me recuerda a ti. Además su letra me hace recordarte." },
  { group: "Canciones que me recuerdan a ti", title: "Piel Canela", artist: "Cuco", file: "audio/piel-canela.mp3", cover: "img/cancion-piel-canela.jpg", dedication: "Piel canela, porque además de que es de cuco su letra me hace pensar en ti, porque me importas solo tu y solamente tu, y que ocurra absolutamente de todo, pero nada me dolería más que quedarme sin tu amor." },
  { group: "Canciones que me hacen pensar en nosotros", title: "Aquel Nap Zzzz", artist: "Rauw Alejandro", file: "audio/aquel-nap-zzzz.mp3", cover: "img/cancion-aquel-nap-zzzz.jpg", dedication: "Aquel nap zzzz, me hace recordar bastante a nuestra bonita historia de amor, y también me recuerda a esa historia que subimos juntos. Porque yo solo quiero todo contigo mi amor, no quiero a nadie más, solo quiero que seas tu y yo toda la vida." },
  { group: "Canciones que me hacen pensar en nosotros", title: "Yoko", artist: "Álvaro Díaz", file: "audio/yoko.mp3", cover: "img/cancion-yoko.jpg", dedication: "Yoko además de su letra, me hace pensar en nosotros porque fue el primer dibujo y regalo que te di y si mal no recuerdo fue cuando cumplimos un mes y bueno me trae muy lindos recuerdos. Te quiero siempre a mi ladito como yokoo, o no te vayas nuncaa." },
  { group: "Canciones que me hacen pensar en nosotros", title: "Amor", artist: "Enmanuel Cortes", file: "audio/amor-enmanuel-cortes.mp3", cover: "img/cancion-amor.jpg", dedication: "Amor, esta canción es mas por la historia que subiste del anillo, pero igual la letra me trae recuerdos tan bonitos de nosotros dos. Yo te quiero enseñar todo el amor que yo te tengo, tan sencilla que tu eres, para mi tu eres perfecta 💝." },
  { group: "Canciones que quiero dedicarte", title: "Deseo Perder (Interludio)", artist: "Milo J", file: "audio/deseo-perder.mp3", cover: "img/cancion-deseo-perder.jpg", dedication: "Deseo perder, se que no te gusta mucho Milo J, pero si escucharas la letra de esta obra de arte." },
  { group: "Canciones que quiero dedicarte", title: "Por ti", artist: "3 AM", file: "audio/por-ti.mp3", cover: "img/cancion-por-ti.jpg", dedication: "Por ti de 3 AM, aunque no sea muy conocida, tiene una letra que esta hecha para ti." },
  { group: "Canciones que quiero dedicarte", title: "Tus vueltas", artist: "Milo J", file: "audio/tus-vueltas.mp3", cover: "img/cancion-tus-vueltas.jpg", dedication: "Tus vueltas, si otra d Milo J, pero esa letra es tan hermosa, que siempre que la escucho pienso en ti y es imposible no dedicarte un tema tan hermoso." },
  { group: "Nuestra canción especial", title: "Mesa para dos", artist: "Tomas metrikf", file: "audio/mesa-para-dos.mp3", cover: "img/cancion-mesa-para-dos.jpg", dedication: "Se que esta canción quizá no te guste, pero a mi me encanta y su letra me hace pensar tanto en ti. Quisiera que la escuches y que siempre pensaras en mi con esa letra." }
];

const gifts = [
  { title: "Un ramo para ti", image: "img/ramo.jpg", text: "Quería tener un detalle especial contigo, algo que pudiera sacarte una sonrisa y demostrarte el cariño que te tengo. Por eso elegí este ramo, pensando en ti y en lo bonito que es poder compartir momentos a tu lado... Este ramo te lo di por el dia de las flores amarillas y aunque en parte fue por eso, desde antes tenia el deseo de darte uno.\n\nQueria que te sintieras importante, amada y valorada por mi, y creo que lo logre verdad?, me encanto verte con una sonrisa, porque es lo que siempre busco. Cuando te lo entregue para que mentirte, estaba bastante nervioso y ademas porque habia bastante gente pero todo salio muy bonito.\n\nPara mi ese recuerdo no es solo un ramo, sino una prueba del amor que tengo por ti y de todo lo que soy capaz de gastar por ti." },
  { title: "Un cuadro hecho para ti", image: "img/cuadro.jpg", text: "Este cuadro tiene algo diferente a los demás regalos, porque fue algo que hice con mis propias manos. Quería crear algo especialmente para ti, dedicarte mi tiempo y convertir una idea en un detalle que pudieras conservar, y hay nació ese dibujo. Primero te pregunté que foto te gustaba más, y decidí dibujarlo a mano porque quería esforzarme y dedicarte tiempo, y si que lo hice.\n\nPara mi significa mucho ese cuadro, porque es primera vez que hago un dibujo tan grande y hermoso, nunca había hecho algo así y me sentí orgulloso de mi mismo. Espero que a ti también te haya gustado." },
  { title: "Pequeños dibujos, grandes detalles", image: null, text: "No todos los detalles necesitan ser grandes para tener un significado especial. Algunos de esos dibujos fueron pequeñas maneras de demostrarte mi cariño, dedicándote un poquito de mi tiempo y creatividad. Aunque no tenga fotografías de ellos, cada uno forma parte de esos detalles que me gusta recordar. Primero el dibujo de Yoko, lo hice cuando cumplimos un mes y lo hice porque para mi tu eres mi yoko y quería que te sintieras muy especial.\n\nDespués el otro dibujo de nosotros dos, fue algo más pequeño pero no quita el valor y el tiempo que dedique haciéndolo pensando en como reaccionarias, te lo di porque me nació, realmente quería hacer algo bonito y no hay mejor obra de arte que tu en un cuadro." }
];

const surprises = [
  { icon: "💖", label: "Corazón", text: "Entre tantos lugares de esta página, siempre habrá uno donde encontrar algo de cariño." },
  { icon: "🌟", label: "Estrella", text: "Si pudiera guardar un momento para siempre, elegiría uno en el que estemos juntos." },
  { icon: "🌷", label: "Flor", text: "No necesito una fecha especial para recordarte lo importante que eres." },
  { icon: "💌", label: "Sobre", text: "Aunque esta página tenga un final, mi amor por ti no." },
  { icon: "📸", label: "Fotografía", text: "Qué bonito coincidir contigo entre tantas personas en este mundo." },
  { icon: "💙", label: "Corazón azul", text: "Un detalle chikito para recordarte lo especial que eres." },
  { icon: "✨", label: "Broma", text: "Tu eres el six de mi seven 🫰💜" },
  { icon: "🫶", label: "Broma", text: "Te amo con cojoned chikilla 😘" },
  { icon: "⭐", label: "Broma", text: "Piensa en sixsevenaldo zi?" },
  { icon: "💕", label: "Broma", text: "Qiero abrazarte y protegerte 💜" }
];

function showToast(message, duration = 2600) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), duration);
}

function showModal(title, text, image = null, extraClass = "") {
  modalBody.innerHTML = "";
  $(".modal-card").classList.toggle("letter-modal", extraClass === "letter-modal");
  const heading = document.createElement("h3");
  heading.id = "modalTitle";
  heading.textContent = title;
  modalBody.appendChild(heading);
  if (image) {
    const img = document.createElement("img");
    img.src = image;
    img.alt = title;
    img.className = "modal-image";
    img.style.cssText = "display:block;width:min(100%,240px);height:240px;object-fit:cover;object-position:center;border-radius:13px;margin:0 auto 18px;";
    img.onerror = () => { img.style.display = "none"; };
    modalBody.appendChild(img);
  }
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  modalBody.appendChild(paragraph);
  modal.classList.remove("hidden");
}
function closeModal() { modal.classList.add("hidden"); }
$$("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

function updateProgress() {
  const count = completed.size;
  $("#progressLabel").textContent = `${count} de ${chapters.length} capítulos`;
  $("#chestIndexStatus").textContent = count === chapters.length ? "Ya puedes abrirlo" : `${count}/${chapters.length} capítulos`;
  $("#finishChapter").classList.toggle("done", currentSection && completed.has(currentSection));
  $("#finishChapter").textContent = currentSection && completed.has(currentSection) ? "Capítulo completado ✓" : "Terminar este capítulo ✓";
}
function saveProgress() {
  sessionStorage.setItem("completedChapters", JSON.stringify([...completed]));
  updateProgress();
}

function openSection(name) {
  if (name === "chest") {
    currentSection = "chest";
  } else {
    currentSection = name;
  }
  $("#indexScreen").classList.add("hidden");
  $("#sectionScreen").classList.remove("hidden");
  $$(".content-section").forEach(section => section.classList.add("hidden"));
  const sectionMap = { story: "storySection", letters: "lettersSection", music: "musicSection", memories: "memoriesSection", gifts: "giftsSection", chest: "chestSection" };
  $("#" + sectionMap[name]).classList.remove("hidden");
  $("#sectionCounter").textContent = name === "chest" ? "CAPÍTULO FINAL" : `CAPÍTULO ${String(chapters.indexOf(name) + 1).padStart(2,"0")}`;
  $("#chapterFinishHint").textContent = name === "chest" ? "El cofre es el final del recorrido." : "Cuando termines de explorar este capítulo, puedes marcarlo como terminado.";
  $("#finishChapter").style.display = name === "chest" ? "none" : "inline-block";
  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function backToIndex() {
  $("#sectionScreen").classList.add("hidden");
  $("#indexScreen").classList.remove("hidden");
  currentSection = null;
  window.scrollTo({ top: 0, behavior: "smooth" });
  updateProgress();
}
$$("[data-open]").forEach(button => button.addEventListener("click", () => openSection(button.dataset.open)));
$("#backToIndex").addEventListener("click", backToIndex);
$("#backToIndexTop").addEventListener("click", backToIndex);
$("#finishChapter").addEventListener("click", () => {
  if (!currentSection || !chapters.includes(currentSection)) return;
  completed.add(currentSection);
  saveProgress();
  showToast("Capítulo guardado como completado ♡");
});

function renderStory() {
  const container = $("#timeline");
  storyMoments.forEach((moment, index) => {
    const button = document.createElement("button");
    button.className = "timeline-card";
    const image = document.createElement("img");
    image.className = "timeline-thumb";
    image.src = moment.image;
    image.alt = `Fotografía del recuerdo: ${moment.title}`;
    image.onerror = () => { image.style.display = "none"; };
    const content = document.createElement("span");
    content.className = "timeline-content";
    content.innerHTML = `<span class="moment-date">MOMENTO ${String(index + 1).padStart(2,"0")}</span><h3></h3><p></p><span class="read-more">Leer recuerdo →</span>`;
    content.querySelector("h3").textContent = moment.title;
    content.querySelector("p").textContent = moment.text.length > 118 ? moment.text.slice(0,118) + "…" : moment.text;
    button.append(image, content);
    button.addEventListener("click", () => showModal(moment.title, moment.text, moment.image));
    container.appendChild(button);
  });
}
function renderLetters() {
  const container = $("#envelopeGrid");
  letters.forEach((letter, index) => {
    const button = document.createElement("button");
    button.className = "envelope";
    button.innerHTML = `<span class="envelope-icon">✉</span><strong></strong><small>TOCA PARA ABRIR</small>`;
    button.querySelector("strong").textContent = `Carta ${index + 1}`;
    button.addEventListener("click", () => showModal(letter.title, letter.text, null, "letter-modal"));
    container.appendChild(button);
  });
}
function renderMusic() {
  const container = $("#musicCollections");
  const groups = [...new Set(songs.map(song => song.group))];
  groups.forEach(group => {
    const section = document.createElement("section");
    section.className = "collection";
    const title = document.createElement("h3");
    title.className = "collection-title";
    title.textContent = group;
    const grid = document.createElement("div");
    grid.className = "song-grid";
    songs.filter(song => song.group === group).forEach(song => {
      const card = document.createElement("article");
      card.className = "song-card";
      const details = document.createElement("button");
      details.className = "song-details";
      const cover = document.createElement("img");
      cover.className = "song-cover";
      cover.src = song.cover;
      cover.alt = `Portada de ${song.title}`;
      cover.onerror = () => { cover.classList.add("image-fallback"); cover.alt = "♫"; };
      const strong = document.createElement("strong");
      strong.textContent = song.title;
      const small = document.createElement("small");
      small.textContent = song.artist;
      details.append(cover, strong, small);
      details.addEventListener("click", () => showSongModal(song));
      const play = document.createElement("button");
      play.className = "song-card-play";
      play.type = "button";
      play.textContent = "▶ Reproducir";
      play.addEventListener("click", () => playSong(song));
      card.append(details, play);
      grid.appendChild(card);
    });
    section.append(title, grid);
    container.appendChild(section);
  });
}
function showSongModal(song) {
  modalBody.innerHTML = "";
  const heading = document.createElement("h3");
  heading.id = "modalTitle";
  heading.textContent = song.title;
  const artist = document.createElement("p");
  artist.textContent = song.artist;
  artist.style.marginTop = "-10px";
  const image = document.createElement("img");
  image.src = song.cover;
  image.alt = `Portada de ${song.title}`;
  image.style.cssText = "display:block;width:min(100%,260px);aspect-ratio:1;object-fit:cover;border-radius:15px;margin:0 auto 18px;";
  image.onerror = () => image.style.display = "none";
  const dedication = document.createElement("p");
  dedication.textContent = song.dedication;
  const play = document.createElement("button");
  play.className = "primary-button";
  play.textContent = "▶ Reproducir canción";
  play.addEventListener("click", () => playSong(song));
  modalBody.append(heading, artist, image, dedication, play);
  modal.classList.remove("hidden");
}

const playerThemes = {
  "Amor de siempre": ["#8f3156", "#fff7fa", "#f2c5d5", "#f4a8c5"],
  "Sexto Sentido": ["#b73542", "#fff8f8", "#f4c6ca", "#ffb6bd"],
  "Noche de los Dos": ["#202027", "#ffffff", "#c7c7d0", "#e8e8ef"],
  "Piel Canela": ["#d8ed75", "#344018", "#59652c", "#829b28"],
  "Aquel Nap Zzzz": ["#7250a5", "#ffffff", "#d8c8ef", "#c8a8ff"],
  "Yoko": ["#22242a", "#ffffff", "#c8cbd2", "#eeeeF5"],
  "Amor": ["#b8e5f5", "#24465b", "#527d94", "#5ba9d0"],
  "Deseo Perder (Interludio)": ["#e7e9ec", "#3d424b", "#737984", "#aab0ba"],
  "Por ti": ["#4a4d55", "#ffffff", "#d0d2d8", "#e4e6eb"],
  "Tus vueltas": ["#aeb1b8", "#333740", "#646a75", "#777e89"],
  "Mesa para dos": ["#c9a27b", "#493729", "#80664f", "#9b7655"],
  "Emociones": ["#a8d8f0", "#24445b", "#547b96", "#5ba7d5"]
};
function applyPlayerTheme(song) {
  const [bg, ink, muted, accent] = playerThemes[song.title] || playerThemes["Amor de siempre"];
  const player = $("#audioPlayer");
  player.style.setProperty("--player-bg", bg);
  player.style.setProperty("--player-ink", ink);
  player.style.setProperty("--player-muted", muted);
  player.style.setProperty("--player-accent", accent);
}
function playSong(song) {
  currentSong = song;
  applyPlayerTheme(song);
  audio.pause();
  audio.src = song.file;
  audio.load();
  $("#playerTitle").textContent = song.title;
  $("#playerArtist").textContent = song.artist;
 const playerCover = $("#playerCover");
if (playerCover) {
  playerCover.src = song.cover || "img/cancion-amor-de-siempre.jpg";
}
  $("#audioPlayer").classList.remove("hidden");
  $("#audioPlayer").classList.add("visible");
  const attempt = audio.play();
  if (attempt && typeof attempt.then === "function") {
    attempt.then(() => { $("#playerPlay").textContent = "Ⅱ"; })
      .catch(() => {
        $("#playerPlay").textContent = "▶";
        showToast(`No se pudo abrir ${song.file}. Comprueba que el MP3 tenga ese nombre exacto dentro de audio/.`);
      });
  }
}
audio.addEventListener("play", () => $("#playerPlay").textContent = "Ⅱ");
audio.addEventListener("pause", () => $("#playerPlay").textContent = "▶");

audio.addEventListener("error", () => {
  console.log("Error de audio:", audio.error?.code, audio.error?.message);
  if (currentSong) {
    showToast(`Error ${audio.error?.code}: ${currentSong.file}`, 4200);
  }
});

audio.addEventListener("timeupdate", () => {
  const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  $("#playerProgress").style.width = `${percent}%`;
});
$("#playerPlay").addEventListener("click", () => {
  if (audio.paused) audio.play().catch(() => showToast("No se pudo reproducir el audio."));
  else audio.pause();
});
$("#playerClose").addEventListener("click", () => $("#audioPlayer").classList.add("hidden"));
$("#musicToggle").addEventListener("click", () => $("#audioPlayer").classList.toggle("hidden"));


function renderGifts() {
  const container = $("#giftDisplay");
  gifts.forEach(gift => {
    const card = document.createElement("article");
    card.className = "gift-card";
    if (gift.image) {
      const img = document.createElement("img");
      img.src = gift.image;
      img.alt = gift.title;
      img.onerror = () => img.classList.add("image-fallback");
      card.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "drawing-placeholder";
      placeholder.textContent = "Pequeños dibujos ♡";
      card.appendChild(placeholder);
    }
    if (gift.extraImage) {
      const extra = document.createElement("img");
      extra.src = gift.extraImage;
      extra.alt = "Ustedes juntos con el ramo";
      extra.className = "gift-extra-image";
      extra.onerror = () => extra.remove();
      card.appendChild(extra);
    }
    const title = document.createElement("h3");
    title.textContent = gift.title;
    const excerpt = document.createElement("p");
    excerpt.textContent = gift.text.slice(0,135) + "…";
    const button = document.createElement("button");
    button.textContent = "Leer la historia →";
    button.addEventListener("click", () => showModal(gift.title, gift.text, gift.image));
    card.append(title, excerpt, button);
    container.appendChild(card);
  });
}
function scatterSurprises() {
  const targets = [
    $(".welcome-content"), $(".book-page"), $("#storySection .section-intro"),
    $("#storySection .timeline"), $("#lettersSection .section-intro"),
    $("#lettersSection .envelope-grid"), $("#musicSection .section-intro"),
    $("#musicSection .music-collections"), $("#memoriesSection .section-intro"),
    $("#giftsSection .gift-display")
  ];
  surprises.forEach((item, index) => {
    const target = targets[index % targets.length];
    if (!target) return;
    target.classList.add("surprise-host");
    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = `surprise-pin surprise-pin-${index % 4}`;
    pin.textContent = item.icon;
    pin.setAttribute("aria-label", "Pequeño detalle escondido");
    pin.title = "";
    pin.addEventListener("click", (event) => {
      event.stopPropagation();
      showToast(item.text, 5200);
      pin.classList.add("surprise-found");
    });
    target.appendChild(pin);
  });
}
$("#openGiftButton").addEventListener("click", () => {
  $("#welcomeScreen").classList.add("hidden");
  $("#app").classList.remove("hidden");
  // El navegador permite iniciar el audio después de esta interacción del usuario.
  playSong({ title: "Amor de siempre", artist: "Cuco", file: "audio/amor-de-siempre.mp3", cover: "img/cancion-amor-de-siempre.jpg" });
  window.scrollTo({ top: 0, behavior: "smooth" });
});

$("#unlockChest").addEventListener("click", () => {
  const allDone = chapters.every(chapter => completed.has(chapter));
  if (!allDone) {
    $("#chestError").textContent = `Aún faltan ${chapters.length - completed.size} capítulos por completar.`;
    return;
  }
  if ($("#chestCode").value.trim() !== "13-04-26") {
    $("#chestError").textContent = "Ese no es el código. Inténtalo de nuevo.";
    return;
  }
  chestOpened = true;
  $("#lockedChest").classList.add("hidden");
  $("#openedChest").classList.remove("hidden");
  $("#chestIntro").textContent = "Lo lograste. Aquí está el último detalle.";
  showToast("¡Lo recordaste! Esta fecha siempre será especial para nosotros ♡", 4200);
  playSong({ title: "Emociones", artist: "Hades 66", file: "audio/emociones.mp3", cover: "img/cancion-emociones.jpg" });
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("#chestCode").addEventListener("input", event => {
  const digits = event.target.value.replace(/\D/g, "").slice(0, 6);
  event.target.value = digits.length > 4 ? `${digits.slice(0,2)}-${digits.slice(2,4)}-${digits.slice(4)}` : digits.length > 2 ? `${digits.slice(0,2)}-${digits.slice(2)}` : digits;
});
$("#chestCode").addEventListener("keydown", event => { if (event.key === "Enter") $("#unlockChest").click(); });

function setupImageFallbacks() {
  $$("img[data-fallback]").forEach(img => {
    img.addEventListener("error", () => {
      const placeholder = document.createElement("div");
      placeholder.className = "image-fallback";
      placeholder.style.minHeight = "100px";
      placeholder.textContent = img.dataset.fallback || "Añade tu fotografía";
      img.replaceWith(placeholder);
    }, { once: true });
  });
}

renderStory();
renderLetters();
renderMusic();
renderGifts();
scatterSurprises();
setupImageFallbacks();
updateProgress();
