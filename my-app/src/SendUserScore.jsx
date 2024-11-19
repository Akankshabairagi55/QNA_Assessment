export default function sendUserScore(userScore) {
  const apiEndpoint = "https://assesment-server-umber.vercel.app/calculate-risk-score";

  const payload = {
    userScore: userScore, // Replace with the actual user score
  };

  fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify JSON content type
    },
    body: JSON.stringify(payload), // Convert payload to JSON string
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Parse the JSON response
    })
    .then((data) => {
      console.log("Response from server:", data);
    })
    .catch((error) => {
      console.error("Error sending userScore:", error);
    });
}

// Example usage
const userScore = 20; // Replace this with the user's actual score
sendUserScore(userScore);