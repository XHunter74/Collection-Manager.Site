export class BaseItemModel {
    id: string | undefined;
    collectionId: string | undefined;
    displayName: string | undefined;
    picture: string | undefined;
    values: ItemValue[] = [];
    created: Date | undefined;
    updated: Date | undefined;
}

export class ItemValue {
    fieldId!: string;
    fieldName!: string;
    value!: any;
}
