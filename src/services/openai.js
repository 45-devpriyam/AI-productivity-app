import axios from "axios";

const API_KEY = process.env.REACT_APP_OPENROUTER_KEY;

export const sendMessageToAI = async (message) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("API ERROR:", error.response?.data || error.message);
    throw new Error("Failed to get AI response");
  }
};

/**
 * Generate image using OpenRouter API with free model
 * @param {string} prompt - Image generation prompt
 * @param {string} style - Image style preference
 * @param {string} size - Image size preference
 * @returns {Promise<string>} - Generated image URL
 */
export const generateImage = async (prompt, style = 'realistic', size = 'medium') => {
  try {
    // Enhance prompt with style information
    const enhancedPrompt = `${prompt}, ${style} style, high quality, detailed`;
    
    const response = await axios.post(
      "https://openrouter.ai/api/v1/images/generations",
      {
        model: "stability-ai/stable-diffusion-2-1", // Free model
        prompt: enhancedPrompt,
        n: 1,
        size: "512x512", // Fixed size for free model
        response_format: "url"
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AI Productivity App"
        },
      }
    );

    // Extract the image URL from response
    const imageUrl = response.data.data[0].url;
    
    if (!imageUrl) {
      throw new Error('No image URL received from API');
    }

    return imageUrl;

  } catch (error) {
    console.error("Image Generation Error:", error.response?.data || error.message);
    
    // Fallback to placeholder image if API fails
    const seed = prompt.replace(/\s+/g, '').toLowerCase();
    return `https://picsum.photos/seed/${seed}/512/512.jpg`;
  }
};