export class ErrorDialogData {
    dialogTitle: string;
    errorMessage: string;

    constructor(errorMessage: string, dialogTitle: string) {
        this.errorMessage = errorMessage;
        this.dialogTitle = dialogTitle;
    }
}
