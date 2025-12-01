import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
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

    useEffect(() => {
        fecthAuction();

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        websocketService.connect(() => {
            websocketService.subscribeToAuction(id, handleNewBid);
        });

        return () => clearInterval(timer);
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
        const bid = {
            auctionId: auction.id,
            bidValue: bidValue ? auction.incrementValue : auction.minimalBid,
            userEmail: user.email
        };
        websocketService.sendBid(bid);
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
                        {user ? <Button label="Dar Lance" icon="pi pi-gavel" onClick={placeBid} /> : <p>Faça login para dar um lance!</p>}
                    </div>
                </div>
            </LongContainer>
        </>
    )
}

export default auctionDetail;