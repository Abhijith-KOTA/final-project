async function fetchDustData() {
    try {
      const response = await fetch('https://reimagined-space-bassoon-4xj6xwj64v6c7wpp-3001.app.github.dev/getdata',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', 
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }
  
  export default fetchDustData;
  