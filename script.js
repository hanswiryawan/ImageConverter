const fileInput = document.getElementById("fileInput");
const canvasOriginal = document.getElementById("canvasOriginal");
const canvasEdited = document.getElementById("canvasEdited");
const ctxOriginal = canvasOriginal.getContext("2d");
const ctxEdited = canvasEdited.getContext("2d");

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(500 / img.width, 500 / img.height);
            const width = img.width * scale;
            const height = img.height * scale;

            canvasOriginal.width = width;
            canvasOriginal.height = height;
            canvasEdited.width = width;
            canvasEdited.height = height;

            ctxOriginal.drawImage(img, 0, 0, width, height);
        };
        img.src = URL.createObjectURL(file);
    }
});

document.getElementById("toGrayscale").addEventListener("click", () => {
    const imageData = ctxOriginal.getImageData(0, 0, canvasOriginal.width, canvasOriginal.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
    }

    ctxEdited.putImageData(imageData, 0, 0);
});

document.getElementById("applyBlur").addEventListener("click", () => {
    const imageData = ctxOriginal.getImageData(0, 0, canvasOriginal.width, canvasOriginal.height);
    const data = imageData.data;
    const kernel = [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9];

    for (let y = 1; y < canvasOriginal.height - 1; y++) {
        for (let x = 1; x < canvasOriginal.width - 1; x++) {
            let r = 0, g = 0, b = 0;
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const index = ((y + ky) * canvasOriginal.width + (x + kx)) * 4;
                    const weight = kernel[(ky + 1) * 3 + (kx + 1)];
                    r += data[index] * weight;
                    g += data[index + 1] * weight;
                    b += data[index + 2] * weight;
                }
            }

            const newIndex = (y * canvasOriginal.width + x) * 4;
            data[newIndex] = r;
            data[newIndex + 1] = g;
            data[newIndex + 2] = b;
        }
    }

    ctxEdited.putImageData(imageData, 0, 0);
});
