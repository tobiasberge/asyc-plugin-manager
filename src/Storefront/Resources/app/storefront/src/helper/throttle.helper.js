/**
 *
 * @param ms
 * @returns {Promise<unknown>}
 */
export default function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}