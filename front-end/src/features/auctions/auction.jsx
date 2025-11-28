import { useState, useEffect, useMemo } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { Carousel } from 'primereact/carousel';
import { useNavigate } from 'react-router-dom';
import AuctionService from '../../services/auctionService';
import AuctionCover from './AuctionCover';
import './auction.scss';

const Auction = () => {
    const navigate = useNavigate();
    const auctionService = new AuctionService();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [auctions, setAuctions] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(6);
    const [totalElements, setTotalElements] = useState(0);
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    useEffect(() => {
        fetchAuctions(0, rows);

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

    const fetchAuctions = async (page, size) => {
        const data = await auctionService.getAll(page, size);
        setTotalElements(data.totalElements);
        setAuctions(data.content);
    }

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
        fetchAuctions(event.page, event.rows);
    };

    const renderAuctionCards = () => {
        return auctions.map(auction => {
            return (
                <Card
                    key={auction.id}
                    title={`${auction.title} - ${auction.status}`}
                    subTitle={`Lance Mínimo: R$ ${auction.minimalBid} - Término: ${calculateTimeRemaining(auction.dateHourEnd)}`}
                    footer={user ? <Button label="Participar do Leilão" icon="pi pi-gavel" /> : <strong>Faça login para participar</strong>}>
                    <AuctionCover auctionId={auction.id} />
                    <p>{auction.description}</p>
                </Card>
            );
        });
    };

    return (
        <>
            <div className='auction-header'>
                <h2>Leilões Disponíveis</h2>
                <div>
                    <Button label="Atualizar Leilões" icon="pi pi-refresh" onClick={() => fetchAuctions(first / rows, rows)} />
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
                totalRecords={totalElements}
                onPageChange={onPageChange}
            />
        </>
    );
};

export default Auction;