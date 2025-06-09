export class CollectionFieldDto {
    id: string | undefined;
    name: string | undefined;
    description?: string;
    type: number | undefined;
    isRequired: boolean | undefined;
    order: number | undefined;
}
