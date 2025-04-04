import React, { useState, useEffect } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 👉 Function to fetch image from blob (used for ?image query)
  const fetchImage = async (imageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://imagesapi.ztnaut.com?image=${imageNumber}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch image from image query param.");
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setImage(imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 👉 Function to fetch image URL from API (used for ?imagelink)
  const fetchImageFromLinkAPI = async (imageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://imagesapi.ztnaut.com/api/images/${imageNumber}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch image from imagelink API.");
      }

      const data = await response.json();
      if (!data.imageUrl) {
        throw new Error("Image URL not found in API response.");
      }

      setImage(data.imageUrl); // Direct URL, not blob
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Get query params from URL
  const getQueryParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      image: urlParams.get("image"),
      imagelink: urlParams.get("imagelink"),
    };
  };

  // 🧠 On mount, check query parameters and fetch accordingly
  useEffect(() => {
    const { image, imagelink } = getQueryParams();

    if (imagelink !== null) {
      fetchImageFromLinkAPI(imagelink); // e.g., ?imagelink=true
    } else if (image) {
      fetchImage(image); // e.g., ?image=5
    }
  }, []);

  // 🧠 Handle Spacebar
  const handleKeyPress = (event) => {
    if (event.code === "Space") {
      const randomImageNumber = Math.floor(Math.random() * 10) + 1;
      fetchImage(randomImageNumber);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-6">Random Image Fetcher</h1>

        {loading && <p className="text-xl text-blue-500">Loading image...</p>}
        {error && <p className="text-xl text-red-500">Error: {error}</p>}

        {image ? (
          <img
            src={image}
            alt="Random"
            className="max-w max-h object-cover mx-auto rounded-lg shadow-lg"
          />
        ) : (
          <p className="text-xl text-gray-600">
            <span className="font-bold">Scenario 2: </span>Press the Spacebar to
            get a random image!
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
