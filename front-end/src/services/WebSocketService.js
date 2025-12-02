import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.subscriptions = {};
    }

    connect(onConnected) {
        this.stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => {
                console.log('STOMP: ' + str);
            }
        });

        this.stompClient.onConnect = (frame) => {
            console.log('Connected: ', frame);
            if (onConnected) onConnected();
            this.stompClient.subscribe('/user/queue/errors', (message) => {
                if (this.errorCallback) {
                    console.log("Erro recebido:", message.body);
                    this.errorCallback(message.body);
                }
            });
        };

        this.stompClient.onStompError = (frame) => {
            console.error('Broker error: ' + frame.headers['message']);
            console.error('Details: ' + frame.body);
        };

        this.stompClient.activate();
    }

    subscribeToAuction(auctionId, callback) {
        if (this.stompClient && this.stompClient.connected) {
            const subscription = this.stompClient.subscribe(
                `/topic/auction/${auctionId}`,
                (message) => {
                    const bid = JSON.parse(message.body);
                    callback(bid);
                }
            );
            this.subscriptions[auctionId] = subscription;
        }
    }

    setErrorCallback(callback) {
        this.errorCallback = callback;
    }

    unsubscribeFromAuction(auctionId) {
        if (this.subscriptions[auctionId]) {
            this.subscriptions[auctionId].unsubscribe();
            delete this.subscriptions[auctionId];
        }
    }

    sendBid(bid) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({
                destination: '/app/bid',
                body: JSON.stringify(bid)
            });
        }
    }

    disconnect() {
        if (this.stompClient) {
            Object.keys(this.subscriptions).forEach(key => {
                this.subscriptions[key].unsubscribe();
            });
            this.stompClient.deactivate();
        }
    }
}

export default new WebSocketService();