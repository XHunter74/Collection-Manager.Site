import { CollectionFieldDto } from './collection-field.dto';
import { CollectionDto } from './collection.dto';
import { PossibleValuesHolder } from './possible-values.holder';

export class CollectionMetadataModel {
    collection!: CollectionDto;
    possibleValues: PossibleValuesHolder[] = [];
    fields: CollectionFieldDto[] = [];

    constructor(
        collection: CollectionDto,
        fields: CollectionFieldDto[] = [],
        possibleValues: PossibleValuesHolder[] = [],
    ) {
        this.collection = collection;
        this.fields = fields;
        this.possibleValues = possibleValues;
    }
}
