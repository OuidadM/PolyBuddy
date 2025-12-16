import { useCallback, useState, useEffect } from "react";

export const useAvatarGenerator = (avatarPrompts, API_URL, API_KEY) => {
  const [avatarUrls, setAvatarUrls] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const generateAvatar = useCallback(async (prompt, key, attempt = 0) => {
    const maxRetries = 5;
    const baseDelay = 1000;
    try {
      const payload = {
        instances: [{ prompt: prompt }],
        parameters: { sampleCount: 1, outputMimeType: "image/png" },
      };

      const response = await fetch(`${API_URL}?key=${API_KEY}` , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const base64Data = result?.predictions?.[0]?.bytesBase64Encoded;

      if (base64Data) {
        return `data:image/png;base64,${base64Data}`;
      } else {
        throw new Error("Invalid response structure or missing image data.");
      }

    } catch (error) {
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return generateAvatar(prompt, key, attempt + 1);
      } else {
        console.error(`Failed to generate avatar for ${key} after ${maxRetries} attempts:`, error);
        return null;
      }
    }
  }, [API_URL, API_KEY]);

  useEffect(() => {
    const generateAllAvatars = async () => {
      if (!API_KEY) {
        setIsLoading(false);
        return;
      }
      const keys = Object.keys(avatarPrompts);
      const newUrls = {};
      const generationPromises = keys.map(key =>
        generateAvatar(avatarPrompts[key], key).then(url => {
          if (url) {
            newUrls[key] = url;
          }
        })
      );
      await Promise.all(generationPromises);
      setAvatarUrls(newUrls);
      setIsLoading(false);
    };
    generateAllAvatars();
  }, [avatarPrompts, API_KEY, generateAvatar]);

  const getAvatarUrl = (key) => avatarUrls[key] || "";

  return { avatarUrls, getAvatarUrl, isLoading };
};
