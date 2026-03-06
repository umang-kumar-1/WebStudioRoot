export interface Folder {
  id: number;
  name: string;
}

export interface Image {
  id: number;
  folderId: number;
  src: string;
  name: string;
  title: string;
  description: string;
  created?: string;
  modified?: string;
  modifiedDate?: string;
  author?: string;
  editor?: string;
  uniqueId?: string;
  authorId?: number;
  editorId?: number;
}

export enum FilterType {
  NONE = 'none',
  GRAYSCALE = 'grayscale(100%)',
  SEPIA = 'sepia(100%)',
  INVERT = 'invert(100%)',
  BLUR = 'blur(5px)',
}

export interface Dimensions {
  width: number;
  height: number;
}
