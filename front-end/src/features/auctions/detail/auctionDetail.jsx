import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LongContainer from "../../../components/longContainer/longContainer";
import AuctionService from "../../../services/auctionService";
import { calculateTimeRemaining } from "../../../utils/functions";

const auctionDetail = () => {
    const auctionService = new AuctionService();
    const { id } = useParams();
    const [auction, setAuction] = useState([]);

    useEffect(() => {
        fecthAuction();
    }, [])

    const fecthAuction = async () => {
        setAuction(await auctionService.findById(id));
    }

    return (
        <>
            <LongContainer>
                <h2>{auction.title}</h2>
                <h4>{auction.category?.name}</h4>
                <p><strong>Descrição:</strong> {auction.description}</p>
                <p><strong>Valor Inicial:</strong> R$ {auction.minimalBid}</p>
                <p><strong>Valor do Incremento:</strong> R$ {auction.incrementValue}</p>
                <p><strong>Data de Início:</strong> {new Date(auction.dateHourStart).toLocaleString()}</p>
                <p><strong>Data de Término:</strong> {calculateTimeRemaining(auction.dateHourEnd)}</p>
                <p><strong>Email do Criador:</strong> {auction.userEmail}</p>
                <p><strong>Status:</strong> {auction.status}</p>
            </LongContainer>
        </>
    )
}

export default auctionDetail;