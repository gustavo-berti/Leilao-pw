import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { useNavigate } from 'react-router-dom';
import AuctionService from '../../services/auctionService';
import './auction.scss';

const Auction = () => {
    const navigate = useNavigate();
    const auctionService = new AuctionService();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [auctions, setAuctions] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(6);
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    useEffect(() => {
        fetchAuctions();

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const calculateTimeRemaining = (endDate) => {
        const diff = new Date(endDate) - currentTime;
        if (diff <= 0) return "Leilão Encerrado";
        const days = Math.floor(diff / DAY);
        const hours = Math.floor((diff % DAY) / HOUR);
        const minutes = Math.floor((diff % HOUR) / MINUTE);
        const seconds = Math.floor((diff % MINUTE) / SECOND);
        endDate = `${days > 0 ? days + "d " : ""}${hours > 0 ? hours + "h " : ""}${minutes > 0 ? minutes + "m " : ""}${seconds}s`;
        return endDate;
    }

    const fetchAuctions = async () => {
        const data = await auctionService.getAll();
        setAuctions(data.content);
        console.log(data);
    }

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const renderAuctionCards = () => {
        const paginatedAuctions = auctions.slice(first, first + rows);
        return paginatedAuctions.map(auction => (
            <Card
                key={auction.id}
                title={`${auction.title} - ${auction.status}`}
                subTitle={`Lance Mínimo: R$ ${auction.minimalBid} - Término: ${calculateTimeRemaining(auction.dateHourEnd)}`}
                footer={user ? <Button label="Participar do Leilão" icon="pi pi-gavel" /> : <strong>Faça login para participar</strong>}>
                {auction.description}
            </Card>
        ));
    };

    return (
        <>
            <div className='auction-header'>
                <h2>Leilões Disponíveis</h2>
                <div>
                    <Button label="Atualizar Leilões" icon="pi pi-refresh" onClick={fetchAuctions} />
                    <Button label="Filtrar Leilões" icon="pi pi-filter" className="p-button-info" />
                    {user ?
                        <Button label="Criar Novo Leilão" icon="pi pi-plus" className="p-button-success" onClick={() => navigate('/leiloes/criar')} /> :
                        <Button label="Logue para criar leilão" icon="pi pi-sign-in" className="p-button-danger" />}
                </div>
            </div>
            <div className='auction-content'>
                {renderAuctionCards()}
            </div>
            <Paginator
                first={first}
                rows={rows}
                totalRecords={auctions.length}
                onPageChange={onPageChange}
            />
        </>
    );
};

export default Auction;