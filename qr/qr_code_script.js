import QRCode from "https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm";

const input = document.getElementById("text");
const img = document.getElementById("qrImg");

const savePNG = document.getElementById("savePNG");
const saveSVG = document.getElementById("saveSVG");

let currentValue = "";

async function render() {
    const value = input.value.trim() || " ";
    currentValue = value;

    img.src = await QRCode.toDataURL(value, {
        width: 256,
        margin: 2,
        errorCorrectionLevel: "M",
    });
}

function download(url, filename) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

savePNG.addEventListener("click", () => {
    if (img.src) download(img.src, "qr-code.png");
});

saveSVG.addEventListener("click", async () => {
    const svg = await QRCode.toString(currentValue || " ", {
        type: "svg",
        margin: 2,
        errorCorrectionLevel: "M",
    });

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    download(url, "qr-code.svg");
    URL.revokeObjectURL(url);
});

input.addEventListener("input", render);
input.value = "";
render();
