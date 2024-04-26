async function fetchDustData() {
    try {
      const response = await fetch('http://localhost:3001/getPM25',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Request headers
        },
        mode: 'cors', 
        body: JSON.stringify({ /* Request body */ })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      console.log(jsonData)
      return jsonData;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }
  
  export default fetchDustData;
  