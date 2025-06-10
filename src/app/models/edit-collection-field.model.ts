import { CollectionFieldDto } from './collection-field.dto';
import { FieldTypeDto } from './field-type.dto';

export class EditCollectionFieldModel {
    fieldTypes: FieldTypeDto[] = [];
    field: CollectionFieldDto | undefined;
}
