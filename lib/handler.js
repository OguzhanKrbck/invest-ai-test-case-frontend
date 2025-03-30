async function handler(method, url, inputData) {
    try {
      // Fetch isteği seçeneklerini oluştur
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      // POST, PUT gibi metodlar için veri gönder
      if (inputData && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(inputData);
      }
      
      const response = await fetch(url, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch hatası:', error);
      return { error: 'Veri alınamadı' };
    }
  }

  export default handler;