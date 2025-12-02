import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import AuctionService from '../../services/auctionService.js';

const PersonalAuctions = ({ email }) => {
    const navigate = useNavigate();
    const auctionService = new AuctionService();
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPersonalAuctions = async (page = first / rows, size = rows) => {
        try {
            setLoading(true);
            const data = await auctionService.getAuctionsByUserEmail(email, page, size);
            console.log(data);
            setTotalElements(data.totalElements);
            setAuctions(data.content);
        } catch (err) {
            setError(err.message || 'Erro ao carregar leilões.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPersonalAuctions();
    }, [email]);

    return (
        <>
            <div>
                <h2>Meus Leilões</h2>
                {loading ? <ProgressSpinner /> : error ? <p>{error}</p> : (
                    <DataTable value={auctions} paginator rows={rows} first={first} totalRecords={totalElements} lazy
                        onPage={(e) => {
                            setFirst(e.first);
                            setRows(e.rows);
                            fetchPersonalAuctions(e.page, e.rows);
                        }}>
                        <Column field="title" header="Título" />
                        <Column field="status" header="Status" />
                        <Column header="Editar" body={(rowData) => <Button label="Editar" onClick={() => navigate(`/leiloes/editar/${rowData.id}`)} />} />
                    </DataTable>
                )}
            </div>
        </>
    );
};

export default PersonalAuctions;