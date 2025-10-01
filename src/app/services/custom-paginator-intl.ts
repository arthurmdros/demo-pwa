import { MatPaginatorIntl } from '@angular/material/paginator';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  // Remove ou altera o label "Items per page"
  customPaginatorIntl.itemsPerPageLabel = 'Itens por página'; // ou '' para remover

  // Opcional: traduzir outros labels também
  customPaginatorIntl.nextPageLabel = 'Próxima';
  customPaginatorIntl.previousPageLabel = 'Anterior';
  customPaginatorIntl.firstPageLabel = 'Primeira página';
  customPaginatorIntl.lastPageLabel = 'Última página';

  // Personalizar range de exibição
  customPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    const startIndex = page * pageSize;
    // Evita index > length
    const endIndex = startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;
    return `${startIndex + 1} – ${endIndex} de ${length}`;
  };

  return customPaginatorIntl;
}
