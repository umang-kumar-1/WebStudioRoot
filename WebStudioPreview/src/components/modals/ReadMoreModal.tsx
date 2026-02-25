
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { GenericModal } from './SharedModals';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export const ReadMoreModal = ({ item, onClose, isNumbered, index }: any) => {
    // Resolve images: support both 'images' array and single 'img'/'imageUrl' property
    const images = item.images && item.images.length > 0
        ? item.images
        : (item.img || item.imageUrl ? [item.img || item.imageUrl] : []);

    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    const nextImg = () => setCurrentImgIndex((prev) => (prev + 1) % images.length);
    const prevImg = () => setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);

    const customFooter = (
        <div className="flex justify-end">
            <button onClick={onClose} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm transition-colors">Close</button>
        </div>
    );

    return createPortal(
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <GenericModal
                title={item.title}
                onClose={onClose}
                width="w-[1000px]"
                noFooter={true}
                customFooter={customFooter}
            >
                <div className="flex flex-col h-full max-h-[70vh] overflow-y-auto pr-2">
                    {/* Image Section */}
                    {images.length > 0 && (
                        <div className="w-full h-[400px] bg-gray-100 relative mb-8 rounded-sm overflow-hidden flex-shrink-0 group">
                            <img
                                src={images[currentImgIndex]}
                                className="w-full h-full object-cover"
                                alt={item.title}
                            />
                            {images.length > 1 && (
                                <>
                                    <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors shadow-sm opacity-0 group-hover:opacity-100"><ChevronLeft className="w-5 h-5 text-gray-800" /></button>
                                    <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors shadow-sm opacity-0 group-hover:opacity-100"><ChevronRight className="w-5 h-5 text-gray-800" /></button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm font-bold">
                                        {currentImgIndex + 1} / {images.length}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Content Section */}
                    <div className="space-y-6 px-1 pb-4">
                        <div className="flex items-start justify-between gap-6">
                            <div className="space-y-3">
                                <h2 className="text-3xl font-bold text-gray-900 leading-tight">{item.title}</h2>
                                {item.date && (
                                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--primary-color)]">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(item.date).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </div>
                                )}
                            </div>
                            {isNumbered && (
                                <div className="text-6xl font-bold text-gray-100 font-mono select-none tracking-tighter">
                                    {(index + 1).toString().padStart(2, '0')}
                                </div>
                            )}
                        </div>

                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                            {item.desc || item.description || "No description available."}
                        </div>
                    </div>
                </div>
            </GenericModal>
        </div>,
        document.body
    );
};
