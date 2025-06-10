export class CollectionFieldDto {
    id: string | undefined;
    name: string | undefined;
    description?: string;
    type: number | undefined;
    isSystem: boolean | undefined;
    typeName: string | undefined;
    isRequired: boolean | undefined;
    order: number | undefined;
}
