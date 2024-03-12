/**
 * Calculates the SHA-256 hash value of a given message.
 *
 * @param message - The message to hash.
 * @returns - A promise that resolves to the SHA-256 hash value of the message.
 */
export const sha256 = async (message: string) => {
    const msgBuffer = new TextEncoder().encode(message);                    
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));              
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export default sha256;
