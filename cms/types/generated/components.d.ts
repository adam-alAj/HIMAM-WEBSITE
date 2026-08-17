import type { Schema, Struct } from '@strapi/strapi';

export interface ServiceFeature extends Struct.ComponentSchema {
  collectionName: 'components_service_features';
  info: {
    description: 'A single key feature of a service, rendered as a checklist item.';
    displayName: 'Feature';
    icon: 'check';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'service.feature': ServiceFeature;
    }
  }
}
