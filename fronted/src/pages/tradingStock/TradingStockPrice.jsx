import { useContext, useState, useEffect, useRef } from 'react';
import { TradeStockContext } from './../context/TradeStockContext';
import useWebSocket from "react-use-websocket";

export default function TradingStockPrice() {

    // websocket price
    const [websocketPrice, setWebSockwwwetPrice] = useState("");
    const { stockNameID, setStockNameID } = useContext(TradeStockContext);
    
    const prevStockNameID = usePrevious(stockNameID);

    const API_KEY = '980OIYKEGSOHZGGDKCIY';
    var socketUrl = 'wss://stream.cryptowat.ch/connect?apikey=' + API_KEY;

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    // Helper method for subscribing to resources
    function subscribe(resources) {
        sendMessage(JSON.stringify({
        subscribe: {
            subscriptions: resources.map((resource) => { return { streamSubscription: { resource: resource } } })
        }
        }));
    }
  
    // Helper method for subscribing to resources
    function unsubscribe(resources) {
        sendMessage(JSON.stringify({
        unsubscribe: {
            subscriptions: resources.map((resource) => { return { streamSubscription: { resource: resource } } })
        }
        }))
    }

    subscribe(['markets:9:trades']);
  
    if (stockNameID != "") {
        if (prevStockNameID == "") {
        console.log("gffdgfdgdfgdf")
        const setddstockNameID = 9
        //subscribe(['markets:'+ setddstockNameID +':trades']);
        subscribe(['markets:9:trades']);
        } else {
        if (stockNameID != prevStockNameID) {
            //unsubscribe(['markets:'+ stockNameID +':trades']);
            subscribe(['markets:' + stockNameID + ':trades']);
        }
        }
    }

    if (lastMessage != null) {
        //const message = JSON.parse(lastMessage.data);
        new Response(lastMessage.data).arrayBuffer().then(buffer => {
          var enc = new TextDecoder("utf-8");
          const stockInfoJSON = JSON.parse(enc.decode(buffer));
      
          if (stockInfoJSON["authenticationResult"] && stockInfoJSON["authenticationResult"]["status"] === "AUTHENTICATED") {
              console.log("Streaming trades for 1 second...")
              subscribe(['instruments:'+stockNameID+':trades']);
          }
      
          if (stockInfoJSON["marketUpdate"] && stockInfoJSON["marketUpdate"]["tradesUpdate"]) {
            setWebSocketPrice(stockInfoJSON["marketUpdate"]["tradesUpdate"]["trades"][0]["priceStr"]);
          }
      
        })
    }
    

    useEffect(() => {
        
    }, []);

    return (
        <div>
            <div className="mb-4">
                <h1 className="block text-gray-700 text-lm font-bold mb-2">Price: {websocketPrice}</h1>
            </div>
        </div> 
    )
}

// Hook
function usePrevious(value) {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    const ref = useRef();
    // Store current value in ref
    useEffect(() => {
      ref.current = value;
    }, [value]); // Only re-run if value changes
    // Return previous value (happens before update in useEffect above)
    if (ref.current == undefined) {
        return "";
    } else {
        return ref.current;
    }
  }