import "./App.css";
import Auth from "./components/auth";
import { db, auth, storage } from "./config/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";

function App() {
  const [movieList, setMovieList] = useState([]);
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");

  useEffect(() => {
    const getMovieList = async () => {
      // READ THE DATA FROM FIREBASE
      try {
        const data = await getDocs(moviesCollectionRef);
        const filteredData = data.docs.map((doc) => {
          return { ...doc.data(), id: doc.id }; // the doc.data() method returns the document's fields
        });
        setMovieList(filteredData);
      } catch (err) {
        console.error(err);
      }

      // SET movieList
    };
    getMovieList();
  }, [moviesCollectionRef]);

  const submitNewMovie = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const newMovie = {
      title: data.get("movieTitle"),
      releaseDate: data.get("releaseDate"),
      receivedAnOscar: data.get("hasOscar") === "on",
      userId: auth?.currentUser?.uid,
    };
    try {
      const newAddedMovie = await addDoc(moviesCollectionRef, newMovie);
      newMovie.id = newAddedMovie.id;
      setMovieList([...movieList, newMovie]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMovie = async (movieId) => {
    try {
      const movieToDelete = doc(db, "movies", movieId);
      await deleteDoc(movieToDelete);
      setMovieList(
        movieList.filter((movie) => {
          return movie.id !== movieId;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const updateMovieTitle = async (movieId) => {
    // Grabbing the reference to the movie to be updated
    const movieToUpdate = doc(db, "movies", movieId);
    //Updating the movie title
    await updateDoc(movieToUpdate, { title: newMovieTitle });
    setMovieList(
      movieList.map((movie) => {
        if (movie.id !== movieId) {
          return movie;
        } else {
          return (movie.title = newMovieTitle);
        }
      })
    );
  };

  const uploadFile = async () => {
    if (!fileToUpload) return;
    // Specifying the path of the file to upload
    const filesFolderRef = ref(storage, `/projectFiles/${fileToUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileToUpload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <div className="auth" style={{ border: "1px solid black", margin: 20 }}>
        <Auth />
      </div>
      <div className="newMovie">
        <form onSubmit={submitNewMovie}>
          <h2>New Movie Form</h2>
          <label>
            Movie title: <input type="text" name="movieTitle" />
          </label>
          <label>
            Release date: <input type="number" name="releaseDate" />
          </label>
          <label>
            <input type="checkbox" name="hasOscar" />
            Received an Oscar
          </label>
          <input type="submit" value="Add movie" />
        </form>
      </div>
      <div
        className="movieList"
        style={{ border: "1px solid blue", margin: 20 }}
      >
        <h2>List of movies</h2>
        {movieList.map((movie, key) => {
          return (
            <div key={key}>
              <h1
                className="title"
                style={{ color: movie.receivedAnOscar ? "green" : "red" }}
              >
                {movie.title}
              </h1>
              <div className="releaseDate">
                Release date: {movie.releaseDate}
              </div>
              <div className="receivedAnOscar">
                This movie has {movie.receivedAnOscar ? "" : "not"} received an
                Oscar
              </div>
              <button
                onClick={() => {
                  deleteMovie(movie.id);
                }}
              >
                Delete movie
              </button>
              <input
                type="text"
                onChange={(e) => {
                  setNewMovieTitle(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  updateMovieTitle(movie.id);
                }}
              >
                Update Movie title
              </button>
            </div>
          );
        })}
      </div>
      <div className="uploadFile">
        <input
          type="file"
          onChange={(e) => {
            setFileToUpload(e.target.files[0]);
          }}
        />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  );
}

export default App;
