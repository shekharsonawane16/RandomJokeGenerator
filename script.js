const jokeText = document.getElementById("joke-text");
const newJokeBtn = document.getElementById("new-joke");
const shareBtn = document.getElementById("share-joke");
const statusEl = document.getElementById("status");

const API_URL = "https://icanhazdadjoke.com/";

let currentJoke = "";

async function fetchJoke() {
    setLoading(true);
    showStatus("Loading joke...");

    try {
        const response = await fetch(API_URL, {
            headers: {
                Accept: "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();

        if (!data.joke) {
            throw new Error("No joke received.");
        }

        currentJoke = data.joke;
        showJoke(currentJoke);
        showStatus("");

    } catch (error) {
        console.error("Error fetching joke:", error);

        showJoke("Oops! Could not fetch a joke. Please try again.");
        showStatus("Failed to load joke.", true);

    } finally {
        setLoading(false);
    }
}

function showJoke(joke) {
    jokeText.textContent = joke;
}

function showStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.classList.toggle("error", isError);
}

function setLoading(isLoading) {
    newJokeBtn.disabled = isLoading;
    shareBtn.disabled = isLoading;

    newJokeBtn.textContent = isLoading
        ? "Loading..."
        : "New Joke";
}

async function shareJoke() {
    if (!currentJoke) {
        showStatus("Get a joke first.", true);
        return;
    }

    if (navigator.share) {
        try {
            await navigator.share({
                title: "Random Joke",
                text: currentJoke
            });

            showStatus("Joke shared!");

        } catch (error) {
            // User cancelled sharing
            console.log("Share cancelled.");
        }

    } else {
        try {
            await navigator.clipboard.writeText(currentJoke);

            showStatus("Joke copied to clipboard!");

            setTimeout(() => {
                showStatus("");
            }, 2000);

        } catch (error) {
            showStatus(
                "Sharing and clipboard are not supported.",
                true
            );
        }
    }
}

newJokeBtn.addEventListener("click", fetchJoke);
shareBtn.addEventListener("click", shareJoke);

// Load a joke when the page opens
fetchJoke();
