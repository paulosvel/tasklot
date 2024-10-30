import { useEffect, useState } from "react";

const Home = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => setMessage(data.message))
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

  return <div>{message}</div>;
};

export default Home;
