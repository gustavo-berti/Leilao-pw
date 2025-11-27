import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './auction.scss';

const Auction = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [auctions, setAuctions] = useState([
        { id: 1, title: 'Leilão 1', description: 'Descrição do leilão 1', minimalBid: 100, status: 'ativo', dateHourEnd: '2024-12-31 23:59' },
        { id: 2, title: 'Leilão 2', description: 'Descrição do leilão 2', minimalBid: 200, status: 'ativo', dateHourEnd: '2024-11-30 23:59' },
        { id: 3, title: 'Leilão 3', description: 'Descrição do leilão 3', minimalBid: 300, status: 'encerrado', dateHourEnd: '2024-10-31 23:59' },
    ]);

    const calculateTimeRemaining = (endDate) => {
        return endDate; // Implementar cálculo real de tempo restante
    }

    const fetchAuctions = async () => {
        // Lógica para buscar leilões da API
    }

    const renderAuctionCards = () => {
        return auctions.map(auction => (
            <Card 
                key={auction.id} 
                title={auction.title} 
                subTitle={`Lance Mínimo: R$ ${auction.minimalBid} - Status: ${auction.status} - Término: ${calculateTimeRemaining(auction.dateHourEnd)}`} 
                footer={user ? <Button label="Participar do Leilão" icon="pi pi-gavel"/> : <strong>Faça login para participar</strong>}>
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
                        <Button label="Logue para criar leilão" icon="pi pi-sign-in" className="p-button-danger"/>}
                </div>
            </div>
            <div className='auction-content'>
                {renderAuctionCards()}
            </div>
        </>
    );
};

export default Auction;