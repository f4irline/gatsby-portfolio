export const downloadFile = (blob: Blob, fileName: string): void => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.setAttribute('download', fileName);
    anchor.click();
    anchor.remove();
};
