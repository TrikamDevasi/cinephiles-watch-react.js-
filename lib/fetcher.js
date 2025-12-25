export const fetchWithRetry = async (url, options = {}, retries = 3, backoff = 300) => {
  try {
    const res = await fetch(url, options);
    
    // If it's a 429 (Too Many Requests) or 500+ (Server Error), we throw to trigger a retry
    if (!res.ok) {
      if (retries > 0 && (res.status === 429 || res.status >= 500)) {
        throw new Error(`Retrying... status: ${res.status}`);
      }
      return res;
    }
    
    return res;
  } catch (error) {
    if (retries > 0) {
      // Wait for a bit (backoff)
      await new Promise((resolve) => setTimeout(resolve, backoff));
      // Retry recursively
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
};
