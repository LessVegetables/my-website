import QRCode from "https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm";

const input = document.getElementById("text");
const img = document.getElementById("qrImg");

async function render() {
    const value = input.value.trim() || " ";
    img.src = await QRCode.toDataURL(value, {
        width: 256,
        margin: 2,
        errorCorrectionLevel: "M",
    });
}

input.addEventListener("input", render);
input.value = "";
render();
