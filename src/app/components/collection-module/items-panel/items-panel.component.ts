import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CollectionDto } from '../../../models/collection.dto';
import { CollectionsService } from '../../../services/collections.service';
import { CollectionFieldDto } from '../../../models/collection-field.dto';
import { PossibleValuesHolder } from '../../../models/possible-values.holder';
import { CollectionMetadataModel } from '../../../models/collection-metadata.model';
import { forkJoin, map, of, switchMap } from 'rxjs';

@Component({
    selector: 'app-items',
    templateUrl: './items-panel.component.html',
    styleUrl: './items-panel.component.css',
    standalone: false,
})
export class ItemsPanelComponent implements OnChanges {
    @Input() currentCollection: CollectionDto | null = null;
    selectedItemId: string | null = null;
    collectionMetadata: CollectionMetadataModel | null = null;

    constructor(private collectionService: CollectionsService) {}

    ngOnChanges(changes: SimpleChanges): void {
        console.log(this.collectionMetadata === null);
        if (
            this.collectionMetadata === null ||
            (changes['currentCollection'] &&
                changes['currentCollection']?.previousValue?.id !==
                    changes['currentCollection']?.currentValue?.id)
        ) {
            this.selectedItemId = null;
            this.loadCollectionMetadata();
        }
    }

    loadCollectionMetadata(): void {
        if (!this.currentCollection) {
            this.collectionMetadata = null;
            return;
        }
        this.collectionService
            .loadCollectionFields(this.currentCollection.id!)
            .pipe(
                switchMap((fields: CollectionFieldDto[]) => {
                    fields = fields.sort((a, b) => a.order! - b.order!);
                    const selectFields = fields.filter((f) => f.type === 10);
                    if (selectFields.length === 0) {
                        return of({ fields, possibleValues: [] });
                    }
                    const possibleValues$ = selectFields.map((field) =>
                        this.collectionService
                            .loadPossibleValues(field.id!)
                            .pipe(map((values) => new PossibleValuesHolder(field.id!, values))),
                    );
                    return forkJoin(possibleValues$).pipe(
                        map((possibleValues) => ({
                            fields,
                            possibleValues,
                        })),
                    );
                }),
            )
            .subscribe({
                next: ({ fields, possibleValues }) => {
                    this.collectionMetadata = new CollectionMetadataModel(
                        this.currentCollection!,
                        fields,
                        possibleValues,
                    );
                },
                error: (err: any) => {
                    console.error('Error loading collection metadata:', err);
                    this.collectionMetadata = null;
                },
            });
    }
}
