import FileSaver from 'file-saver';

/**
 * Downloads an image to the user's local device.
 * 
 * @param {string} _id - The unique identifier of the post (used for naming).
 * @param {string} photo - The Cloudinary image URL.
 */
export async function downloadImage(_id, photo) {
  FileSaver.saveAs(photo, `download-${_id}.jpg`);
}