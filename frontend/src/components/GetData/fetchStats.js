async function fetchStats() {
    try {
      const response = await fetch('http://localhost:3001/dailystats',{
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
  
  export default fetchStats;
  