import React, { useState, useEffect } from "react";

function App() {
  const [image, setImage] = useState(null); // State to store the image URL
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [ifApi, setIfAPi] = useState(null); // Use to load image retrieved from API

  // Function to fetch image as a Blob (binary data)
  const fetchImage = async (imageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://imagesapi.ztnaut.com?image=${imageNumber}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      // Convert the response to a Blob
      const imageBlob = await response.blob();

      // Create an object URL from the Blob
      const imageUrl = URL.createObjectURL(imageBlob);
      setImage(imageUrl); // Store the image URL
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to get the image query parameter from the URL
  const getImageFromQuery = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("image"); // Get the 'image' query parameter
  };

  // Fetch image based on the query parameter on page load
  useEffect(() => {
    const imageParam = getImageFromQuery();
    if (imageParam) {
      fetchImage(imageParam);
    }
  }, []); // Only run on mount

  // Handle keypress event (Spacebar)
  const handleKeyPress = (event) => {
    if (event.code === "Space") {
      const randomImageNumber = Math.floor(Math.random() * 10) + 1; // Generate a random number (e.g., 1-100)
      fetchImage(randomImageNumber);
    }
  };

  // Add event listener for Spacebar key press on mount
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-6">Random Image Fetcher</h1>

        {loading && <p className="text-xl text-blue-500">Loading image...</p>}
        {error && <p className="text-xl text-red-500">Error: {error}</p>}

        {image ? (
          <div>
            <img
              src={image} // Using the Object URL for the image
              alt="Random Image"
              className="max-w max-h object-cover mx-auto rounded-lg shadow-lg"
            />
          </div>
        ) : (
          <p className="text-xl text-gray-600">
            <span className="font-bold">Scenario 2: </span>Press the Spacebar to
            get a random image!
          </p>
        )}
      </div>
    </div>
  );

  // return (
  //   <div className="flex items-center justify-center h-screen">
  //     <h1 class="text-3xl font-bold underline">Hello Vite!</h1>
  //   </div>
  // );
}

export default App;
