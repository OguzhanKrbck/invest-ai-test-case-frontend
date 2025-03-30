import Handler from '@/lib/handler';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query; // URL'den kullanıcı ID'sini alıyoruz

    switch (method) {
        case 'GET':
            // Belirli bir kullanıcıyı getir
            const getResponse = await Handler('GET', `${process.env.BASE_URL}/users/${id}`, null);
            return res.status(200).json(getResponse);
            
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}           
