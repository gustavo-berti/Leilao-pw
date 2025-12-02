import { useState, useEffect } from 'react';
import { Galleria } from 'primereact/galleria';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import ImageService from '../../services/imageService';

export const AuctionCover = ({ auctionId, isEditable = false, onImageDeleted }) => {
    const imageService = new ImageService();
    const [images, setImages] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const loadImages = async () => {
            try {
                const imageData = await imageService.getImagesByAuctionId(auctionId);
                if (isMounted) {
                    if (imageData && imageData.length > 0) {
                        const promises = imageData.map(async (img) => {
                            const blobUrl = await imageService.getImageUrl(img.imageName);
                            return {
                                itemImageSrc: blobUrl,
                                alt: img.imageName,
                                id: img.id,
                                title: `Imagem do leilão ${auctionId}`
                            };
                        });
                        const formattedImages = await Promise.all(promises);
                        if (isMounted) {
                            setImages(formattedImages);
                        }
                    } else {
                        setImages([]);
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadImages();
        return () => { isMounted = false; };
    }, [auctionId]);

    const handleDeleteImage = (image) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir esta imagem?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: async () => {
                try {
                    await imageService.delete(image.id);
                    const newImages = images.filter(img => img.id !== image.id);
                    setImages(newImages);
                    if (activeIndex >= newImages.length) {
                        setActiveIndex(Math.max(0, newImages.length - 1));
                    }
                    if (onImageDeleted) onImageDeleted(image.id);
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };

    const itemTemplate = (item) => {
        if (!item) {
            return null;
        }   
        return (
            <>
                <img src={item.itemImageSrc} alt={item.alt} />
                {isEditable && (
                    <Button
                        icon="pi pi-trash"
                        className="p-button-danger delete-image-button"
                        onClick={() => handleDeleteImage(item)}
                        tooltip="Excluir imagem"
                    />
                )}
            </>
        );
    }

    if (loading) {
        return <div className='product-image'>
            <ProgressSpinner />
        </div>;
    }

    if (!images || images.length === 0) {
        return (
            <div className="product-image">
                <span>{isEditable ? "Nenhuma imagem salva." : "Sem fotos"}</span>
            </div>
        );
    }

    return (
        <div className="product-image">
            <ConfirmDialog />
            <Galleria
                value={images}
                numVisible={1}
                activeIndex={activeIndex}
                onItemChange={(e)=>setActiveIndex(e.index)}
                circular
                showThumbnails={false}
                showIndicators={images.length > 1}
                showItemNavigators={images.length > 1}
                item={itemTemplate}
                style={{ maxWidth: '100%' }}
            />
        </div>
    );
};

export default AuctionCover;