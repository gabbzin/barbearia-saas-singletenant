import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

interface CardTableProps {
  titleCard: string;
  linkText?: string;
  url?: string;
  tableTitles: string[];
  classNameCard?: string;
  children: ReactNode;
}

export function CardTable(props: CardTableProps) {
  return (
    <Card
      className={`w-full overflow-hidden rounded-3xl border bg-card shadow-sm ${props.classNameCard}`}
    >
      <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
        <CardTitle className="font-bold text-lg">{props.titleCard}</CardTitle>
        {props.url && props.linkText ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={props.url}>{props.linkText}</Link>
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="p-0">
        <Table className="w-full text-left">
          <TableHeader className="border-b bg-muted/40">
            <TableRow>
              {props.tableTitles.map(item => (
                <TableHead
                  key={item}
                  className="px-6 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide"
                >
                  {item}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="">{props.children}</TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
