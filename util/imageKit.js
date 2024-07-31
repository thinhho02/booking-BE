import ImageKit from 'imagekit'
import multer from 'multer';

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });


export const imagekit = new ImageKit({
    publicKey : process.env.PUBLIC_KEY_IMAGEKIT,
    privateKey : process.env.PRIVATE_KEY_IMAGEKIT,
    urlEndpoint : "https://ik.imagekit.io/r9vwbtuo5/"
});