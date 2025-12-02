import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { OverlayPanel } from 'primereact/overlaypanel';
import AuctionCover from './AuctionCover';
import FilterPopup from './FilterPopup';
import AuctionService from '../../services/auctionService';
import { calculateTimeRemaining } from '../../utils/functions';
import './auction.scss';

const Auction = () => {
    const navigate = useNavigate();
    const auctionService = new AuctionService();
    const filterPanel = useRef(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [auctions, setAuctions] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(6);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({
        title: "",
        dateHourEnd: "",
        categoryId: "",
        status: "",
        orderBy: "id",
        direction: "ASC"
    });

    useEffect(() => {
        fetchAuctions(0, rows);

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, [filter]);

    const fetchAuctions = async (page, size) => {
        try {
            setLoading(true);
            const data = await auctionService.getAll(page, size, filter.title, filter.dateHourEnd, filter.categoryId, filter.status, filter.orderBy, filter.direction);
            setTotalElements(data.totalElements);
            setAuctions(data.content);
        } catch (error) {
            console.error("Erro ao buscar leilões:", error);
        } finally {
            setLoading(false);
        }
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
                    subTitle={`Valor atual: R$ ${auction.value} - Término: ${calculateTimeRemaining(auction.dateHourEnd)}`}
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
                    <Button label="Filtrar Leilões" icon="pi pi-filter" className="p-button-info" onClick={(e) => filterPanel.current.toggle(e)} />
                    {user ?
                        <Button label="Criar Novo Leilão" icon="pi pi-plus" className="p-button-success" onClick={() => navigate('/leiloes/criar')} /> :
                        <Button label="Logue para criar leilão" icon="pi pi-sign-in" className="p-button-danger" />}
                    <OverlayPanel ref={filterPanel} className='popup'>
                        <FilterPopup ref={filterPanel} filter={filter} setFilter={setFilter} fetchAuctions={fetchAuctions} />
                    </OverlayPanel>
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