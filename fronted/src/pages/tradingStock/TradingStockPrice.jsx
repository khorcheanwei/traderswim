import { useContext, useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

export default function TradingStockPrice() {

    // websocket price
    const [websocketPrice, useWebSocketPrice] = useState("");

    const API_KEY = '980OIYKEGSOHZGGDKCIY';
    var socketUrl = 'wss://stream.cryptowat.ch/connect?apikey='+API_KEY;

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    // Helper method for subscribing to resources
    function subscribe(resources) {
        sendMessage(JSON.stringify({
                subscribe: {
                subscriptions: resources.map((resource) => { return { streamSubscription: { resource: resource } } })
            }
        }));
    }

    if (lastMessage != null){
        //const message = JSON.parse(lastMessage.data);
        new Response(lastMessage.data).arrayBuffer().then(buffer=> {
            var enc = new TextDecoder("utf-8");
            const stockInfoJSON = JSON.parse(enc.decode(buffer));

            if (stockInfoJSON["authenticationResult"] && stockInfoJSON["authenticationResult"]["status"] === "AUTHENTICATED") {
                console.log("Streaming trades for 1 second...")
                subscribe(['instruments:9:trades']);
            }

            if (stockInfoJSON["marketUpdate"] && stockInfoJSON["marketUpdate"]["tradesUpdate"]){
                useWebSocketPrice(stockInfoJSON["marketUpdate"]["tradesUpdate"]["trades"][0]["priceStr"]);
            }
            
        })
    }

    useEffect(() => {
        if (readyState === 1) {
          console.log("Websocket connection established")
          subscribe(['instruments:9:trades'])
        }
    }, [readyState]);


    return (
        <div>
            <div className="mb-4">
                <h1 className="block text-gray-700 text-lm font-bold mb-2">Price: {websocketPrice}</h1>
            </div>
        </div> 
    )
}