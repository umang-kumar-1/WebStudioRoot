import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ImageManagementWebPartStrings';
import ImageManagementContextProvider from './components/ImageManagementContextProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { PhotoGalleryService } from './services/PhotoGalleryService';

export interface IImageManagementWebPartProps {
  description: string;
  targetLibrary: string;
  context: any;
}

export default class ImageManagementWebPart extends BaseClientSideWebPart<IImageManagementWebPartProps> {

  public render(): void {
    const service = new PhotoGalleryService(this.context);
    const element: React.ReactElement<any> = React.createElement(
      ImageManagementContextProvider,
      {
        context: this.context,
        targetLibrary: this.properties.targetLibrary || "Images",
        service: service
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return super.onInit();
  }
  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('targetLibrary', {
                  label: "Target Image Library Name"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
