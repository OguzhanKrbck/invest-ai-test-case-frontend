import Handler from '@/lib/handler';

export default async function handler(req, res) {
    const { method } = req;

    if (method === 'GET') {
        const response = await Handler('GET', `${process.env.BASE_URL}/books`, null);   

       return  res.status(200).json(response);
    } 
    return res.status(405).json({ message: 'Method not allowed' });
}           
