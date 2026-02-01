import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ClaimsTableProps {
  data: Record<string, unknown>;
}

export function ClaimsTable({ data }: ClaimsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Claim</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(data).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell>{key}</TableCell>
            <TableCell>{JSON.stringify(value)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
