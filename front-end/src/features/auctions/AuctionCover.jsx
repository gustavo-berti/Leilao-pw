import { useState, useEffect } from 'react';
import { Galleria } from 'primereact/galleria';
import { ProgressSpinner } from 'primereact/progressspinner';
import ImageService from '../../services/imageService';

export const AuctionCover = ({ auctionId }) => {
    const imageService = new ImageService();
    const [images, setImages] = useState(null);
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

    const itemTemplate = (item) => {
        return <img src={item.itemImageSrc} alt={item.alt} />;
    }

    if (loading) {
        return <div className='product-image'>
            <ProgressSpinner />
        </div>;
    }

    if (!images || images.length === 0) {
        return (
            <div className="product-image">
                <span>Sem fotos</span>
            </div>
        );
    }

    return (
        <div className="product-image">
            <Galleria
                value={images}
                numVisible={1}
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