import { jsPDF } from "jspdf";


export function exportPDF(root: HTMLElement) {
    const doc = new jsPDF();
    doc.html(root, {
        callback: (d) => d.save("test.pdf")
    });
}