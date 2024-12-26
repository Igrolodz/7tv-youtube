// Function to replace keywords with images
function replaceKeywords() {
    const comments = document.querySelectorAll("span.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap");

    comments.forEach((comment) => {
        // Check if the keyword exists in the comment
        const originalText = comment.innerHTML;
        const updatedText = originalText.replace(
            /(?<!alt="[^"]*)\bWHAT\b/g, // Regex to find the word "WHAT" (case-sensitive)
            `<img src="https://cdn.7tv.app/emote/01G4ZTECKR0002P97QQ94BDSP4/2x.avif" alt="WHAT Emote" style="width:16px; height:16px;">`
        );
        // Update the comment's HTML if any replacement occurred
        if (originalText !== updatedText) {
            comment.innerHTML = updatedText;
        }
    });
}

// Callback for mutation observer
const callback = (mutations, observer) => {
    for (const mutation of mutations) {
        if (mutation.type === "childList") {
            if (mutation.target && mutation.target.id === "contents") {
                console.log("new comments found");
                replaceKeywords();
            }
        }
    }
}

const observer = new MutationObserver(callback);

// Start observing the comment section once it's available
function startObserving() {
    const commentSection = document.querySelector("ytd-item-section-renderer#sections");
    if (!commentSection) {
        console.log("can't find comment section");
        setTimeout(startObserving, 1000);
        return;
    }

    const contentDiv = commentSection.querySelector("div#contents");
    if (!contentDiv) {
        console.log("can't find content div");
        setTimeout(startObserving, 1000);
        return;
    }

    console.log("Everything found, starting observing...");
    observer.observe(document.body, { childList: true, subtree: true });
}

// Initial start
startObserving();