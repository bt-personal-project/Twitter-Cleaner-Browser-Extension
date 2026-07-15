import { useEffect, useState } from "react";
import { MESSAGE_TYPES } from "../shared/message-types";

function Popup() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null); 
  const [removedCount, setRemovedCount] = useState(0);
  const [dryRun, setDryRun] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // const handleRemoveRetweets = async () => {
  //   const [tab] = await chrome.tabs.query({
  //     active: true,
  //     currentWindow: true,
  //   });

  //   if (!tab.id) {
  //     return;
  //   }

  //   chrome.tabs.sendMessage(tab.id, {
  //     type: MESSAGE_TYPES.REMOVE_RETWEETS,
  //   });
  // };

  const sendMessage = async (type: string) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    

    if (!tab.id) {
      return;
    }

    // if(
    //   type === MESSAGE_TYPES.REMOVE_LIKES ||
    //   type === MESSAGE_TYPES.REMOVE_RETWEETS
    // ) {
    //   setIsRunning(true);
    //   setCurrentAction(type);
    // }

    // if(type === MESSAGE_TYPES.STOP) {
    //   setIsRunning(false);
    //   setCurrentAction(null);
    // }


    const url = tab.url ?? "";

    if (!tab.url?.includes("x.com")) {
      setErrorMessage("Please open X/Twitter first.");
      return;
    }

    if (
      type === MESSAGE_TYPES.REMOVE_LIKES &&
      !url.includes("/likes")
    ) {
      setErrorMessage(
        "Open your Profile → Likes page first."
      );
      return;
    }

    const isProfilePage =
      /^https:\/\/x\.com\/[^/]+\/?$/.test(
        url
      ) ||
      /^https:\/\/x\.com\/[^/]+\/with_replies\/?$/.test(
        url
      );

    if (
      type === MESSAGE_TYPES.REMOVE_RETWEETS &&
      // !url.includes("/retweets")
      !isProfilePage
    ) {
      setErrorMessage(
        "Open your Profile → Reposts page first."
      );
      return;
    }

    chrome.tabs.sendMessage(tab.id, { type, dryRun });
  };

  // Event Listener
  useEffect(() => {
    const listener = (
      changes: any,
      area: string
    ) => {
      if (area !== "local") return;

      console.log("CHANGES:", changes);

      if (changes.isRunning) {
        setIsRunning(
          changes.isRunning.newValue
        );
      }

      if (changes.currentAction) {
        setCurrentAction(
          changes.currentAction.newValue
        );
      }

      if (changes.removedCount) {
        setRemovedCount(
          changes.removedCount.newValue
        );
      }
    };

    chrome.storage.onChanged.addListener(
      listener
    );

    return () => {
      chrome.storage.onChanged.removeListener(
        listener
      );
    };
  }, []);


  useEffect(() => {
    console.log("chrome", chrome);
    console.log("storage", chrome.storage);
  }, []);

  return (
    <div 
      // style={{
      // width: "340px",
      // minHeight: "420px",
      // padding: "16px",
      // }}
    >
      <h2>Twitter Cleaner</h2>

      {
        errorMessage && (
          <div
            style={{
              background: "#fff3cd",
              color: "#856404",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "12px",
              fontSize: "14px",
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )
      }

      <label>
        <input
          type="checkbox"
          checked={dryRun}
          onChange={(e) => setDryRun(e.target.checked)}
        />
        Dry run Mode
      </label>

      <div style={{display: "flex", margin: "10px 0", }}>
        <button
          disabled={isRunning}
          onClick={() =>
            sendMessage(MESSAGE_TYPES.REMOVE_RETWEETS)
          }
        >
          {isRunning && MESSAGE_TYPES.REMOVE_RETWEETS === currentAction ? "Removing Retweets ..." : "Start Removing Retweets"}
        </button>

        <button
          disabled={isRunning}
          onClick={() => sendMessage(MESSAGE_TYPES.REMOVE_LIKES)}
        >
          {isRunning && MESSAGE_TYPES.REMOVE_LIKES === currentAction ? "Removing Likes ..." : "Start Remove Likes"}
          
        </button>
      </div>

      <div style={{marginBottom: "10px"}}>
        <div>Status: {isRunning ? "Running" : "Idle"}</div>
        <div>Action: {currentAction ?? "-"}</div>
        <div>Removed: {removedCount}</div>
      </div>
      
      <button
        disabled={!isRunning}
        onClick={() =>
          sendMessage(
            MESSAGE_TYPES.STOP
          )
        }
      >
        Stop
      </button>

    </div>
  );
}

export default Popup;