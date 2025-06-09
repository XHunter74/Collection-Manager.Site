export interface BaseItemModel {
    Id: string;
    CollectionId: string;
    Created: Date;
    Updated: Date;

    [key: string]: unknown;
}
