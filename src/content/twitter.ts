// function sleep(ms: number) {
//   return new Promise((resolve) =>
//     setTimeout(resolve, ms)
//   );
// }

// export async function removeVisibleRetweets() {
//   const buttons = document.querySelectorAll(
//     '[data-testid="unretweet"]'
//   );

//   for (const button of buttons) {
//     (button as HTMLElement).click();

//     await sleep(500);

//     const confirmButton =
//       document.querySelector(
//         '[data-testid="unretweetConfirm"]'
//       );

//     if (confirmButton) {
//       (confirmButton as HTMLElement).click();
//     }

//     await sleep(1000);
//   }
// }

const MIN_DELAY = 2000;
const MAX_DELAY = 5000;
const MAX_ACTIONS_PER_RUN = 50;

const CONFIRM_DELAY = 700;
const SCROLL_DELAY = 2000;

const UNRETWEET_SELECTOR =
  '[data-testid="unretweet"]';
const CONFIRM_SELECTOR =
  '[data-testid="unretweetConfirm"]';
const UNLIKE_SELECTOR = '[data-testid="unlike"]';

let shouldStop = false;
// let isRunning = false;
// let currentAction:
//   | "retweets"
//   | "likes"
//   | null = null;

function getRandomDelay() {
  return Math.floor(
    Math.random() * (MAX_DELAY - MIN_DELAY + 1)
  ) + MIN_DELAY;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function scrollDown() {
  window.scrollBy({
    top: window.innerHeight,
    behavior: "smooth",
  });
}

// STOP REMOVING RETWEETS FUNC
export function stopCurrentAction() {
  shouldStop = true;
}

// REMOVING RETWEETS FUNC
export async function removeVisibleRetweets(
  dryRun = false
) {
  let removedCount = 0;
  let noButtonFoundCount = 0;
  shouldStop = false;

  await chrome.storage.local.set({
    isRunning: true,
    // currentAction: "retweets",
    removedCount: 0,
  });

  try {
    while (!shouldStop && removedCount < MAX_ACTIONS_PER_RUN) {
      const button = document.querySelector(
        UNRETWEET_SELECTOR
      ) as HTMLElement | null;

      // No visible retweet button
      if (!button) {
        noButtonFoundCount++;

        scrollDown();
        await sleep(SCROLL_DELAY);

        // If we couldn't find any button several times,
        // assume we're done.
        if (noButtonFoundCount >= 5) {
          console.log(
            dryRun
              ? `DRY RUN finished. Found ${removedCount} retweets to remove.`
              : `Finished. Removed ${removedCount} retweets.`
          );
          break;
        }

        continue;
      }

      noButtonFoundCount = 0;

      if(dryRun) {
        removedCount++;

        await chrome.storage.local.set({
          isRunning: true,
          // currentAction: "retweets",
          removedCount,
        });

        console.log(
          `DRY RUN: Would remove retweet #${removedCount}`
        );

        scrollDown();
        await sleep(SCROLL_DELAY);
        continue;

      } else {
        // Click "Undo repost"
        button.click();
        await sleep(CONFIRM_DELAY);

        // Click confirmation button
        const confirmButton = document.querySelector(
          CONFIRM_SELECTOR
        ) as HTMLElement | null;

        if (confirmButton) {
          confirmButton.click();
          removedCount++;

          await chrome.storage.local.set({
            isRunning: true,
            // currentAction: "retweets",
            removedCount,
          });
          
          console.log(`Removed ${removedCount} retweets`);
        }
      }

      // Wait for Twitter/X to update the DOM
      await sleep(getRandomDelay());
    }

    if (shouldStop) {
      console.log(
        `Stopped after processing ${removedCount} retweets.`
      );
    }

  } catch(error) {
    console.error(
      "Failed while removing retweets:",
      error
    );

    throw error;

  } finally {
    shouldStop = false;

    await chrome.storage.local.set({
      isRunning: false,
      // currentAction: null,
      removedCount,
    });
  }

  return removedCount;
}

// REMOVING LIKES FUC
export async function removeAllLikes(
  dryRun = false
) {
  let removedCount = 0;
  let noButtonFoundCount = 0;

  shouldStop = false;

  await chrome.storage.local.set({
    isRunning: true,
    // currentAction: "likes",
    removedCount: 0,
  });

  try {
    while (
      !shouldStop &&
      removedCount < MAX_ACTIONS_PER_RUN
    ) {
      const button = document.querySelector(
        UNLIKE_SELECTOR
      ) as HTMLElement | null;

      if (!button) {
        noButtonFoundCount++;

        scrollDown();
        await sleep(SCROLL_DELAY);

        if (noButtonFoundCount >= 5) {
          console.log(
            dryRun
              ? `DRY RUN finished. Found ${removedCount} likes to remove.`
              : `Finished. Removed ${removedCount} likes.`
          );
          break;
        }

        continue;
      }

      noButtonFoundCount = 0;

      if (dryRun) {
        removedCount++;

        console.log(
          `DRY RUN: Would remove like #${removedCount}`
        );

        await chrome.storage.local.set({
          isRunning: true,
          // currentAction: "likes",
          removedCount,
        });

        await sleep(SCROLL_DELAY);
        continue;

      } else {
        button.click();

        removedCount++;
        await chrome.storage.local.set({
          isRunning: true,
          // currentAction: "likes",
          removedCount,
        });

        console.log(
          `Removed ${removedCount} likes`
        );
      }

      await sleep(getRandomDelay());
    }

    if (shouldStop) {
      console.log(
        `Stopped after processing ${removedCount} likes.`
      );
    }

  } catch(error) {

    console.error(
      "Failed while removing likes:",
      error
    );

    throw error;

  } finally {
    shouldStop = false;

    await chrome.storage.local.set({
      isRunning: false,
      // currentAction: null,
      removedCount,
    });
  }

  return removedCount;
}

