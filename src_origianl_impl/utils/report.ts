import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportReport(element: HTMLElement, format: 'png' | 'pdf', filename = 'report') {
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  if (format === 'png') {
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${filename}.png`;
    link.click();
    return;
  }
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgProps = pdf.getImageProperties(imgData);
  const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
  const width = imgProps.width * ratio;
  const height = imgProps.height * ratio;
  pdf.addImage(imgData, 'PNG', (pageWidth - width) / 2, 10, width, height);
  pdf.save(`${filename}.pdf`);
}
