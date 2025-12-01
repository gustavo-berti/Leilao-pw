import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { calculateTimeRemaining, formatDateBR } from "../../../utils/functions";
import LongContainer from "../../../components/longContainer/longContainer";
import AuctionService from "../../../services/auctionService";
import AuctionCover from "../AuctionCover";

const auctionDetail = () => {
    const auctionService = new AuctionService();
    const { id } = useParams();
    const [auction, setAuction] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fecthAuction();

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, [])

    const fecthAuction = async () => {
        setAuction(await auctionService.findById(id));
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
                        <p><strong>Descrição:</strong> {auction.description}</p>
                        <p><strong>Valor Inicial:</strong> R$ {auction.minimalBid}</p>
                        <p><strong>Valor do Incremento:</strong> R$ {auction.incrementValue}</p>
                        <p><strong>Data de Início:</strong> {formatDateBR(auction.dateHourStart)}</p>
                        <p><strong>Data de Término:</strong> {calculateTimeRemaining(auction.dateHourEnd)}</p>
                        <p><strong>Email do Criador:</strong> {auction.userEmail}</p>
                        <p><strong>Status:</strong> {auction.status}</p>
                        {user ? <Button label="Dar Lance" icon="pi pi-gavel" /> : <p>Faça login para dar um lance!</p>}
                    </div>
                </div>
            </LongContainer>
        </>
    )
}

export default auctionDetail;