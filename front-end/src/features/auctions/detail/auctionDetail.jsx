import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { calculateTimeRemaining, formatDateBR } from "../../../utils/functions";
import LongContainer from "../../../components/longContainer/longContainer";
import AuctionService from "../../../services/auctionService";
import AuctionCover from "../AuctionCover";
import websocketService from "../../../services/websocketService";

const auctionDetail = () => {
    const auctionService = new AuctionService();
    const { id } = useParams();
    const [auction, setAuction] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [currentTime, setCurrentTime] = useState(new Date());
    const [bidValue, setBidValue] = useState(auction.minimalBid);
    const [currentBid, setCurrentBid] = useState(0);

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
        setCurrentBid(data.minimalBid);
        setBidValue(data.minimalBid + data.incrementValue);
    }

    const handleNewBid = (bid) => {
        setCurrentBid(bid.bidValue);
        setBidValue(bid.bidValue + auction.incrementValue);
    }

    const placeBid = () => {
        if (bidValue < currentBid + auction.incrementValue) {
            alert('O lance deve ser maior que o lance atual mais o incremento');
            return;
        }

        const bid = {
            auctionId: auction.id,
            bidValue: bidValue,
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
                        <p><strong>Valor Inicial:</strong> R$ {auction.minimalBid}</p>
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