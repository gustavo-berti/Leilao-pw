import { useState, useEffect, useMemo } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNavigate } from 'react-router-dom';
import AuctionService from '../../services/auctionService';
import { calculateTimeRemaining } from '../../utils/functions';
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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAuctions(0, rows);

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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
                    footer={<Button label="Detalhes" icon="pi pi-gavel" onClick={() => navigate(`/leiloes/${auction.id}`)} />}>
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
                {loading ? <ProgressSpinner /> : renderAuctionCards()}
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