import { PossibleValueDto } from './possible-value.dto';

export class PossibleValuesHolder {
    fieldId!: string;
    possibleValues: PossibleValueDto[] = [];

    constructor(fieldId: string, possibleValues: PossibleValueDto[]) {
        this.fieldId = fieldId;
        this.possibleValues = possibleValues;
    }
}
