/* 
    We probably want to get those values from 7tv database and set width dynamically from emote ratio.
    It's just a concept I have no idea how you handle emotes i.e. Twitch.
*/
const shortEmote = 'WHAT';
const shortWidth = "16px";
const shortEmoteRegex = new RegExp(`(?<!alt="[^"]*)\\b${shortEmote}\\b`, 'g'); // Regex to find the word "WHAT" (case-sensitive) and exclude it from alt attribute

const longEmote = 'om';
const longWidth = "72px";
const longEmoteRegex = new RegExp(`(?<!alt="[^"]*)\\b${longEmote}\\b`, 'g'); // Regex to find the word "om" (case-sensitive) and exclude it from alt attribute

// Function to replace keywords with emotes
function replaceKeywords() {
    const comments = document.querySelectorAll("span.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap");

    comments.forEach((comment) => {
        // Check if the keyword exists in the comment
        const originalText = comment.innerHTML;
        var updatedText = originalText.replace(
            shortEmoteRegex,
            `<img src="https://cdn.7tv.app/emote/01G4ZTECKR0002P97QQ94BDSP4/4x.avif" alt="${shortEmote}" style="width:${shortWidth}; height:16px;">` //once again, get src from database
        );
        // Update the comment's HTML if any replacement occurred
        if (originalText !== updatedText) {
            comment.innerHTML = updatedText;
        }

        // Preferably we would merge both together into one foreach loop checking for every channel emote instead manually stacking updatedText and ifs

        updatedText = originalText.replace(
            longEmoteRegex,
            `<img src="https://cdn.7tv.app/emote/01FET023A8000C9XXF2H0G0AQF/4x.avif" alt="${longEmote}" style="width:${longWidth}; height:16px;">`
        );

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
    var commentSection = document.querySelector(`ytd-item-section-renderer#sections`);
    if (!commentSection) {
        console.log("comment section not found");
        setTimeout(startObserving, 1000);
        return;
    }

    var contentDiv = commentSection.querySelector("div#contents");
    if (!contentDiv) {
        console.log("contents not found");
        setTimeout(startObserving, 1000);
        return;
    }

    console.log("Everything found, starting observing...");
    observer.observe(document.body, { childList: true, subtree: true, }); // Temporarily document.body as a target. I have no idea why code above suddenly stopped working
}

// Initial start
startObserving();