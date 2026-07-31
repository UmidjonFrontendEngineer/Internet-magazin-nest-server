import axios from 'axios';
const FormData = require('form-data');

export async function uploadImageToImgBB(file: { buffer: Buffer; originalname: string }): Promise<string> {
    if (!file) {
        throw new Error('Yuklash uchun rasm topilmadi!');
    }

    const formData = new FormData();
    formData.append('image', file.buffer, file.originalname);

    const apiKey = process.env.IMGBB_API_KEY;

    try {
        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                },
            },
        );

        return response.data.data.url;
    } catch (error) {
        throw new Error('Rasmni ImgBB ga yuklashda xatolik yuz berdi!');
    }
}