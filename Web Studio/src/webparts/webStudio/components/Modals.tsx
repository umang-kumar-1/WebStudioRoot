import * as React from 'react';
import { useStore, getTranslation } from '../store';
import { ModalType } from '../types';

// Imported Isolated Managers
import { NavigationManager } from './modals/NavigationManager';
import { NewsManager } from './modals/NewsManager';
import { EventManager } from './modals/EventManager';
import { DocumentManager } from './modals/DocumentManager';
import { FooterManager } from './modals/FooterManager';
import { SiteManager } from './modals/SiteManager';
import { ContainerEditorModal } from './modals/ContainerEditor'; // Import Shared Editor
import { SliderManager } from './modals/SliderManager'; // Import Isolated Slider Manager
import { LabelEditorModal } from './modals/LabelEditor';
import { ThemeEditor } from './modals/ThemeEditor';
// import { ImageManager } from './modals/ImageManager';
import { TranslationManager } from './modals/TranslationManager';
import { PermissionManager } from './modals/PermissionManager';
import { ContactQueryManager } from './modals/ContactQueryManager';
import { PageInfoEditor } from './modals/PageInfoEditor';
import { ContainerItemManager } from './modals/ContainerItemManager';
import { ContactManager } from './modals/ContactManager';
import { GenericModal, SharedVersionHistoryModal } from './modals/SharedModals';

// --- Photogallery Module Integration ---
import ImageManagementParent from '../../imageManagement/components/ImageManagementParent';
import { PhotoGalleryService } from '../../imageManagement/services/PhotoGalleryService';
import { useSPContext } from '../contexts/SPServiceContext';

// --- Modal Manager ---
export const ModalManager: React.FC = () => {
  const { activeModal, closeModal, setEditingContainerId, currentLanguage } = useStore();
  const { context } = useSPContext();

  // Initialize service for photogallery integration
  const photoGalleryService = React.useMemo(() => new PhotoGalleryService(context), [context]);

  if (activeModal === ModalType.NONE) return null;

  const handleClose = () => {
    closeModal();
    setEditingContainerId(null); // Ensure shared editor state is cleared
  };

  const renderModal = () => {
    switch (activeModal) {
      case ModalType.NAVIGATION:
        return <NavigationManager onClose={handleClose} />;
      case ModalType.SITE_MGMT:
        return <SiteManager onClose={handleClose} />;
      case ModalType.CONTAINER_EDITOR: // Shared Editor for non-slider
        return <ContainerEditorModal onClose={handleClose} />;
      case ModalType.SLIDER_MANAGER: // Isolated Slider Manager
        return <SliderManager onClose={handleClose} />;
      case ModalType.STYLING:
        return <ThemeEditor />;
      case ModalType.LABEL_EDITOR:
        return <LabelEditorModal />;
      case ModalType.NEWS:
        return <NewsManager onClose={handleClose} />;
      case ModalType.EVENTS:
        return <EventManager onClose={handleClose} />;
      case ModalType.DOCUMENTS:
        return <DocumentManager onClose={handleClose} />;
      case ModalType.FOOTER:
        return <FooterManager onClose={handleClose} />;
      case ModalType.IMAGES:
        // return <ImageManager onClose={handleClose} />;
        return (
          <GenericModal
            title={getTranslation('IMG_MGMT', currentLanguage)}
            onClose={handleClose}
            width="w-[95vw] max-w-[1400px]"
            noFooter={true}
          >
            <div className="h-[85vh] overflow-hidden" style={{ margin: '-14px -21px' }}>
              <ImageManagementParent
                context={context}
                service={photoGalleryService}
                targetLibrary="Images"
              />
            </div>
          </GenericModal>
        );
      case ModalType.TRANSLATION:
        return <TranslationManager onClose={handleClose} />;
      case ModalType.PERMISSIONS:
        return <PermissionManager onClose={handleClose} />;
      case ModalType.CONTACT_QUERIES:
        return <ContactQueryManager onClose={handleClose} />;
      case ModalType.CONTACTS:
        return <ContactManager onClose={handleClose} />;
      case ModalType.PAGE_INFO:
        return <PageInfoEditor onClose={handleClose} />;
      case ModalType.VERSION_HISTORY:
        return <SharedVersionHistoryModal onClose={handleClose} />;
      case ModalType.CONTAINER_ITEMS:
        return <ContainerItemManager onClose={handleClose} />;
      default:
        return (
          <GenericModal title={getTranslation('MSG_COMING_SOON', currentLanguage)} onClose={handleClose}>
            <div className="text-gray-500 italic p-8 text-center">
              {getTranslation('MSG_MODULE_UNDER_DEV', currentLanguage).replace('{modal}', activeModal)}
            </div>
          </GenericModal>
        );
    }
  };

  // For most modals we want the overlay logic here, but for portals (like PageInfoEditor), 
  // they might implement their own overlay. 
  // However, PageInfoEditor uses createPortal with its own overlay.
  // To avoid double overlay for portal components, we can just render them directly.
  // But our existing structure wraps everything in a fixed overlay in ModalManager return.

  // Refined Strategy: 
  // If the component uses Portal internally (like PageInfoEditor created above), 
  // we should just return null here OR adjust ModalManager to not wrap if portal is used.
  // Current PageInfoEditor uses createPortal(..., document.body).
  // If we render it inside ModalManager which ALSO has a fixed overlay, we get two overlays.

  // FIX: PageInfoEditor handles its own portal. We should just return the component.
  // BUT ModalManager wraps everything in:
  /*
    <div className="fixed inset-0 z-50 ...">
      ...
         {renderModal()}
      ...
    </div>
  */

  // Since PageInfoEditor.tsx uses `createPortal`, it breaks out of the ModalManager DOM hierarchy anyway.
  // So it will be rendered at body level.
  // The ModalManager's overlay will still be present underneath it (z-50 vs z-120).
  // This is acceptable, but might darken the screen twice.
  // Let's modify ModalManager to check if the modal handles its own portal/overlay.

  // Simpler approach for this environment:
  // Render just the component if it handles itself.

  if (activeModal === ModalType.PAGE_INFO || activeModal === ModalType.VERSION_HISTORY) {
    return renderModal();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className="relative z-10 w-full flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          {renderModal()}
        </div>
      </div>
    </div>
  );
};
