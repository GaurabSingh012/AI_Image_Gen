import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Inference-Provider': 'nscale',
          'Accept': 'image/png' // This bypasses the strict */* parsing error
        },
        responseType: 'arraybuffer',
      }
    );

    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    
    return res.status(200).json({ photo: base64Image });

  } catch (error) {
    console.error("HF Error:", error.response?.data?.toString() || error.message);
    res.status(500).json({ 
      message: "Generation failed", 
      error: error.response?.data?.toString() || error.message 
    });
  }
};