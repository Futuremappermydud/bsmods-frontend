export function isValidSquareImage(base64: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        // Validate that the string starts with a valid Base64 image prefix
        const validBase64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
        if (!validBase64Regex.test(base64)) {
            resolve(false); // Not a valid image Base64
            return;
        }

        const image = new Image();

        // Set up event handlers
        image.onload = () => {
            // Check if the image is square
            const isSquare = image.width === image.height;
            resolve(isSquare);
        };

        image.onerror = () => {
            // The image could not be loaded
            resolve(false);
        };

        // Set the image source to the Base64 string
        image.src = base64;
    });
}