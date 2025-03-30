import Handler from '@/lib/handler';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'GET':
            const getResponse = await Handler('GET', `${process.env.BASE_URL}/books/${id}`, null);
            return res.status(200).json(getResponse);
            
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}           
