import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { calculateTimeRemaining, formatDateBR } from "../../../utils/functions";
import LongContainer from "../../../components/longContainer/longContainer";
import AuctionService from "../../../services/auctionService";
import AuctionCover from "../AuctionCover";
import websocketService from "../../../services/websocketService";
import BidService from "../../../services/bidService";

const auctionDetail = () => {
    const auctionService = new AuctionService();
    const bidService = new BidService();
    const { id } = useParams();
    const [auction, setAuction] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [currentTime, setCurrentTime] = useState(new Date());
    const [bidValue, setBidValue] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        fecthAuction();

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        websocketService.connect(() => {
            websocketService.subscribeToAuction(id, handleNewBid);
            websocketService.setErrorCallback((errorMessage) => {
                setError(errorMessage);
                setTimeout(() => setError(null), 5000);
            });
        });

        return () => {
            clearInterval(timer);
            websocketService.unsubscribeFromAuction(id);
            websocketService.disconnect();
        };
    }, [id])

    const fecthAuction = async () => {
        const data = await auctionService.findById(id);
        setAuction(data);
        const currentValue = await bidService.fetchValue(id);
        setBidValue(currentValue || 0);
    }

    const handleNewBid = (bid) => {
        setBidValue(prevBid => prevBid + bid.bidValue);
    }

    const placeBid = () => {
        try {
            setError(null);
            const bid = {
                auctionId: auction.id,
                bidValue: bidValue ? auction.incrementValue : auction.minimalBid,
                userEmail: user.email
            };
            websocketService.sendBid(bid);
        } catch (error) {
            setError(error);
        }
    }

    return (
        <>
            <LongContainer>
                <h2>{auction.title}</h2>
                <div className="column-2">
                    <div className="product-image">
                        <AuctionCover auctionId={id} />
                    </div>
                    <div>
                        <p><strong>Descrição:</strong> {auction.detailedDescription}</p>
                        <p><strong>Valor Atual:</strong> {bidValue ? "R$ " + bidValue : "Sem lance"}</p>
                        <p><strong>Lance Minimo:</strong> R$ {auction.minimalBid}</p>
                        <p><strong>Valor do Incremento:</strong> R$ {auction.incrementValue}</p>
                        <p><strong>Data de Início:</strong> {formatDateBR(auction.dateHourStart)}</p>
                        <p><strong>Data de Término:</strong> {calculateTimeRemaining(auction.dateHourEnd)}</p>
                        <p><strong>Email do Criador:</strong> {auction.userEmail}</p>
                        <p><strong>Status:</strong> {auction.status}</p>
                        <div>
                            {user ? <Button label="Dar Lance" icon="pi pi-gavel" onClick={placeBid} /> : <p>Faça login para dar um lance!</p>}
                        </div>
                            {error && <small className="p-error">{error}</small>}
                    </div>
                </div>
            </LongContainer>
        </>
    )
}

export default auctionDetail;