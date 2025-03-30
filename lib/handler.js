async function handler(method, url, inputData) {
    try {
      // Create fetch request options
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      // Send data for methods like POST, PUT
      if (inputData && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(inputData);
      }
      
      const response = await fetch(url, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      return { error: 'Data could not be retrieved' };
    }
  }

  export default handler;