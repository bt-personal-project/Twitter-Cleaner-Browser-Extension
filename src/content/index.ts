import { MESSAGE_TYPES } from "../shared/message-types";
import { removeVisibleRetweets, stopCurrentAction, removeAllLikes } from "./twitter";

// chrome.runtime.onMessage.addListener(
//   async (message) => {
//     if (message.type === MESSAGE_TYPES.REMOVE_RETWEETS) {
//       await removeVisibleRetweets();
//     }
//   }
// );


chrome.runtime.onMessage.addListener(
  (message) => {
    switch (message.type) {
      case MESSAGE_TYPES.REMOVE_RETWEETS:
        removeVisibleRetweets(message.dryRun);
        break;

      case MESSAGE_TYPES.REMOVE_LIKES:
        removeAllLikes(message.dryRun);
        break;

      case MESSAGE_TYPES.STOP:
        stopCurrentAction()
        break;
    }
  }
);

