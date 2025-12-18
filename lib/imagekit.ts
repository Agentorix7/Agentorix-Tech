import ImageKit from "imagekit";

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

if (!publicKey || !privateKey || !urlEndpoint) {
  // Fail fast in development to surface configuration issues
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "ImageKit environment variables are not fully configured. IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT are required."
    );
  }
}

export const imagekit = new ImageKit({
  publicKey: publicKey || "",
  privateKey: privateKey || "",
  urlEndpoint: urlEndpoint || "",
});


