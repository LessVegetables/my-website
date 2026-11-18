import QRCode from "https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm";

const $ = (id) => document.getElementById(id);

const input = $("text");
const img = $("qrImg");

const savePNG = $("savePNG");
const saveSVG = $("saveSVG");

// advanced settings controls
const sizeEl = $("optSize");
const cmEl = $("optCm");
const dpiEl = $("optDpi");
const eccEl = $("optEcc");
const marginEl = $("optMargin");
const darkEl = $("optDark");
const lightEl = $("optLight");
const transparentEl = $("optTransparent");
const resetEl = $("optReset");

const CM_PER_INCH = 2.54;
const MIN_SIZE = 64;
const MAX_SIZE = 8192;
const STORAGE_KEY = "qrSettings";

const DEFAULTS = {
    size: 1024,
    dpi: 300,
    ecc: "M",
    margin: 2,
    dark: "#000000",
    light: "#ffffff",
    transparent: false,
};

let currentValue = "";

// ---------- settings ----------

function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
}

function readSettings() {
    const size = clamp(Math.round(Number(sizeEl.value)) || DEFAULTS.size, MIN_SIZE, MAX_SIZE);
    const margin = clamp(Math.round(Number(marginEl.value)), 0, 20);
    return {
        size,
        dpi: Number(dpiEl.value) || DEFAULTS.dpi,
        ecc: eccEl.value,
        margin: Number.isFinite(margin) ? margin : DEFAULTS.margin,
        dark: darkEl.value,
        light: lightEl.value,
        transparent: transparentEl.checked,
    };
}

function applySettings(s) {
    sizeEl.value = s.size;
    dpiEl.value = s.dpi;
    eccEl.value = s.ecc;
    marginEl.value = s.margin;
    darkEl.value = s.dark;
    lightEl.value = s.light;
    transparentEl.checked = s.transparent;
    syncCmFromPx();
    lightEl.disabled = s.transparent;
}

function loadSettings() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (saved && typeof saved === "object") return { ...DEFAULTS, ...saved };
    } catch { /* storage unavailable or corrupt */ }
    return { ...DEFAULTS };
}

function saveSettings(s) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch { /* ignore */ }
}

// px <-> cm at the chosen DPI
function syncCmFromPx() {
    const px = Number(sizeEl.value);
    const dpi = Number(dpiEl.value);
    if (px > 0 && dpi > 0) cmEl.value = +(px / dpi * CM_PER_INCH).toFixed(2);
}

function syncPxFromCm() {
    const cm = Number(cmEl.value);
    const dpi = Number(dpiEl.value);
    if (cm > 0 && dpi > 0) {
        sizeEl.value = clamp(Math.round(cm / CM_PER_INCH * dpi), MIN_SIZE, MAX_SIZE);
    }
}

function qrOptions(s) {
    return {
        width: s.size,
        margin: s.margin,
        errorCorrectionLevel: s.ecc,
        color: {
            dark: s.dark,
            // qrcode accepts #rrggbbaa; "00" alpha = fully transparent
            light: s.transparent ? "#ffffff00" : s.light,
        },
    };
}

// ---------- rendering ----------

let renderTimer;
let renderId = 0;

async function render() {
    const value = input.value.trim() || " ";
    currentValue = value;

    const s = readSettings();
    const id = ++renderId;
    const url = await QRCode.toDataURL(value, qrOptions(s));
    // drop stale results if the user kept typing while a big image rendered
    if (id === renderId) img.src = url;
}

function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 120);
}

function onSettingsChange() {
    lightEl.disabled = transparentEl.checked;
    saveSettings(readSettings());
    scheduleRender();
}

// ---------- downloads ----------

function download(url, filename) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

savePNG.addEventListener("click", async () => {
    const s = readSettings();
    const url = await QRCode.toDataURL(currentValue || " ", qrOptions(s));
    download(url, `qr-code-${s.size}px.png`);
});

saveSVG.addEventListener("click", async () => {
    const s = readSettings();
    const opts = qrOptions(s);
    delete opts.width; // SVG is vector: it scales to any size without losing sharpness
    const svg = await QRCode.toString(currentValue || " ", { ...opts, type: "svg" });

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    download(url, "qr-code.svg");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
});

// ---------- wiring ----------

sizeEl.addEventListener("input", () => { syncCmFromPx(); onSettingsChange(); });
cmEl.addEventListener("input", () => { syncPxFromCm(); onSettingsChange(); });
dpiEl.addEventListener("change", () => { syncPxFromCm(); onSettingsChange(); });
// snap out-of-range values back once the user leaves the field
sizeEl.addEventListener("change", () => { sizeEl.value = readSettings().size; syncCmFromPx(); });
marginEl.addEventListener("change", () => { marginEl.value = readSettings().margin; });

[eccEl, marginEl, darkEl, lightEl, transparentEl].forEach((el) =>
    el.addEventListener("input", onSettingsChange)
);

resetEl.addEventListener("click", () => {
    applySettings(DEFAULTS);
    onSettingsChange();
});

input.addEventListener("input", scheduleRender);
input.value = "";
applySettings(loadSettings());
render();
