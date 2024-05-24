async function fetchStats() {
    try {
      const response = await fetch('https://automatic-tribble-7gvwgpvw6gwfxwpw-3001.app.github.dev/dailystats',{
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
  