import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { RadioButton } from 'primereact/radiobutton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { formatDateBR } from '../../utils/functions';
import AuctionService from '../../services/auctionService';
import PaymentService from '../../services/paymentService';
import LongContainer from '../../components/longContainer/longContainer';
import BidService from '../../services/bidService';


const Payment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const auctionService = new AuctionService();
    const paymentService = new PaymentService();
    const bidService = new BidService();
    const [total, setTotal] = useState(0);
    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');

    useEffect(() => {
        fetchAuction();
    }, [id]);

    const fetchAuction = async () => {
        try {
            const data = await auctionService.findById(id);
            const bidValue = await bidService.fetchValue(id);
            setTotal(bidValue);
            setAuction(data);
        } catch (error) {
            console.error(error);
            navigate('/404');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setProcessing(true);
        setError(null);
        try {
            await paymentService.pay(id);
            setTimeout(() => {
                navigate('/leiloes');
            }, 3000);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Erro ao processar o pagamento.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div><ProgressSpinner /></div>;

    return (
        <LongContainer>
            <h2>Checkout Seguro</h2>
            <h3>Resumo do Pedido</h3>
            <div>
                <span className="font-bold">Produto:</span>
                <span>{auction?.title}</span>
            </div>
            <div>
                <span className="font-bold">Vencedor:</span>
                <span>{auction?.userName}</span>
            </div>
            <div>
                <span className="font-bold">Data Encerramento:</span>
                <span>{formatDateBR(auction?.dateHourEnd)}</span>
            </div>
            <div>
                <span>Total a Pagar:</span>
                <span>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                </span>
            </div>
            <h3>Dados de Pagamento</h3>
            <div className="p-field">
                <div className="field-radiobutton">
                    <RadioButton inputId="cc" name="method" value="credit_card" onChange={(e) => setPaymentMethod(e.value)} checked={paymentMethod === 'credit_card'} />
                    <label htmlFor="cc">Cartão de Crédito</label>
                </div>
                <div className="field-radiobutton">
                    <RadioButton inputId="pix" name="method" value="pix" onChange={(e) => setPaymentMethod(e.value)} checked={paymentMethod === 'pix'} />
                    <label htmlFor="pix" className="ml-2">PIX</label>
                </div>
            </div>
            {paymentMethod === 'credit_card' ? (
                <div>
                    <div className="p-field">
                        <label>Número do Cartão</label>
                        <InputMask mask="9999-9999-9999-9999" placeholder="0000-0000-0000-0000" className="w-full" />
                    </div>
                    <div className="p-field">
                        <label>Nome no Cartão</label>
                        <InputText placeholder="Nome como impresso" className="w-full" />
                    </div>
                    <div className="p-field">
                        <label>Validade</label>
                        <InputMask mask="99/99" placeholder="MM/AA" className="w-full" />
                    </div>
                    <div className="p-field">
                        <label>CVV</label>
                        <InputMask mask="999" placeholder="123" className="w-full" />
                    </div>
                </div>
            ) : (
                <div>
                    <i></i>
                    <p>Escaneie o QR Code para pagar (Simulação)</p>
                </div>
            )}
            <div className="p-field">
                <Button
                    label={processing ? "Processando..." : "Confirmar Pagamento"}
                    icon="pi pi-check"
                    style={{ marginTop: "10px" }}
                    className="p-button-success"
                    onClick={handlePayment}
                    loading={processing}
                />
                {error && <small className="p-error">{error}</small>}
            </div>
        </LongContainer>
    );
};

export default Payment;