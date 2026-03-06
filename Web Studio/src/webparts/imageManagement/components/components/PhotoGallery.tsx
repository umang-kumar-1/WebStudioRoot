import { Image } from '../types';
import * as React from "react";
import { useStore, getTranslation } from "./../../../webStudio/store";

interface PhotoGalleryProps {
  images: Image[];
  galleryTitle: string;
  onAddImage: () => void;
  onEditImage: (image: Image) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  images,
  galleryTitle,
  onAddImage,
  onEditImage,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { currentLanguage } = useStore();

  const filteredImages = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return images;
    }
    return images.filter(
      (image) =>
        image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [images, searchQuery]);

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <h4 className="mb-0 text-nowrap">
            {getTranslation('LABEL_GALLERY', currentLanguage)}: <span className="siteColor">{galleryTitle}</span>
          </h4>
          <div
            className="position-relative d-inline-block"
            style={{ minWidth: "350px", maxWidth: "450px" }}
          >
            <input
              type="text"
              className="form-control pe-5"
              placeholder={getTranslation('PH_IMG_SEARCH', currentLanguage)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {searchQuery ? (
              <span
                className="position-absolute top-50 end-0 translate-middle-y me-1"
                onClick={() => setSearchQuery("")}
                style={{ cursor: "pointer", padding: "5px" }}
              >
                <i className="bi bi-x-lg text-secondary" title="Clear search"></i>
              </span>
            ) : (
              <span
                className="position-absolute top-50 end-0 translate-middle-y me-1"
                style={{ pointerEvents: "none", padding: "5px" }}
              >
                <i className="bi bi-search text-secondary"></i>
              </span>
            )}
          </div>
        </div>
        <button className="btn btn-primary btn-lg" onClick={onAddImage}>
          <div className="d-flex align-items-center gap-1">
            <i className="bi bi-plus-lg icon-theme" title={getTranslation('BTN_ADD_IMAGE', currentLanguage)}></i>
            <span>{getTranslation('BTN_ADD_IMAGE', currentLanguage)}</span>
          </div>
        </button>
      </div>
      <div className="row g-4 flex-grow-1" style={{ overflowY: "auto" }}>
        {filteredImages.length > 0 ? (
          filteredImages.map((image) => (
            <div key={image.id} className="col-xl-4 col-md-6">
              <div className="card h-100 shadow-sm d-flex flex-column" style={{ maxHeight: '400px' }}>
                <img
                  src={image.src}
                  className="card-img-top"
                  alt={image.title}
                  style={{ height: "250px", objectFit: "cover", cursor: "pointer" }}
                  onClick={() => onEditImage(image)}
                />
                <div className="card-body">
                  <h5 className="card-title text-truncate" title={image.title || image.name}>
                    {image.title ? image.title : image.name}
                  </h5>
                  <p className="card-text text-muted small text-truncate">
                    {image.description || ""}
                  </p>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => onEditImage(image)}
                    style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "5px" }}
                  >
                    <i className="bi bi-pencil-square icon-theme"></i> {getTranslation('BTN_EDIT', currentLanguage)}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="text-center p-5 bg-light rounded">
              {searchQuery ? (
                <>
                  <h2>{getTranslation('MSG_NO_RESULTS', currentLanguage)} "{searchQuery}"</h2>
                  <p className="lead text-muted">
                    {getTranslation('MSG_TRY_DIFFERENT_SEARCH', currentLanguage)}
                  </p>
                </>
              ) : (
                <>
                  <h2>{getTranslation('MSG_FOLDER_EMPTY', currentLanguage)}</h2>
                  <p className="lead text-muted">
                    {getTranslation('MSG_FOLDER_EMPTY_DESC', currentLanguage)}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGallery;