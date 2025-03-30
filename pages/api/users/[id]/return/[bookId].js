import Handler from '@/lib/handler';

export default async function handler(req, res) {
    const { method } = req;
    const { id, bookId } = req.query;

    switch (method) {
        case 'POST':
            const { score } = req.body; // score is required
            const getResponse = await Handler('POST', `${process.env.BASE_URL}/users/${id}/return/${bookId}`, { score });
            return res.status(200).json(getResponse);
            
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}           
